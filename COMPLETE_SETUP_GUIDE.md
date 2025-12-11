# Guia Completo de Deploy - WhatsApp Automation SaaS

Este guia mostra como fazer o deploy completo do seu SaaS em 3 ambientes que conversam entre si:
- **Vercel**: Frontend (Next.js)
- **Railway**: Backend (Node.js + whatsapp-web.js)
- **Supabase**: Banco de dados PostgreSQL

## Arquitetura do Sistema

\`\`\`
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   VERCEL        │         │    RAILWAY       │         │   SUPABASE      │
│   (Frontend)    │────────▶│   (Backend)      │────────▶│   (Database)    │
│   Next.js       │         │   whatsapp-web.js│         │   PostgreSQL    │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                            │                             │
        └────────────────────────────┴─────────────────────────────┘
                    Todos se comunicam via REST API
\`\`\`

## Passo 1: Configurar Supabase (Banco de Dados)

### 1.1 Execute os Scripts SQL

No seu projeto Supabase, vá em SQL Editor e execute os scripts na ordem:

1. `scripts/001_create_database_schema.sql` - Cria todas as tabelas
2. `scripts/002_setup_rls_policies.sql` - Configura as políticas de segurança

### 1.2 Copie as Credenciais

No Supabase Dashboard → Settings → API:
- **URL**: `https://kojduqsmxipoayecuvsi.supabase.co`
- **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (já configurada)
- **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (já configurada)

## Passo 2: Deploy do Backend na Railway

### 2.1 Preparar o Backend

1. Navegue até a pasta `backend-railway`
2. Instale as dependências:
   \`\`\`bash
   npm install
   \`\`\`

### 2.2 Deploy na Railway

1. Acesse [railway.app](https://railway.app) e faça login
2. Clique em "New Project" → "Deploy from GitHub repo"
3. Selecione o repositório do seu projeto
4. Configure as variáveis de ambiente:

\`\`\`env
PORT=3001
FRONTEND_URL=https://seu-app.vercel.app
SUPABASE_URL=https://kojduqsmxipoayecuvsi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig
\`\`\`

5. Configure o comando de start:
   - **Build Command**: `cd backend-railway && npm install && npm run build`
   - **Start Command**: `cd backend-railway && npm start`

6. A Railway irá gerar uma URL pública, exemplo: `https://seu-backend.up.railway.app`

**IMPORTANTE**: Anote essa URL, você vai precisar dela no Vercel!

## Passo 3: Deploy do Frontend na Vercel

### 3.1 Conectar ao GitHub

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "Add New Project"
3. Importe o repositório do GitHub
4. Configure as variáveis de ambiente:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://kojduqsmxipoayecuvsi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0Nzg4NjUsImV4cCI6MjA4MTA1NDg2NX0.O_7jS8fFWKMI9tZ4EQPvdjKF7y6WzpeZKMIR03CNEDs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig

# Backend Railway (IMPORTANTE!)
NEXT_PUBLIC_BACKEND_URL=https://seu-backend.up.railway.app
\`\`\`

### 3.2 Deploy

1. Clique em "Deploy"
2. Aguarde a build terminar
3. Acesse sua URL da Vercel, exemplo: `https://seu-app.vercel.app`

## Passo 4: Conectar os Sistemas

### 4.1 Atualizar a Railway com a URL da Vercel

Volte na Railway e atualize a variável:
\`\`\`env
FRONTEND_URL=https://seu-app.vercel.app
\`\`\`

### 4.2 Testar a Comunicação

1. Acesse seu app na Vercel: `https://seu-app.vercel.app`
2. Crie uma conta
3. Crie uma instância do WhatsApp
4. Clique em "Conectar" - deve aparecer o QR Code
5. Escaneie o QR Code no WhatsApp
6. Aguarde a conexão

## Fluxo de Dados

1. **Usuário cria instância** → Vercel salva no Supabase
2. **Usuário clica em "Conectar"** → Vercel chama Railway
3. **Railway inicia whatsapp-web.js** → Gera QR Code
4. **Railway salva QR no Supabase** → Vercel exibe QR Code
5. **Usuário escaneia QR** → Railway conecta WhatsApp
6. **Railway atualiza Supabase** → Vercel mostra "Conectado"
7. **WhatsApp recebe mensagem** → Railway processa com chatbot
8. **Railway salva no Supabase** → Usuário vê no Vercel

## Solução de Problemas

### QR Code não aparece
- Verifique se a `NEXT_PUBLIC_BACKEND_URL` está correta na Vercel
- Verifique os logs da Railway: `railway logs`

### Erro ao conectar
- Verifique se a `SUPABASE_SERVICE_ROLE_KEY` está configurada na Railway
- Verifique se as tabelas foram criadas no Supabase

### Mensagens não chegam
- Verifique se o chatbot está ativo no dashboard
- Verifique os logs da Railway para ver se a mensagem foi recebida

## Monitoramento

### Logs da Railway
\`\`\`bash
railway logs
\`\`\`

### Logs da Vercel
Acesse o dashboard da Vercel → Functions → View Logs

### Logs do Supabase
Acesse o dashboard do Supabase → Logs → All Logs

## Custos Estimados

- **Vercel**: Grátis (Hobby Plan)
- **Railway**: ~$5/mês (Starter Plan)
- **Supabase**: Grátis (até 500MB)

**Total**: ~$5/mês para começar

## Próximos Passos

1. Configurar domínio personalizado na Vercel
2. Adicionar monitoramento com Sentry
3. Configurar backups automáticos do Supabase
4. Adicionar CI/CD com GitHub Actions

🎉 **Parabéns! Seu SaaS está no ar!**
\`\`\`

```text file=".env.example"
# Frontend (Vercel) - Variáveis de Ambiente

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://kojduqsmxipoayecuvsi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0Nzg4NjUsImV4cCI6MjA4MTA1NDg2NX0.O_7jS8fFWKMI9tZ4EQPvdjKF7y6WzpeZKMIR03CNEDs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig

# Backend Railway URL (você vai obter essa URL depois do deploy na Railway)
NEXT_PUBLIC_BACKEND_URL=https://seu-backend.up.railway.app

# Opcional: Redirect URL para desenvolvimento local
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
