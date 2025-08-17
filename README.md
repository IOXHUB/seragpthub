# SeraGPT - Yapay Zeka Asistanı

SeraGPT, Next.js ve AI SDK kullanılarak geliştirilmiş güçlü bir yapay zeka sohbet platformudur.

## 🌐 Production Domains

- **Ana Domain:** https://www.seragpt.com
- **Alternatif:** https://seragpt.com

## ✨ Özellikler

- 🤖 Çoklu AI model desteği (OpenAI, Anthropic, X.AI)
- 🔐 Güvenli kullanıcı kimlik doğrulama
- 💬 Gerçek zamanlı sohbet
- 📱 Responsive tasarım
- 🌓 Karanlık/Aydınlık tema desteği
- 📊 Sohbet geçmişi
- 🔒 Özel/Genel sohbet görünürlük ayarları

## 🛠️ Teknoloji Stack

- **Framework:** Next.js 15
- **AI SDK:** Vercel AI SDK
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## 🚀 Production Deployment

### Environment Variables

Production ortamında aşağıdaki environment variables'ları ayarlayın:

```bash
# Authentication
AUTH_SECRET=your_auth_secret_here
NEXTAUTH_URL=https://www.seragpt.com

# Database
POSTGRES_URL=your_postgres_connection_string_here

# AI Providers
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
XAI_API_KEY=your_xai_api_key_here

# Optional
REDIS_URL=your_redis_connection_string_here
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

### Deployment Commands

```bash
# Production build
npm run build

# Start production server
npm start

# Database migration
npm run db:migrate
```

## 📝 License

Bu proje özel lisans altındadır.

---

© 2024 SeraGPT - Tüm hakları saklıdır.
