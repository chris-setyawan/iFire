import os
import sys
from pathlib import Path
import time

def main():
    print("="*80)
    print("FIRE DETECTION TRAINING - SIMPLE VERSION")
    print("="*80)
    print()

    # Check CUDA
    import torch
    if not torch.cuda.is_available():
        print("CUDA not available!")
        input("Press Enter to exit...")
        sys.exit(1)

    print(f"GPU: {torch.cuda.get_device_name(0)}")
    print(f"CUDA: {torch.version.cuda}")
    print(f"Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
    print()

    # Import
    try:
        from ultralytics import YOLO
    except:
        print("Ultralytics not installed!")
        print("Run: pip install ultralytics")
        input("Press Enter to exit...")
        sys.exit(1)

    # Dataset path
    dataset_path = Path("datasets/fire_detection")

    # Check if dataset exists
    if not dataset_path.exists():
        print(f"Dataset folder not found: {dataset_path.absolute()}")
        input("\nPress Enter to exit...")
        sys.exit(1)

    # Check for data.yaml
    yaml_file = dataset_path / "data.yaml"
    if not yaml_file.exists():
        print("Creating data.yaml...")
        yaml_content = f"""path: {dataset_path.absolute()}
train: train/images
val: valid/images

names:
  0: fire
  1: smoke

nc: 2
"""
        with open(yaml_file, 'w') as f:
            f.write(yaml_content)
        print(f"Created: {yaml_file}")

    # Check images
    train_imgs = list((dataset_path / "train" / "images").glob("*.*"))
    val_imgs = list((dataset_path / "valid" / "images").glob("*.*"))

    print(f"Dataset Statistics:")
    print(f"   Training images: {len(train_imgs)}")
    print(f"   Validation images: {len(val_imgs)}")
    print(f"   Total: {len(train_imgs) + len(val_imgs)}")
    print()

    if len(train_imgs) < 10:
        print("Not enough training images!")
        input("\nPress Enter to exit...")
        sys.exit(1)

    print("="*80)
    print("STARTING TRAINING")
    print("="*80)
    print("Model: YOLOv8m (medium)")
    print("Epochs: 100")
    print("Batch: 16")
    print("Workers: 0")
    print("Image Size: 640x640")
    print()
    print("Expected time: 45-60 minutes on RTX 3090")
    print()
    print("Starting in 5 seconds...")
    print()

    try:
        time.sleep(5)
    except KeyboardInterrupt:
        print("\nCancelled")
        sys.exit(0)

    # Initialize model
    print("Loading YOLOv8m model...")
    model = YOLO('yolov8m.pt')

    # Train
    print("Starting training...")
    print()

    try:
        results = model.train(
            data=str(yaml_file),
            epochs=100,
            imgsz=640,
            batch=16,
            device=0,
            workers=0,
            patience=20,
            project='fire_detection',
            name='fire_detector',
            optimizer='AdamW',
            lr0=0.001,
            amp=True,
            save=True,
            plots=True,
            verbose=True,
        )
        
        print()
        print("="*80)
        print("TRAINING COMPLETE!")
        print("="*80)
        
    except Exception as e:
        print(f"\nTraining failed: {e}")
        input("\nPress Enter to exit...")
        sys.exit(1)

    # Validate
    print()
    print("="*80)
    print("VALIDATING MODEL")
    print("="*80)

    try:
        best_model_path = Path('fire_detection/fire_detector/weights/best.pt')
        best_model = YOLO(best_model_path)
        
        metrics = best_model.val()
        
        print()
        print(f"Results:")
        print(f"   mAP50:     {metrics.box.map50:.3f} (target: >0.70)")
        print(f"   mAP50-95:  {metrics.box.map:.3f} (target: >0.50)")
        print(f"   Precision: {metrics.box.p.mean():.3f} (target: >0.75)")
        print(f"   Recall:    {metrics.box.r.mean():.3f} (target: >0.70)")
        
        if metrics.box.map50 >= 0.70:
            print()
            print("Excellent accuracy!")
        
        print()
        print("="*80)
        print(f"Model saved: {best_model_path.absolute()}")
        print("="*80)
        
    except Exception as e:
        print(f"Validation failed: {e}")

    input("\nPress Enter to exit...")

if __name__ == '__main__':
    main()