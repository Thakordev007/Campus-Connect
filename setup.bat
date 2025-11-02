@echo off
REM Campus Connect Setup Script for Windows

echo 🚀 Setting up Campus Connect...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is required but not installed.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is required but not installed.
    exit /b 1
)

echo 📦 Setting up backend...

REM Backend setup
cd backend

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy env.example .env
    echo ✅ .env file created. Please update it with your configuration.
)

REM Run migrations
echo Running database migrations...
python manage.py makemigrations
python manage.py migrate

REM Create superuser
echo Creating superuser...
echo Please create a superuser account:
python manage.py createsuperuser

REM Seed database
echo Seeding database with sample data...
python manage.py seed_data

echo ✅ Backend setup complete!

REM Frontend setup
echo 📦 Setting up frontend...
cd ..\frontend

REM Install Node.js dependencies
echo Installing Node.js dependencies...
npm install

echo ✅ Frontend setup complete!

echo.
echo 🎉 Setup complete! To start the application:
echo.
echo Backend:
echo   cd backend
echo   venv\Scripts\activate
echo   python manage.py runserver
echo.
echo Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo The application will be available at:
echo   Frontend: http://localhost:5173
echo   Backend: http://localhost:8000
echo.
echo Demo credentials:
echo   Admin: admin / admin123
echo   Faculty: john_doe / faculty123
echo   Student: alice_johnson / student123

pause
