@echo off
chcp 65001 >nul
cls

echo 🚀 LibreChat Docker Kurulum Başlatılıyor...
echo ===========================================
echo.

REM .env dosyasının var olup olmadığını kontrol et
if not exist .env (
    echo 📋 .env dosyası bulunamadı, .env.example'dan kopyalanıyor...
    copy .env.example .env >nul
    echo ✅ .env dosyası oluşturuldu
    echo.
    echo ⚠️  ÖNEMLİ: .env dosyasını düzenleyip API anahtarlarınızı ekleyin:
    echo    - OPENAI_API_KEY=your_openai_api_key_here
    echo    - ANTHROPIC_API_KEY=your_anthropic_api_key_here (opsiyonel)
    echo    - GOOGLE_KEY=your_google_api_key_here (opsiyonel)
    echo.
)

REM Gerekli dizinleri oluştur
echo 📁 Gerekli dizinler oluşturuluyor...
if not exist data-node mkdir data-node
if not exist meili_data mkdir meili_data
if not exist images mkdir images
if not exist logs mkdir logs
echo ✅ Dizinler oluşturuldu

REM Docker'ın yüklü olup olmadığını kontrol et
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker yüklü değil. Lütfen Docker Desktop'ı yükleyin: https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

REM Docker Compose'un yüklü olup olmadığını kontrol et
docker compose version >nul 2>&1
if errorlevel 1 (
    docker-compose --version >nul 2>&1
    if errorlevel 1 (
        echo ❌ Docker Compose yüklü değil. Lütfen Docker Compose'u yükleyin.
        pause
        exit /b 1
    ) else (
        set DOCKER_COMPOSE=docker-compose
    )
) else (
    set DOCKER_COMPOSE=docker compose
)

echo 🐳 Docker servisleri başlatılıyor...
echo Bu işlem ilk seferde birkaç dakika sürebilir (Docker imajları indiriliyor)...

REM Docker Compose ile servisleri başlat
%DOCKER_COMPOSE% up -d

REM Servislerin başlatılmasını bekle
echo ⏳ Servisler başlatılıyor...
timeout /t 10 /nobreak >nul

REM Servis durumlarını kontrol et
echo.
echo 📊 Servis Durumları:
echo ===================
%DOCKER_COMPOSE% ps

echo.
echo 🎉 LibreChat başarıyla başlatıldı!
echo ==================================
echo.
echo 📍 Erişim Bilgileri:
echo    🌐 Ana Uygulama: http://localhost:3080
echo    🔍 API Health: http://localhost:3080/api/health
echo    📊 Meilisearch: http://localhost:7700
echo    ����️  RAG API: http://localhost:8000
echo.
echo 📝 Sonraki Adımlar:
echo    1. .env dosyasını düzenleyip API anahtarlarınızı ekleyin
echo    2. Servisleri yeniden başlatın: %DOCKER_COMPOSE% restart
echo    3. http://localhost:3080 adresini ziyaret edin
echo.
echo 🔧 Yararlı Komutlar:
echo    Logları görmek için: %DOCKER_COMPOSE% logs -f
echo    Servisleri durdurmak için: %DOCKER_COMPOSE% down
echo    Servisleri yeniden başlatmak için: %DOCKER_COMPOSE% restart
echo.
echo ❓ Sorun yaşıyorsanız:
echo    - .env dosyanızın doğru yapılandırıldığından emin olun
echo    - Portların (3080, 7700, 8000) kullanımda olmadığından emin olun
echo    - Logları kontrol edin: %DOCKER_COMPOSE% logs
echo.

pause
