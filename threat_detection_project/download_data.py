#!/usr/bin/env python3
import os
import kagglehub
import shutil
import tensorflow as tf
import numpy as np
from pathlib import Path
import random
from tqdm import tqdm

def download_dataset():
    print("Downloading SCVD dataset...")
    path = kagglehub.dataset_download("toluwaniaremu/smartcity-cctv-violence-detection-dataset")
    print("Dataset downloaded to:", path)
    return path

def setup_project():
    base_dir = Path.home() / 'threat_detection_project'
    base_dir.mkdir(exist_ok=True)
    
    data_dir = base_dir / 'data'
    data_dir.mkdir(exist_ok=True)
    
    return base_dir, data_dir

def organize_dataset(dataset_path, data_dir, max_files_per_category=350):
    print("\nOrganizing dataset...")
    
    # SCVD categories
    categories = ['Normal', 'Violence', 'WeaponViolence']
    files_copied = {cat: 0 for cat in categories}
    total_size = 0
    
    dataset_path = Path(dataset_path)
    
    for category in categories:
        print(f"\nProcessing {category} category...")
        category_dir = data_dir / category
        category_dir.mkdir(exist_ok=True)
        
        # Look for files in the dataset
        source_dir = dataset_path / category
        if not source_dir.exists():
            print(f"Warning: {category} directory not found in dataset")
            continue
            
        # Get list of video files
        all_files = list(source_dir.glob('*.mp4'))
        if not all_files:
            print(f"Warning: No video files found for {category}")
            continue
            
        print(f"Found {len(all_files)} files for {category}")
        
        # Select random subset
        selected_files = random.sample(all_files, min(max_files_per_category, len(all_files)))
        
        # Copy files with progress bar
        print(f"Copying {len(selected_files)} files...")
        for video_file in tqdm(selected_files):
            dest_file = category_dir / video_file.name
            if not dest_file.exists():
                shutil.copy2(video_file, category_dir)
                total_size += video_file.stat().st_size
                files_copied[category] += 1
        
        print(f"Copied {files_copied[category]} files for {category}")
    
    return files_copied, total_size

def main():
    random.seed(42)
    
    try:
        # Download dataset
        dataset_path = download_dataset()
        print(f"Dataset downloaded to: {dataset_path}")
        
        # Setup project directories
        base_dir, data_dir = setup_project()
        
        # Organize dataset
        files_copied, total_size = organize_dataset(dataset_path, data_dir)
        
        # Print statistics
        print("\nDataset Statistics:")
        print("-" * 50)
        for category, count in files_copied.items():
            category_dir = data_dir / category
            if category_dir.exists():
                size = sum(f.stat().st_size for f in category_dir.glob('*.mp4'))
                print(f"{category}: {count} files ({size/1024/1024:.2f} MB)")
        
        print(f"\nTotal Size: {total_size/1024/1024:.2f} MB")
        print(f"Total Files: {sum(files_copied.values())}")
        print(f"\nDataset ready at: {data_dir}")
        
        # Clean up original download
        if Path(dataset_path).exists():
            print("\nCleaning up downloaded files...")
            shutil.rmtree(dataset_path)
        
    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # Cleanup on error
        if 'dataset_path' in locals() and Path(dataset_path).exists():
            print("\nCleaning up downloaded files...")
            shutil.rmtree(dataset_path)

if __name__ == "__main__":
    main()
