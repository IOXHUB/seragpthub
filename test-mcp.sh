#!/bin/bash

echo "🧪 MCP Sunucuları Test Ediliyor..."

# Filesystem sunucusu test
echo "📁 Filesystem sunucusu test ediliyor..."
npx @modelcontextprotocol/server-filesystem --help > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Filesystem sunucusu: OK"
else
    echo "❌ Filesystem sunucusu: HATA"
fi

# Memory sunucusu test
echo "🧠 Memory sunucusu test ediliyor..."
npx @modelcontextprotocol/server-memory --help > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Memory sunucusu: OK"
else
    echo "❌ Memory sunucusu: HATA"
fi

# PostgreSQL bağlantısı test
echo "🗄️ PostgreSQL bağlantısı test ediliyor..."
if docker ps | grep -q pgvector; then
    echo "✅ PostgreSQL konteyner: Çalışıyor"
else
    echo "❌ PostgreSQL konteyner: Çalışmıyor"
fi

# MongoDB bağlantısı test
echo "🍃 MongoDB bağlantısı test ediliyor..."
if docker ps | grep -q chat-mongodb; then
    echo "✅ MongoDB konteyner: Çalışıyor"
else
    echo "❌ MongoDB konteyner: Çalışmıyor"
fi

# Meilisearch test
echo "🔍 Meilisearch test ediliyor..."
if docker ps | grep -q chat-meilisearch; then
    echo "✅ Meilisearch konteyner: Çalışıyor"
else
    echo "❌ Meilisearch konteyner: Çalışmıyor"
fi

# LibreChat API test
echo "🚀 LibreChat API test ediliyor..."
if docker ps | grep -q LibreChat-API; then
    echo "✅ LibreChat API konteyner: Çalışıyor"
    
    # API sağlık kontrolü
    sleep 5
    curl -s http://localhost:3080/api/health > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ LibreChat API: Erişilebilir"
    else
        echo "⏳ LibreChat API: Başlatılıyor..."
    fi
else
    echo "❌ LibreChat API konteyner: Çalışmıyor"
fi

echo ""
echo "🏁 Test tamamlandı!"
echo "📱 LibreChat: http://localhost:3080"
echo "🔍 Meilisearch: http://localhost:7700"
echo "🗄️ RAG API: http://localhost:8000"
