@echo off
echo ========================================
echo  Cardapio Familiar Inteligente
echo ========================================
echo.
echo Iniciando servidor backend e frontend...
echo.

start "Servidor Backend" cmd /k "cd server && npm run dev"
timeout /t 2 /nobreak >nul
start "Frontend" cmd /k "npm run dev"

echo.
echo Servidores iniciados!
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
