@echo off
setlocal

echo ==========================================
echo    AI Workflow Chatbot - Auto Starter
echo ==========================================

:: Check if venv exists
if not exist "venv" (
    echo [1/3] Virtual environment not found. Creating one...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo Failed to create virtual environment. Please ensure Python is installed and in your PATH.
        pause
        exit /b %errorlevel%
    )
) else (
    echo [1/3] Virtual environment found.
)

:: Activate venv and install requirements
echo [2/3] Activating environment and checking dependencies...
call venv\Scripts\activate
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install dependencies.
    pause
    exit /b %errorlevel%
)

:: Run the app
echo [3/3] Starting AI Workflow Chatbot...
echo The app will be available at http://127.0.0.1:5000
python app.py

pause
