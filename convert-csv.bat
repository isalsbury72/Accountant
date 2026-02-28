@echo off
setlocal

if "%~1"=="" goto :usage
if "%~2"=="" goto :usage

set "SUPPLIERS=%~1"
set "INVOICES=%~2"
set "OUT=%~3"
if "%OUT%"=="" set "OUT=accountant-import.json"

if exist "%SystemRoot%\py.exe" (
  py -3 csv_to_accountant_json.py --suppliers "%SUPPLIERS%" --invoices "%INVOICES%" --out "%OUT%"
  goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
  python csv_to_accountant_json.py --suppliers "%SUPPLIERS%" --invoices "%INVOICES%" --out "%OUT%"
  goto :eof
)

where python3 >nul 2>nul
if %errorlevel%==0 (
  python3 csv_to_accountant_json.py --suppliers "%SUPPLIERS%" --invoices "%INVOICES%" --out "%OUT%"
  goto :eof
)

echo ERROR: Python is not installed or not on PATH.
echo Install Python from https://www.python.org/downloads/windows/
echo and tick "Add python.exe to PATH" during install.
exit /b 1

:usage
echo Usage: convert-csv.bat suppliers.csv invoices.csv [output.json]
echo Example: convert-csv.bat suppliers.csv invoices.csv accountant-import.json
exit /b 1
