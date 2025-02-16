#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from geometry_msgs.msg import Twist
from cv_bridge import CvBridge
import cv2
import numpy as np
import tensorflow as tf
import os
from datetime import datetime
from threading import Lock
import traceback
import asyncio
import websockets
import json
import base64
import threading

class ThreatDetectionNode(Node):
    def __init__(self):
        super().__init__('threat_detection_node')
        
        # WebSocket setup
        self.websocket_server = None
        self.connected_clients = set()
        self.ws_lock = Lock()
        
        # Parameters
        self.declare_parameter('confidence_threshold', 0.75)
        self.declare_parameter('image_size', [32, 32])
        self.declare_parameter('sequence_length', 4)
        self.declare_parameter('model_path', '/home/jetson/ros2_ws/best_model.keras')
        self.declare_parameter('websocket_port', 8765)
        
        # Get parameters
        self.confidence_threshold = self.get_parameter('confidence_threshold').value
        self.image_size = tuple(self.get_parameter('image_size').value)
        self.sequence_length = self.get_parameter('sequence_length').value
        self.model_path = self.get_parameter('model_path').value
        self.websocket_port = self.get_parameter('websocket_port').value
        
        self.bridge = CvBridge()
        self.frame_buffer = []
        self.display_frame = None
        self.predictions = None
        self.buffer_lock = Lock()
        
        # Configure GPU
        self.configure_gpu()

        # Load model
        try:
            self.model = tf.keras.models.load_model(self.model_path)
            self.get_logger().info('Model loaded successfully')
            self.get_logger().info('Model architecture:')
            self.model.summary(print_fn=lambda x: self.get_logger().info(x))
            self.get_logger().info(f'Model input shape: {self.model.input_shape}')
        except Exception as e:
            self.get_logger().error(f'Failed to load model: {str(e)}')
            self.get_logger().error(traceback.format_exc())
            raise

        # Start WebSocket server in a separate thread
        self.ws_thread = threading.Thread(target=self.start_websocket_server)
        self.ws_thread.daemon = True
        self.ws_thread.start()

        # Subscribers and display setup
        self.camera_subscription = self.create_subscription(
            Image,
            '/image_raw',
            self.camera_callback,
            10
        )
        
        cv2.namedWindow('Threat Detection', cv2.WINDOW_NORMAL)
        cv2.resizeWindow('Threat Detection', 640, 480)
        
        # Create timer for display updates
        self.create_timer(0.033, self.update_display)  # ~30 FPS display refresh
        
        self.get_logger().info('Threat Detection Node initialized')

    async def websocket_handler(self, websocket, path):
        """Handle WebSocket connections"""
        try:
            async with self.ws_lock:
                self.connected_clients.add(websocket)
            
            self.get_logger().info(f'Client connected. Total clients: {len(self.connected_clients)}')
            
            try:
                await websocket.wait_closed()
            finally:
                async with self.ws_lock:
                    self.connected_clients.remove(websocket)
                self.get_logger().info(f'Client disconnected. Remaining clients: {len(self.connected_clients)}')
                
        except Exception as e:
            self.get_logger().error(f'WebSocket handler error: {str(e)}')

    def start_websocket_server(self):
        """Start WebSocket server in asyncio event loop"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        start_server = websockets.serve(
            self.websocket_handler,
            "0.0.0.0",
            self.websocket_port
        )
        
        loop.run_until_complete(start_server)
        self.get_logger().info(f'WebSocket server started on port {self.websocket_port}')
        loop.run_forever()

    async def broadcast_frame(self, frame, predictions=None):
        """Broadcast frame and predictions to all connected clients"""
        if not self.connected_clients:
            return
            
        try:
            # Convert frame to JPEG
            _, buffer = cv2.imencode('.jpg', frame)
            # Convert to base64
            frame_b64 = base64.b64encode(buffer).decode('utf-8')
            
            # Prepare message
            message = {
                'frame': frame_b64,
                'predictions': None if predictions is None else predictions.tolist()
            }
            
            # Broadcast to all clients
            websockets.broadcast(self.connected_clients, json.dumps(message))
            
        except Exception as e:
            self.get_logger().error(f'Broadcast error: {str(e)}')

    def configure_gpu(self):
        gpus = tf.config.experimental.list_physical_devices('GPU')
        if gpus:
            try:
                for gpu in gpus:
                    tf.config.experimental.set_memory_growth(gpu, True)
                    tf.config.set_logical_device_configuration(
                        gpu,
                        [tf.config.LogicalDeviceConfiguration(memory_limit=1024)]
                    )
                    self.get_logger().info(f'Configured GPU: {gpu}')
            except RuntimeError as e:
                self.get_logger().error(f'GPU configuration error: {str(e)}')

    def preprocess_frame(self, frame):
        try:
            # Keep original for display
            display_frame = cv2.resize(frame, (640, 480))
            
            # Process for model
            frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            resized_gray = cv2.resize(frame_gray, self.image_size)
            
            # Normalize to [-1, 1]
            processed = (resized_gray.astype(np.float32) / 127.5) - 1
            processed = processed[..., np.newaxis]
            
            return processed, display_frame
            
        except Exception as e:
            self.get_logger().error(f'Preprocessing error: {str(e)}')
            self.get_logger().error(traceback.format_exc())
            return None, None

    def camera_callback(self, msg: Image):
        try:
            cv_image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')
            processed_frame, display_frame = self.preprocess_frame(cv_image)
            
            if processed_frame is not None:
                with self.buffer_lock:
                    self.frame_buffer.append(processed_frame)
                    if len(self.frame_buffer) > self.sequence_length:
                        self.frame_buffer.pop(0)
                    
                    if len(self.frame_buffer) == self.sequence_length:
                        batch = np.stack(self.frame_buffer)
                        batch = np.expand_dims(batch, axis=0)
                        
                        self.predictions = self.model.predict(batch, verbose=0)
                        
                        # Send frame and predictions over WebSocket
                        asyncio.run(self.broadcast_frame(display_frame, self.predictions))
                    
                    self.display_frame = display_frame
                    
        except Exception as e:
            self.get_logger().error(f'Camera callback error: {str(e)}')
            self.get_logger().error(traceback.format_exc())

    def update_display(self):
        if self.display_frame is None:
            return
            
        try:
            with self.buffer_lock:
                display_frame = self.display_frame.copy()
                predictions = self.predictions
                buffer_len = len(self.frame_buffer)
            
            h, w = display_frame.shape[:2]
            
            if predictions is not None:
                normal_prob = float(predictions[0][0])
                violence_prob = float(predictions[0][1])
                weapon_prob = float(predictions[0][2])
                
                # Background for overlay
                overlay = np.zeros((120, w, 3), dtype=np.uint8)
                
                # Draw prediction bars
                bar_width = int(w * 0.3)
                
                # Normal (green)
                cv2.rectangle(overlay, (10, 20), (10 + int(bar_width * normal_prob), 40),
                            (0, 255, 0), -1)
                cv2.putText(overlay, f'Normal: {normal_prob:.2f}', (bar_width + 20, 35),
                          cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
                
                # Violence (yellow)
                cv2.rectangle(overlay, (10, 50), (10 + int(bar_width * violence_prob), 70),
                            (0, 255, 255), -1)
                cv2.putText(overlay, f'Violence: {violence_prob:.2f}', (bar_width + 20, 65),
                          cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
                
                # Weapon (red)
                cv2.rectangle(overlay, (10, 80), (10 + int(bar_width * weapon_prob), 100),
                            (0, 0, 255), -1)
                cv2.putText(overlay, f'Weapon: {weapon_prob:.2f}', (bar_width + 20, 95),
                          cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                
                # Add overlay to bottom of frame
                display_frame[-120:] = cv2.addWeighted(display_frame[-120:], 0.5, overlay, 0.5, 0)
                
                # Add threat warning if detected
                if violence_prob > self.confidence_threshold or weapon_prob > self.confidence_threshold:
                    cv2.putText(display_frame, 'THREAT DETECTED', (int(w/2)-100, 50),
                              cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)
            else:
                # Show buffer status
                cv2.putText(display_frame, f'Buffering: {buffer_len}/{self.sequence_length}',
                          (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)
            
            cv2.imshow('Threat Detection', display_frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                self.destroy_node()
                rclpy.shutdown()
                    
        except Exception as e:
            self.get_logger().error(f'Display update error: {str(e)}')
            self.get_logger().error(traceback.format_exc())

    def __del__(self):
        cv2.destroyAllWindows()

def main(args=None):
    rclpy.init(args=args)
    
    try:
        node = ThreatDetectionNode()
        rclpy.spin(node)
    except Exception as e:
        print(f'Node error: {str(e)}')
        print(traceback.format_exc())
    finally:
        cv2.destroyAllWindows()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
