import urllib.request
import zipfile
from pathlib import Path
import shutil

print("="*80)
print("DOWNLOADING FIRE DETECTION DATASET")
print("="*80)
print()

# Clean old data
dataset_path = Path("datasets/fire_detection")
if dataset_path.exists():
    print("Removing old dataset...")
    shutil.rmtree(dataset_path)

dataset_path.mkdir(parents=True, exist_ok=True)

# Download from public URL
url = "https://public.roboflow.com/ds/z9Z8fHjPVV?key=zVPqNm9QIw"
zip_path = "datasets/fire_dataset.zip"

print(f"Downloading dataset...")
print(f"URL: {url}")
print(f"This may take 2-5 minutes...")
print()

try:
    # Download with progress
    def reporthook(count, block_size, total_size):
        percent = int(count * block_size * 100 / total_size)
        print(f"\rProgress: {percent}%", end='')
    
    urllib.request.urlretrieve(url, zip_path, reporthook)
    print("\n\nDownload complete!")
    
except Exception as e:
    print(f"\nDownload failed: {e}")
    print("\nPlease download manually:")
    print("1. Go to: https://universe.roboflow.com")
    print("2. Search: 'fire detection yolov8'")
    print("3. Find a PUBLIC dataset")
    print("4. Download as YOLOv8 format")
    print("5. Extract to: datasets/fire_detection/")
    input("\nPress Enter to exit...")
    exit()

# Extract
print("\nExtracting dataset...")
try:
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(dataset_path)
    
    print("Extraction complete!")
    
    # Remove zip
    Path(zip_path).unlink()
    
except Exception as e:
    print(f"Extraction failed: {e}")
    input("\nPress Enter to exit...")
    exit()

# Verify
train_imgs = list((dataset_path / "train" / "images").glob("*"))
val_imgs = list((dataset_path / "valid" / "images").glob("*"))

# Check alternate structure
if len(train_imgs) == 0:
    # Maybe extracted to subfolder
    subfolders = [f for f in dataset_path.iterdir() if f.is_dir()]
    if len(subfolders) == 1:
        # Move contents up
        subfolder = subfolders[0]
        for item in subfolder.iterdir():
            shutil.move(str(item), str(dataset_path / item.name))
        subfolder.rmdir()
        
        # Recheck
        train_imgs = list((dataset_path / "train" / "images").glob("*"))
        val_imgs = list((dataset_path / "valid" / "images").glob("*"))

print()
print("="*80)
print("DATASET READY!")
print("="*80)
print(f"Training images: {len(train_imgs)}")
print(f"Validation images: {len(val_imgs)}")
print(f"Total: {len(train_imgs) + len(val_imgs)}")
print()

if len(train_imgs) < 10:
    print(" Dataset seems incomplete")
else:
    print("Dataset is ready for training!")

input("\nPress Enter to exit...")