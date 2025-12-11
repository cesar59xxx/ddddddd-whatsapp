# Railway Deploy - Configuração Corrigida

## O Problema Anterior

O Railway estava tentando fazer build do Next.js (Vercel) ao invés do backend Node.js.

## Solução Implementada

### 1. Arquivo railway.json na Raiz

Criei `railway.json` na raiz do projeto que direciona o Railway para fazer build apenas da pasta `backend-railway`:

\`\`\`json
{
  "build": {
    "buildCommand": "cd backend-railway && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd backend-railway && npm start"
  }
}
\`\`\`

### 2. Package.json Limpo

Removi do `package.json` principal:
- ❌ `whatsapp-web.js` (só deve estar no backend-railway)
- ❌ `express` (só deve estar no backend-railway)  
- ❌ `dotenv` (só deve estar no backend-railway)

Esses pacotes agora existem APENAS em `backend-railway/package.json`.

## Deploy Correto no Railway

### Passo 1: Conectar Repositório
1. Acesse Railway.app
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Escolha o repositório `ddddddd-whatsapp`

### Passo 2: Configurar Variáveis de Ambiente

Vá em "Variables" e adicione:

\`\`\`bash
# Supabase
SUPABASE_URL=https://kojduqsmxipoayecuvsi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig

# Segurança
API_SECRET_KEY=gere-uma-chave-secreta-forte-aqui-use-openssl-rand-hex-32

# Porta (Railway gerencia automaticamente)
PORT=3001
\`\`\`

### Passo 3: Deploy

Clique em "Deploy" e o Railway vai:
1. ✅ Ler o `railway.json` na raiz
2. ✅ Entrar na pasta `backend-railway`
3. ✅ Instalar dependências (incluindo whatsapp-web.js)
4. ✅ Fazer build do TypeScript
5. ✅ Iniciar o servidor Express

### Passo 4: Pegar a URL

Após deploy bem-sucedido:
1. Vá em "Settings" → "Networking"
2. Clique em "Generate Domain"
3. Copie a URL (ex: `https://seu-projeto.up.railway.app`)

### Passo 5: Atualizar Vercel

No Vercel, adicione a variável:
\`\`\`bash
NEXT_PUBLIC_BACKEND_URL=https://seu-projeto.up.railway.app
\`\`\`

## Verificar se Funcionou

Acesse: `https://seu-projeto.up.railway.app/health`

Deve retornar:
\`\`\`json
{
  "status": "ok",
  "timestamp": "2024-12-11T...",
  "uptime": 123
}
\`\`\`

## Troubleshooting

### Erro: "Module not found whatsapp-web.js"
**Solução**: O railway.json está correto agora. Faça um novo deploy.

### Erro: "Port already in use"
**Solução**: Railway gerencia a porta automaticamente via variável PORT.

### Erro: "Cannot connect to Supabase"
**Solução**: Verifique se as variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão corretas.

## Arquitetura Final

\`\`\`
┌─────────────────┐
│     Vercel      │  ← Frontend Next.js
│  (seu-app.com)  │
└────────┬────────┘
         │
         │ HTTP Requests
         ↓
┌─────────────────┐
│    Railway      │  ← Backend Node.js + WhatsApp
│  (backend API)  │
└────────┬────────┘
         │
         │ SQL Queries
         ↓
┌─────────────────┐
│    Supabase     │  ← Banco de Dados
│   (PostgreSQL)  │
└─────────────────┘
\`\`\`

Tudo pronto! 🚀
