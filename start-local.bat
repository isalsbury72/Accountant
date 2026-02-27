@echo off
set PORT=4173
if not "%~1"=="" set PORT=%~1

echo Starting Accountant PWA at http://127.0.0.1:%PORT%
echo Keep this window open. Press Ctrl+C to stop.

where python >nul 2>nul
if %ERRORLEVEL%==0 (
  python -m http.server %PORT% --bind 127.0.0.1
  goto :end
)

where py >nul 2>nul
if %ERRORLEVEL%==0 (
  py -m http.server %PORT% --bind 127.0.0.1
  goto :end
)

echo ERROR: Python is not installed or not on PATH.

echo Install Python from https://www.python.org/downloads/ and try again.

:end
