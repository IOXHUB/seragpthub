# LibreChat - Docker Setup

LibreChat is an open-source AI chat interface that supports multiple AI providers including OpenAI, Anthropic, Google, and more.

## Quick Start with Docker

### Prerequisites

- **Docker**: Make sure Docker is installed on your system
- **Docker Compose**: Included with Docker Desktop

### Installation Steps

1. **Clone/Download this repository**

2. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

3. **Configure your AI API keys** in the `.env` file:
   ```bash
   # Required: At least one AI provider API key
   OPENAI_API_KEY=your_openai_api_key_here
   # ANTHROPIC_API_KEY=your_anthropic_api_key_here
   # GOOGLE_KEY=your_google_api_key_here
   ```

4. **Start LibreChat**:
   ```bash
   docker compose up -d
   ```

5. **Access LibreChat**:
   Open your browser and go to `http://localhost:3080`

### Services Included

- **LibreChat API** (Port 3080): Main application server
- **MongoDB** (Port 27017): Database for storing conversations and user data
- **Meilisearch** (Port 7700): Search engine for chat history
- **RAG API** (Port 8000): Retrieval Augmented Generation for document processing
- **PGVector**: Vector database for RAG functionality

### Configuration

#### Environment Variables

Key environment variables you can customize in `.env`:

```bash
# Server Configuration
HOST=localhost
PORT=3080
DOMAIN_CLIENT=http://localhost:3080

# AI Provider API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_KEY=your_google_api_key_here

# User Registration
ALLOW_REGISTRATION=true
ALLOW_EMAIL_LOGIN=true

# App Customization
APP_TITLE=LibreChat
CUSTOM_FOOTER="Powered by LibreChat"

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@librechat.ai
```

#### LibreChat Configuration

Customize models and endpoints in `librechat.yaml`:

```yaml
endpoints:
  openAI:
    models:
      default: [
        "gpt-4o",
        "gpt-4o-mini", 
        "gpt-4-turbo",
        "gpt-3.5-turbo"
      ]
  
  anthropic:
    models:
      default: [
        "claude-3-5-sonnet-20241022",
        "claude-3-opus-20240229"
      ]
```

### Getting API Keys

#### OpenAI
1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create an account and generate an API key
3. Add to `.env`: `OPENAI_API_KEY=sk-...`

#### Anthropic (Claude)
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account and generate an API key
3. Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-...`

#### Google (Gemini)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create an API key
3. Add to `.env`: `GOOGLE_KEY=...`

### Managing the Application

#### Start Services
```bash
docker compose up -d
```

#### Stop Services
```bash
docker compose down
```

#### View Logs
```bash
docker compose logs -f api
```

#### Update LibreChat
```bash
docker compose pull
docker compose up -d
```

#### Reset Database
```bash
docker compose down -v
docker compose up -d
```

### Troubleshooting

#### Port Already in Use
If port 3080 is already in use, change it in `docker-compose.yml`:
```yaml
services:
  api:
    ports:
      - "3081:3080"  # Change external port to 3081
```

#### API Key Issues
- Make sure API keys are correctly formatted in `.env`
- Ensure you have sufficient credits/quota with your AI provider
- Check the logs: `docker compose logs api`

#### Database Connection Issues
- Ensure MongoDB container is running: `docker compose ps`
- Check database logs: `docker compose logs mongodb`

### Features

- **Multiple AI Providers**: OpenAI, Anthropic, Google, Azure OpenAI, and more
- **Custom Endpoints**: Add your own AI providers
- **Document Upload**: Upload and chat with documents using RAG
- **Search**: Full-text search through conversation history
- **User Authentication**: Registration and login system
- **Conversation Management**: Save, organize, and continue conversations
- **Responsive Design**: Works on desktop and mobile devices

### Security Notes

- Change default JWT secrets in production
- Use strong passwords for database connections
- Consider setting up SSL/TLS for production deployments
- Regularly update Docker images for security patches

### Support

For issues and questions:
- GitHub Issues: [LibreChat Issues](https://github.com/danny-avila/LibreChat/issues)
- Documentation: [LibreChat Docs](https://librechat.ai)
- Discord: [LibreChat Community](https://discord.librechat.ai)

### License

This project is licensed under the MIT License.
