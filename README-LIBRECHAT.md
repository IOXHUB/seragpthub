# LibreChat Kurulumu ve MCP Entegrasyonu

## 🚀 Hızlı Başlangıç

### 1. Ön Gereksinimler
- Docker ve Docker Compose
- Node.js (v18+)
- En az 4GB RAM

### 2. LibreChat'i Başlatma

```bash
# LibreChat'i başlat
./start-librechat.sh

# Test yap
./test-mcp.sh
```

### 3. Erişim Adresleri
- **LibreChat**: http://localhost:3080
- **Meilisearch**: http://localhost:7700  
- **RAG API**: http://localhost:8000

## 🔧 MCP (Model Context Protocol) Özellikleri

LibreChat'te aşağıdaki MCP sunucuları entegre edilmiştir:

### 📁 Filesystem
- Dosya okuma/yazma işlemleri
- Belge yönetimi
- Uploads klasörü erişimi

### 🧠 Memory
- Kalıcı bellek ve not alma
- Konuşma geçmişi saklama
- Kişisel bilgi yönetimi

### 🔍 Brave Search
- Web arama yetenekleri
- Güncel bilgi erişimi
- **Gerekli**: `BRAVE_API_KEY` çevre değişkeni

### 🐙 GitHub
- Repository işlemleri
- Issue yönetimi
- **Gerekli**: `GITHUB_TOKEN` çevre değişkeni

### 🗄️ PostgreSQL
- Veritabanı işlemleri
- SQL sorguları
- Veri analizi

### 💬 Slack
- Workspace entegrasyonu
- Mesaj gönderme/alma
- **Gerekli**: `SLACK_BOT_TOKEN` ve `SLACK_SIGNING_SECRET`

### 🕷️ Puppeteer
- Web scraping
- Otomasyon
- Ekran görüntüsü alma

### 📊 SQLite
- Hafif veritabanı işlemleri
- Yerel veri saklama

## ⚙️ Konfigürasyon

### MCP Sunucularını Etkinleştirme

1. `.env` dosyasında gerekli API anahtarlarını ayarlayın:
```bash
BRAVE_API_KEY=your_brave_api_key
GITHUB_TOKEN=your_github_token
SLACK_BOT_TOKEN=your_slack_bot_token
SLACK_SIGNING_SECRET=your_slack_signing_secret
```

2. `librechat.yaml` dosyasında MCP ayarlarını düzenleyin

3. `mcp.json` dosyasında sunucu konfigürasyonlarını özelleştirin

### AI Model Ayarları

Desteklenen modeller:
- **OpenAI**: GPT-4o, GPT-4, GPT-3.5-turbo
- **Anthropic**: Claude-3.5-Sonnet, Claude-3-Haiku
- **Google**: Gemini-1.5-Pro, Gemini-1.5-Flash
- **xAI**: Grok-beta, Grok-vision-beta

## 🐳 Docker Komutları

```bash
# Başlat
docker-compose up -d

# Durumu kontrol et
docker-compose ps

# Logları görüntüle
docker-compose logs -f

# Durdur
docker-compose down

# Tamamen temizle
docker-compose down -v
docker system prune -a
```

## 🔍 Sorun Giderme

### Yaygın Sorunlar

1. **Port çakışması**: 3080, 7700 veya 8000 portları kullanımda
   ```bash
   sudo lsof -i :3080
   sudo lsof -i :7700
   sudo lsof -i :8000
   ```

2. **Bellek yetersizliği**: En az 4GB RAM gerekli

3. **Docker izinleri**: 
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

4. **MCP sunucu hatası**: Node.js ve npm güncel olmalı
   ```bash
   node --version
   npm --version
   ```

### Log İnceleme

```bash
# LibreChat API logları
docker-compose logs librechat-api

# MongoDB logları
docker-compose logs mongodb

# Meilisearch logları
docker-compose logs meilisearch

# RAG API logları
docker-compose logs rag_api
```

## 🔐 Güvenlik

- API anahtarlarını güvenli saklayın
- Production ortamında `.env` dosyasını git'e eklemeyin
- Güvenli JWT secret'ları kullanın
- SSL sertifikası ekleyin (production için)

## 📚 Ek Kaynaklar

- [LibreChat Resmi Dokümantasyon](https://docs.librechat.ai/)
- [MCP Protokol Dokümantasyonu](https://modelcontextprotocol.io/)
- [Docker Compose Kılavuzu](https://docs.docker.com/compose/)

## 🆘 Destek

Sorun yaşarsanız:
1. `./test-mcp.sh` çalıştırın
2. Docker loglarını kontrol edin
3. GitHub Issues'da sorun bildirin
