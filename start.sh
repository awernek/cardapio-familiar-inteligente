#!/bin/bash

echo "========================================"
echo " Cardapio Familiar Inteligente"
echo "========================================"
echo ""
echo "Iniciando servidor backend e frontend..."
echo ""

# Inicia o servidor backend em background
cd server && npm run dev &
BACKEND_PID=$!

# Aguarda 2 segundos
sleep 2

# Inicia o frontend em background
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Servidores iniciados!"
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Pressione Ctrl+C para parar ambos os servidores"

# Aguarda até que um dos processos termine
wait
