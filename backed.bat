@echo off
echo Starting the backend server...
cd Backend
uvicorn main:app --host 0.0.0.0 --port 8000
pause
