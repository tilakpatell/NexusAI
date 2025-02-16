#!/usr/bin/env python3
import os
import numpy as np
import tensorflow as tf
from pathlib import Path
import cv2
from tqdm import tqdm

class ThreatDetector:
    def __init__(self):
        self.base_dir = Path.home() / 'threat_detection_project'
        self.sequence_length = 4  # Reduced from 8 to 4
        self.image_size = (32, 32)  # Reduced from 64x64 to 32x32
        self.data_dir = self.base_dir / 'SCVD' / 'SCVD_converted_sec_split'
        self.max_videos_per_category = 300  # Limited videos per category

    def process_video(self, video_path):
        """Optimized video processing"""
        sequences = []
        frames = []
        
        cap = cv2.VideoCapture(str(video_path))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # Skip frames to reduce processing
        frame_skip = max(1, total_frames // (self.sequence_length * 2))
        frame_count = 0
        
        while len(frames) < self.sequence_length:
            ret, frame = cap.read()
            if not ret:
                break
            
            if frame_count % frame_skip == 0:
                # Convert to grayscale
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                frame = cv2.resize(frame, self.image_size)
                frame = frame.astype(np.float32) / 255.0
                frame = frame[..., np.newaxis]  # Add channel dimension
                frames.append(frame)
            
            frame_count += 1
        
        cap.release()
        
        if len(frames) == self.sequence_length:
            sequences.append(np.array(frames))
        
        return sequences

    def load_data(self, split='Train'):
        """Load and process videos"""
        X = []
        y = []
        
        split_dir = self.data_dir / split
        categories = ['Normal', 'Violence', 'Weaponized']
        
        print(f"\nLoading {split} data...")
        for idx, category in enumerate(categories):
            category_dir = split_dir / category
            if not category_dir.exists():
                print(f"Warning: Directory not found - {category_dir}")
                continue
            
            # Get random subset of videos
            video_files = list(category_dir.glob('*.avi'))
            np.random.shuffle(video_files)
            selected_videos = video_files[:self.max_videos_per_category]
            
            print(f"Processing {len(selected_videos)} videos from {category}")
            for video_path in tqdm(selected_videos, desc=category):
                sequences = self.process_video(video_path)
                if sequences:
                    X.extend(sequences)
                    y.extend([idx] * len(sequences))
        
        return np.array(X), np.array(y)

    def build_model(self):
        """Lightweight model for Jetson Nano"""
        model = tf.keras.Sequential([
            # Input layer
            tf.keras.layers.Input(shape=(self.sequence_length, 
                                       self.image_size[0], 
                                       self.image_size[1], 
                                       1)),  # 1 channel (grayscale)
            
            # First ConvLSTM layer
            tf.keras.layers.ConvLSTM2D(
                filters=16,  # Reduced filters
                kernel_size=(3, 3),
                padding='same',
                return_sequences=True,
                activation='relu'
            ),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.MaxPooling3D(pool_size=(1, 2, 2)),
            
            # Second ConvLSTM layer
            tf.keras.layers.ConvLSTM2D(
                filters=32,
                kernel_size=(3, 3),
                padding='same',
                return_sequences=False,
                activation='relu'
            ),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.MaxPooling2D(pool_size=(2, 2)),
            
            # Dense layers
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.Dropout(0.5),
            tf.keras.layers.Dense(3, activation='softmax')
        ])
        
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        return model

    def train(self, epochs=10):
        # Clear memory
        tf.keras.backend.clear_session()
        
        print("Loading training data...")
        X_train, y_train = self.load_data('Train')
        
        print("Loading validation data...")
        X_val, y_val = self.load_data('Test')
        
        if len(X_train) == 0:
            raise Exception("No training data loaded!")
            
        print(f"\nTraining data shape: {X_train.shape}")
        print(f"Validation data shape: {X_val.shape}")
        
        model = self.build_model()
        print("\nModel Summary:")
        model.summary()
        
        history = model.fit(
            X_train, y_train,
            validation_data=(X_val, y_val),
            epochs=epochs,
            batch_size=16,
            callbacks=[
                tf.keras.callbacks.EarlyStopping(
                    monitor='val_loss',
                    patience=2,
                    restore_best_weights=True
                ),
                tf.keras.callbacks.ModelCheckpoint(
                    str(self.base_dir / 'best_model.keras'),
                    save_best_only=True
                ),
                tf.keras.callbacks.ReduceLROnPlateau(
                    monitor='val_loss',
                    factor=0.5,
                    patience=1
                )
            ]
        )
        
        return history

def main():
    # Configure GPU memory growth
    gpus = tf.config.experimental.list_physical_devices('GPU')
    if gpus:
        try:
            for gpu in gpus:
                tf.config.experimental.set_memory_growth(gpu, True)
                # Limit GPU memory
                tf.config.set_logical_device_configuration(
                    gpu,
                    [tf.config.LogicalDeviceConfiguration(memory_limit=1024)]
                )
        except RuntimeError as e:
            print(f"GPU error: {e}")
    
    trainer = ThreatDetector()
    
    try:
        print("Starting training...")
        history = trainer.train()
        print("\nTraining complete!")
        
        # Save training history
        np.save(
            str(Path.home() / 'threat_detection_project' / 'training_history.npy'), 
            history.history
        )
        
    except Exception as e:
        print(f"\nError during training: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
