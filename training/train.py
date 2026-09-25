import os
import sys
from pathlib import Path
import shutil
import time

print("="*80)
print("FIRE DETECTION TRAINING - RTX 3090")
print("="*80)
print()

# Check CUDA
try:
    import torch
    if not torch.cuda.is_available():
        print("ERROR: CUDA not available!")
        print("Please install CUDA and PyTorch with GPU support")
        input("Press Enter to exit...")
        sys.exit(1)
    
    print(f"GPU: {torch.cuda.get_device_name(0)}")
    print(f"CUDA: {torch.version.cuda}")
    print(f"Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
    print()
except Exception as e:
    print(f"Error checking CUDA: {e}")
    input("Press Enter to exit...")
    sys.exit(1)

# Import ultralytics
try:
    from ultralytics import YOLO
    from roboflow import Roboflow
    import yaml
except ImportError as e:
    print(f"Missing package: {e}")
    print("Run setup.bat first!")
    input("Press Enter to exit...")
    sys.exit(1)

# Get API Key
print("="*80)
print("ROBOFLOW SETUP")
print("="*80)
print()
print("1. Go to: https://app.roboflow.com")
print("2. Sign up (FREE account)")
print("3. Click your profile (top right) → Settings → API Keys")
print("4. Copy the API key")
print()

api_key = input("Paste your Roboflow API key here: ").strip()

if not api_key or len(api_key) < 10:
    print("Invalid API key!")
    input("Press Enter to exit...")
    sys.exit(1)

print()
print("="*80)
print("DOWNLOADING DATASET")
print("="*80)
print("Dataset: Fire Detection (Roboflow)")
print("Size: ~2000 images")
print("Classes: fire, smoke")
print()

try:
    rf = Roboflow(api_key=api_key)
    
    # Download fire detection dataset
    print("Downloading from Roboflow Universe...")
    project = rf.workspace("roboflow-universe").project("fire-detection-rvfp5")
    dataset = project.version(1).download("yolov8", location="datasets/fire_detection")
    
    dataset_path = Path("datasets/fire_detection")
    print(f"Dataset downloaded to: {dataset_path.absolute()}")
    
except Exception as e:
    print(f"Download failed: {e}")
    print()
    print("Alternative: Use public dataset link")
    print("Visit: https://universe.roboflow.com/search?q=fire%20detection")
    input("Press Enter to exit...")
    sys.exit(1)

# Verify dataset
print()
train_imgs = list((dataset_path / "train" / "images").glob("*"))
val_imgs = list((dataset_path / "valid" / "images").glob("*"))

print(f"Dataset Statistics:")
print(f"   Training images: {len(train_imgs)}")
print(f"   Validation images: {len(val_imgs)}")
print(f"   Total: {len(train_imgs) + len(val_imgs)}")

if len(train_imgs) < 50:
    print(" WARNING: Dataset seems too small")
    input("Press Enter to continue anyway...")

print()
print("="*80)
print("TRAINING MODEL")
print("="*80)
print("Model: YOLOv8m (medium - optimized for RTX 3090)")
print("Epochs: 100")
print("Batch Size: 32")
print("Image Size: 640x640")
print("Expected Time: 45-60 minutes")
print()
print("Training will start in 5 seconds...")
print("Press Ctrl+C to cancel")
print()

try:
    time.sleep(5)
except KeyboardInterrupt:
    print("\nCancelled by user")
    sys.exit(0)

# Training configuration
CONFIG = {
    'data': str(dataset_path / "data.yaml"),
    'epochs': 100,
    'imgsz': 640,
    'batch': 32,
    'device': 0,
    'workers': 8,
    'patience': 20,
    'project': 'fire_detection',
    'name': 'fire_detector',
    'optimizer': 'AdamW',
    'lr0': 0.001,
    'amp': True,
    'save': True,
    'plots': True,
}

# Initialize and train
print("Loading YOLOv8m model...")
model = YOLO('yolov8m.pt')

print("Starting training...")
print()

try:
    results = model.train(**CONFIG)
    print()
    print("Training complete!")
    
except Exception as e:
    print(f"\nTraining failed: {e}")
    input("Press Enter to exit...")
    sys.exit(1)

# Validation
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
    elif metrics.box.map50 >= 0.60:
        print()
        print(" Good accuracy, but could be better")
    else:
        print()
        print(" Low accuracy - consider training longer or using more data")
    
except Exception as e:
    print(f"Validation failed: {e}")
    input("Press Enter to exit...")
    sys.exit(1)

# Export to TensorFlow.js
print()
print("="*80)
print("EXPORTING TO TENSORFLOW.JS")
print("="*80)

try:
    print("Exporting model...")
    tfjs_path = best_model.export(format='tfjs')
    print(f"Exported to: {tfjs_path}")
    
except Exception as e:
    print(f"Export failed: {e}")
    input("Press Enter to exit...")
    sys.exit(1)

# Package for deployment
print()
print("="*80)
print("CREATING DEPLOYMENT PACKAGE")
print("="*80)

try:
    deploy_dir = Path("exports/fire_detection_model")
    deploy_dir.mkdir(parents=True, exist_ok=True)
    
    # Copy TensorFlow.js model
    tfjs_src = Path(tfjs_path)
    tfjs_dest = deploy_dir / "tfjs_model"
    if tfjs_dest.exists():
        shutil.rmtree(tfjs_dest)
    shutil.copytree(tfjs_src, tfjs_dest)
    
    # Copy PyTorch weights
    shutil.copy(best_model_path, deploy_dir / "best.pt")
    
    # Create README
    readme = f"""# Fire Detection Model - YOLOv8

## Training Results
- mAP50: {metrics.box.map50:.3f}
- mAP50-95: {metrics.box.map:.3f}
- Precision: {metrics.box.p.mean():.3f}
- Recall: {metrics.box.r.mean():.3f}

## Dataset
- Training images: {len(train_imgs)}
- Validation images: {len(val_imgs)}

## Model
- Base: YOLOv8m
- Input: 640x640
- Classes: fire, smoke

## Deployment Files
- tfjs_model/: TensorFlow.js model for web
- best.pt: PyTorch weights

## Usage in Next.js
1. Copy tfjs_model folder to: public/models/fire-detection/
2. Load model:
   const model = await tf.loadGraphModel("/models/fire-detection/model.json")
"""
    
    with open(deploy_dir / "README.md", 'w') as f:
        f.write(readme)
    
    print(f"Deployment package created!")
    print(f"   Location: {deploy_dir.absolute()}")
    
except Exception as e:
    print(f"Packaging failed: {e}")

# Final summary
print()
print("="*80)
print("TRAINING COMPLETE!")
print("="*80)
print()
print(f"Final Results:")
print(f"   Accuracy (mAP50): {metrics.box.map50:.1%}")
print(f"   Precision: {metrics.box.p.mean():.1%}")
print(f"   Recall: {metrics.box.r.mean():.1%}")
print()
print(f"Model Location:")
print(f"   {deploy_dir.absolute()}")
print()
print(f"Files in package:")
print(f"   - tfjs_model/model.json (TensorFlow.js model)")
print(f"   - tfjs_model/*.bin (weights)")
print(f"   - best.pt (PyTorch weights)")
print(f"   - README.md (info)")
print()
print("="*80)
print("NEXT STEPS:")
print("="*80)
print()
print("1. Copy model to Next.js:")
print(f"   Copy folder: {(deploy_dir / 'tfjs_model').absolute()}")
print(f"   To: your-nextjs-project/public/models/fire-detection/")
print()
print("2. Update your detection hook to use custom model")
print()
print("3. Test with fire images!")
print()
print("="*80)

input("\nPress Enter to exit...")