# Variáveis de Ambiente - Guia Completo

## 🟢 VERCEL (Frontend Next.js)

Adicione estas variáveis no painel da Vercel em **Settings → Environment Variables**:

\`\`\`bash
# Supabase (obrigatório)
NEXT_PUBLIC_SUPABASE_URL=https://kojduqsmxipoayecuvsi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0Nzg4NjUsImV4cCI6MjA4MTA1NDg2NX0.O_7jS8fFWKMI9tZ4EQPvdjKF7y6WzpeZKMIR03CNEDs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig

# Backend Railway (obrigatório - adicionar DEPOIS de fazer deploy na Railway)
NEXT_PUBLIC_BACKEND_URL=https://seu-app.up.railway.app
BACKEND_API_KEY=gere-uma-chave-secreta-aleatoria-aqui-123456

# Redirect Auth (obrigatório)
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=https://seu-app.vercel.app
\`\`\`

**📝 IMPORTANTE:**
- `NEXT_PUBLIC_BACKEND_URL` - Você vai pegar essa URL DEPOIS de fazer deploy na Railway
- `BACKEND_API_KEY` - Crie uma chave secreta qualquer (exemplo: `whatsapp_secret_key_2024_abc123`)
- `NEXT_PUBLIC_SUPABASE_REDIRECT_URL` - Use a URL do seu app na Vercel (exemplo: `https://whatsapp-saas.vercel.app`)

---

## 🔴 RAILWAY (Backend Node.js)

Adicione estas variáveis no painel da Railway em **Variables**:

\`\`\`bash
# Supabase (obrigatório)
SUPABASE_URL=https://kojduqsmxipoayecuvsi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig

# Segurança (obrigatório)
API_KEY=gere-uma-chave-secreta-aleatoria-aqui-123456
ALLOWED_ORIGINS=https://seu-app.vercel.app

# Porta (obrigatório)
PORT=3001

# OpenAI (opcional - só se quiser IA no chatbot)
OPENAI_API_KEY=sk-...
\`\`\`

**📝 IMPORTANTE:**
- `API_KEY` - Use a MESMA chave que você colocou em `BACKEND_API_KEY` na Vercel
- `ALLOWED_ORIGINS` - Use a URL do seu app na Vercel (mesmo valor de `NEXT_PUBLIC_SUPABASE_REDIRECT_URL`)
- `PORT` - Deixe como 3001 (Railway vai expor automaticamente)

---

## 📋 ORDEM DE DEPLOY

### 1️⃣ PRIMEIRO: Supabase
- Já está pronto ✅
- Use as credenciais que você me passou

### 2️⃣ SEGUNDO: Railway (Backend)
1. Crie novo projeto na Railway
2. Conecte o repositório GitHub (pasta `backend-railway`)
3. Adicione as variáveis acima
4. Deploy automático
5. **COPIE a URL gerada** (exemplo: `https://whatsapp-backend-production.up.railway.app`)

### 3️⃣ TERCEIRO: Vercel (Frontend)
1. Conecte o repositório GitHub (raiz do projeto)
2. Adicione as variáveis acima
3. **IMPORTANTE**: Atualize `NEXT_PUBLIC_BACKEND_URL` com a URL da Railway
4. Deploy

### 4️⃣ QUARTO: Atualizar CORS
Volte na Railway e atualize:
\`\`\`bash
ALLOWED_ORIGINS=https://seu-app-vercel.vercel.app
\`\`\`

---

## 🔑 GERANDO CHAVES SECRETAS

Para gerar `BACKEND_API_KEY` e `API_KEY`, você pode usar:

**Opção 1 - Online:**
- Acesse: https://randomkeygen.com/
- Copie uma chave "Fort Knox Password"

**Opção 2 - Terminal:**
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

**Opção 3 - Simples:**
Crie qualquer string longa e aleatória, exemplo:
\`\`\`
whatsapp_saas_2024_ultra_secret_key_abc123xyz789
\`\`\`

---

## ✅ CHECKLIST

### Vercel
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] NEXT_PUBLIC_BACKEND_URL
- [ ] BACKEND_API_KEY
- [ ] NEXT_PUBLIC_SUPABASE_REDIRECT_URL

### Railway
- [ ] SUPABASE_URL
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] API_KEY (mesma que BACKEND_API_KEY da Vercel)
- [ ] ALLOWED_ORIGINS (URL da Vercel)
- [ ] PORT
- [ ] OPENAI_API_KEY (opcional)

---

## 🐛 TROUBLESHOOTING

**Erro: "Failed to fetch"**
- Verifique se `NEXT_PUBLIC_BACKEND_URL` está correto na Vercel
- Verifique se `ALLOWED_ORIGINS` na Railway tem a URL da Vercel

**Erro: "Unauthorized"**
- Verifique se `API_KEY` e `BACKEND_API_KEY` são IGUAIS

**Erro: "Database connection failed"**
- Verifique se `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` estão corretos

**QR Code não aparece**
- Aguarde 1-2 minutos após criar instância (Railway precisa inicializar)
- Verifique logs na Railway
