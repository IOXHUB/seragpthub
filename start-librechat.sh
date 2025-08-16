#!/bin/bash

echo "🚀 LibreChat Başlatılıyor..."

# Gerekli dizinleri oluştur
mkdir -p logs
mkdir -p uploads
mkdir -p data-node
mkdir -p meili_data
mkdir -p client/public/images

# UID ve GID ayarla
export UID=$(id -u)
export GID=$(id -g)

echo "📁 Dizinler hazırlandı"

# MCP sunucularını kur
echo "🔧 MCP sunucuları kuruluyor..."
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-memory
npm install -g @modelcontextprotocol/server-brave-search
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-postgres
npm install -g @modelcontextprotocol/server-slack
npm install -g @modelcontextprotocol/server-puppeteer
npm install -g @modelcontextprotocol/server-sqlite

echo "✅ MCP sunucuları kuruldu"

# Docker konteynerlerini başlat
echo "🐳 Docker konteynerleri başlatılıyor..."
docker-compose up -d

echo "⏳ Konteynerler başlatılıyor, lütfen bekleyin..."
sleep 30

echo "🎉 LibreChat hazır!"
echo "📱 Uygulamaya şu adresten erişebilirsiniz: http://localhost:3080"
echo "🔍 Meilisearch: http://localhost:7700"
echo "🗄️ RAG API: http://localhost:8000"
echo ""
echo "📊 Durum kontrolü için: docker-compose ps"
echo "📜 Logları görmek için: docker-compose logs -f"
echo "🛑 Durdurmak için: docker-compose down"
