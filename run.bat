@echo off
echo ==========================================
echo    AI Workflow Chatbot - Runner
echo ==========================================

if not exist "venv" (
    echo Virtual environment not found. Please run setup.bat or run__all.bat first.
    pause
    exit /b 1
)

echo Activating environment...
call venv\Scripts\activate
echo Starting app...
python app.py

pause
