@echo off
echo ==========================================
echo    AI Workflow Chatbot - Setup
echo ==========================================

echo [1/2] Creating virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo Failed to create virtual environment.
    pause
    exit /b %errorlevel%
)

echo [2/2] Installing dependencies...
call venv\Scripts\activate
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install dependencies.
    pause
    exit /b %errorlevel%
)

echo Setup complete! You can now run the app using run.bat or run__all.bat.
pause
