#!/bin/bash

# LibreChat Docker Setup Script
# Bu script LibreChat'i Docker ile başlatır

echo "🚀 LibreChat Docker Kurulum Başlatılıyor..."
echo "==========================================="

# .env dosyasının var olup olmadığını kontrol et
if [ ! -f .env ]; then
    echo "📋 .env dosyası bulunamadı, .env.example'dan kopyalanıyor..."
    cp .env.example .env
    echo "✅ .env dosyası oluşturuldu"
    echo ""
    echo "⚠️  ÖNEMLİ: .env dosyasını düzenleyip API anahtarlarınızı ekleyin:"
    echo "   - OPENAI_API_KEY=your_openai_api_key_here"
    echo "   - ANTHROPIC_API_KEY=your_anthropic_api_key_here (opsiyonel)"
    echo "   - GOOGLE_KEY=your_google_api_key_here (opsiyonel)"
    echo ""
fi

# Gerekli dizinleri oluştur
echo "📁 Gerekli dizinler oluşturuluyor..."
mkdir -p data-node
mkdir -p meili_data
mkdir -p images
mkdir -p logs
echo "✅ Dizinler oluşturuldu"

# Docker Compose'un yüklü olup olmadığını kontrol et
if ! command -v docker &> /dev/null; then
    echo "❌ Docker yüklü değil. Lütfen Docker'ı yükleyin: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker compose &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose yüklü değil. Lütfen Docker Compose'u yükleyin."
    exit 1
fi

# Docker Compose komutunu belirle
if command -v docker compose &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

echo "🐳 Docker servisleri başlatılıyor..."
echo "Bu işlem ilk seferde birkaç dakika sürebilir (Docker imajları indiriliyor)..."

# Docker Compose ile servisleri başlat
$DOCKER_COMPOSE up -d

# Servislerin başlatılmasını bekle
echo "⏳ Servisler başlatılıyor..."
sleep 10

# Servis durumlarını kontrol et
echo ""
echo "📊 Servis Durumları:"
echo "==================="
$DOCKER_COMPOSE ps

echo ""
echo "🎉 LibreChat başarıyla başlatıldı!"
echo "=================================="
echo ""
echo "📍 Erişim Bilgileri:"
echo "   🌐 Ana Uygulama: http://localhost:3080"
echo "   🔍 API Health: http://localhost:3080/api/health"
echo "   📊 Meilisearch: http://localhost:7700"
echo "   🗄️  RAG API: http://localhost:8000"
echo ""
echo "📝 Sonraki Adımlar:"
echo "   1. .env dosyasını düzenleyip API anahtarlarınızı ekleyin"
echo "   2. Servisleri yeniden başlatın: $DOCKER_COMPOSE restart"
echo "   3. http://localhost:3080 adresini ziyaret edin"
echo ""
echo "🔧 Yararlı Komutlar:"
echo "   Logları görmek için: $DOCKER_COMPOSE logs -f"
echo "   Servisleri durdurmak için: $DOCKER_COMPOSE down"
echo "   Servisleri yeniden başlatmak için: $DOCKER_COMPOSE restart"
echo ""
echo "❓ Sorun yaşıyorsanız:"
echo "   - .env dosyanızın doğru yapılandırıldığından emin olun"
echo "   - Portların (3080, 7700, 8000) kullanımda olmadığından emin olun"
echo "   - Logları kontrol edin: $DOCKER_COMPOSE logs"
echo ""
