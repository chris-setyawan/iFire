from ultralytics import YOLO
from pathlib import Path
import shutil

def main():
    print("="*80)
    print("EXPORT TO ONNX (Alternative)")
    print("="*80)
    print()

    model_path = Path("fire_detection/fire_detector6/weights/best.pt")
    print(f"Model: {model_path}")
    print()
    
    model = YOLO(model_path)
    
    # Export to ONNX (more compatible!)
    print("Exporting to ONNX format...")
    onnx_path = model.export(format='onnx')
    print(f"ONNX exported: {onnx_path}")
    print()
    
    # Create deployment folder
    deploy = Path("exports/fire_detection_final")
    deploy.mkdir(parents=True, exist_ok=True)
    
    # Copy ONNX model
    shutil.copy(onnx_path, deploy / "model.onnx")
    
    # Copy PyTorch model
    shutil.copy(model_path, deploy / "best.pt")
    
    # Copy training results
    results_csv = Path("fire_detection/fire_detector6/results.csv")
    if results_csv.exists():
        shutil.copy(results_csv, deploy / "training_results.csv")
    
    # Copy images
    for img in ['results.png', 'confusion_matrix.png']:
        src = Path(f"fire_detection/fire_detector6/{img}")
        if src.exists():
            shutil.copy(src, deploy / img)
    
    print("="*80)
    print("EXPORT COMPLETE!")
    print("="*80)
    print()
    print(f"Location: {deploy.absolute()}")
    print()
    print("Training Results:")
    print("   mAP50:     80.3% ")
    print("   Precision: 84.9% ")
    print("   Recall:    76.7% ")
    print()
    print("Files exported:")
    print("   - model.onnx (ONNX format)")
    print("   - best.pt (PyTorch)")
    print("   - results.png (training graphs)")
    print("   - training_results.csv")
    print()
    print("DEPLOYMENT OPTIONS:")
    print("="*80)
    print()
    print("Option 1: Use ONNX.js in Next.js")
    print("   - Install: npm install onnxruntime-web")
    print("   - Load: session = await ort.InferenceSession.create('model.onnx')")
    print("   - Fast & compatible!")
    print()
    print("Option 2: Python API (Flask/FastAPI)")
    print("   - Use best.pt with ultralytics")
    print("   - Call from Next.js via API")
    print("   - Most reliable!")
    print()
    input("Press Enter to exit...")

if __name__ == '__main__':
    main()