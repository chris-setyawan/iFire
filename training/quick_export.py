from ultralytics import YOLO
from pathlib import Path
import shutil
import pandas as pd

def main():
    print("="*80)
    print("EXPORT FIRE DETECTION MODEL")
    print("="*80)
    print()

    model_path = Path("fire_detection/fire_detector6/weights/best.pt")
    
    print(f"Model: {model_path}")
    print()

    # Read results
    results_csv = Path("fire_detection/fire_detector6/results.csv")
    if results_csv.exists():
        print("Training Results:")
        df = pd.read_csv(results_csv)
        last = df.iloc[-1]
        
        map50 = last.get('metrics/mAP50(B)', 0)
        precision = last.get('metrics/precision(B)', 0)
        recall = last.get('metrics/recall(B)', 0)
        
        print(f"   mAP50:     {map50:.3f} ({map50*100:.1f}%)")
        print(f"   Precision: {precision:.3f} ({precision*100:.1f}%)")
        print(f"   Recall:    {recall:.3f} ({recall*100:.1f}%)")
        print()
    
    model = YOLO(model_path)
    
    print("Exporting to TensorFlow.js...")
    tfjs_path = model.export(format='tfjs')
    print(f"Exported!")
    print()
    
    deploy = Path("exports/fire_detection_final")
    deploy.mkdir(parents=True, exist_ok=True)
    
    tfjs_dest = deploy / "tfjs_model"
    if tfjs_dest.exists():
        shutil.rmtree(tfjs_dest)
    shutil.copytree(tfjs_path, tfjs_dest)
    
    shutil.copy(model_path, deploy / "best.pt")
    
    print("="*80)
    print("DONE!")
    print("="*80)
    print(f"\nLocation: {deploy.absolute()}")
    print(f"\nCopy to Next.js:")
    print(f"   {(deploy / 'tfjs_model').absolute()}")
    print(f"   → your-nextjs/public/models/fire-detection/")
    input("\nPress Enter to exit...")

if __name__ == '__main__':
    main()