@echo off
echo ================================
echo YOLOv8 Fire Detection Setup
echo ================================

echo Creating virtual environment...
python -m venv venv

echo.
echo Activating environment...
call venv\Scripts\activate.bat

echo.
echo Installing packages...
python -m pip install --upgrade pip
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install ultralytics roboflow tensorflowjs opencv-python pillow pyyaml tqdm

echo.
echo Verifying CUDA...
python -c "import torch; print('CUDA Available:', torch.cuda.is_available()); print('GPU:', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'No GPU'); print('CUDA Version:', torch.version.cuda if torch.cuda.is_available() else 'N/A')"

echo.
echo ================================
echo Setup Complete!
echo ================================
pause