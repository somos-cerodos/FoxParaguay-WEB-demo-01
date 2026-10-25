@echo off
REM Sirve la demo en http://localhost:8000 y en la red local para probar desde el celular.
cd /d "%~dp0"
echo.
echo  FoxParaguay demo: abri http://localhost:8000 en esta PC.
echo  Desde el celular (misma red Wi-Fi), usa la IPv4 de esta lista con :8000
ipconfig | findstr /i "IPv4"
echo.
echo  Para cortar: Ctrl+C
echo.
python -m http.server 8000 --bind 0.0.0.0 || py -m http.server 8000 --bind 0.0.0.0
pause
