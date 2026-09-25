from ultralytics import YOLO
from pathlib import Path

print("Finding trained model...")

# Find the model
model_path = Path("fire_detection/fire_detector6/weights/best.pt")

if not model_path.exists():
    print("Model not found!")
    # List all fire_detector folders
    base = Path("fire_detection")
    folders = [f for f in base.glob("fire_detector*") if f.is_dir()]
    print("\nAvailable folders:")
    for f in folders:
        print(f"  {f}")
    exit()

print(f"Model found: {model_path.absolute()}")
print()

# Load model
model = YOLO(model_path)

# Validate
print("Running validation...")
metrics = model.val()

print()
print("="*80)
print("VALIDATION RESULTS")
print("="*80)
print()
print(f"Metrics:")
print(f"   mAP50:     {metrics.box.map50:.3f} ({metrics.box.map50*100:.1f}%)")
print(f"   mAP50-95:  {metrics.box.map:.3f} ({metrics.box.map*100:.1f}%)")
print(f"   Precision: {metrics.box.p.mean():.3f} ({metrics.box.p.mean()*100:.1f}%)")
print(f"   Recall:    {metrics.box.r.mean():.3f} ({metrics.box.r.mean()*100:.1f}%)")
print()

# Per-class metrics
print("Per-Class Results:")
print(f"   Fire  - P: {metrics.box.p[0]:.3f}, R: {metrics.box.r[0]:.3f}")
print(f"   Smoke - P: {metrics.box.p[1]:.3f}, R: {metrics.box.r[1]:.3f}")
print()

if metrics.box.map50 >= 0.85:
    print("EXCELLENT accuracy!")
elif metrics.box.map50 >= 0.70:
    print("GOOD accuracy!")
elif metrics.box.map50 >= 0.60:
    print(" ACCEPTABLE accuracy")
else:
    print(" LOW accuracy - may need more training")

print()
print("="*80)
print(f"Model Location:")
print(f"   {model_path.absolute()}")
print("="*80)

input("\nPress Enter to exit...")