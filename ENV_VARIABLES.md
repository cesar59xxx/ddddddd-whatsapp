# Variáveis de Ambiente - Guia Completo

## 🟢 VERCEL (Frontend Next.js)

Adicione estas variáveis no painel da Vercel em **Settings → Environment Variables**:

\`\`\`bash
# Supabase (obrigatório)
NEXT_PUBLIC_SUPABASE_URL=https://kojduqsmxipoayecuvsi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0Nzg4NjUsImV4cCI6MjA4MTA1NDg2NX0.O_7jS8fFWKMI9tZ4EQPvdjKF7y6WzpeZKMIR03CNEDs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig

# Backend Railway (obrigatório) ✅ Railway já está online!
NEXT_PUBLIC_RAILWAY_BACKEND_URL=https://ddddddd-whatsapp-production.up.railway.app
BACKEND_API_KEY=sua-chave-secreta-aqui

# Redirect Auth (obrigatório)
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=https://seu-app.vercel.app
\`\`\`

**📝 IMPORTANTE:**
- `NEXT_PUBLIC_RAILWAY_BACKEND_URL` - Já configurado com Railway online ✅
- `BACKEND_API_KEY` - Crie uma chave secreta qualquer (exemplo: `whatsapp_secret_key_2024_abc123`)
- `NEXT_PUBLIC_SUPABASE_REDIRECT_URL` - Use a URL do seu app na Vercel quando fizer deploy

---

## 🔴 RAILWAY (Backend Node.js) ✅ JÁ ESTÁ ONLINE

Adicione/Verifique estas variáveis no painel da Railway em **Variables**:

\`\`\`bash
# Supabase (obrigatório)
SUPABASE_URL=https://kojduqsmxipoayecuvsi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig

# Segurança (obrigatório)
API_KEY=sua-chave-secreta-aqui
ALLOWED_ORIGINS=https://seu-app.vercel.app

# Porta (obrigatório)
PORT=8080

# OpenAI (opcional - só se quiser IA no chatbot)
OPENAI_API_KEY=sk-...
\`\`\`

**📝 IMPORTANTE:**
- `API_KEY` - Use a MESMA chave que você colocou em `BACKEND_API_KEY` na Vercel
- `ALLOWED_ORIGINS` - Depois do deploy na Vercel, atualize com a URL real
- `PORT` - Railway usa 8080 ✅

---

## 📋 STATUS DO DEPLOY

### ✅ Supabase - PRONTO
- URL: https://kojduqsmxipoayecuvsi.supabase.co
- Credenciais configuradas

### ✅ Railway - ONLINE
- URL: https://ddddddd-whatsapp-production.up.railway.app
- Status: Online e funcionando
- Porta: 8080

### ⏳ Vercel - AGUARDANDO VARIÁVEIS
- Precisa adicionar as variáveis acima
- Build vai funcionar depois de adicionar

---

## 🚀 PRÓXIMOS PASSOS

### 1. Adicionar Variáveis na Vercel

Vá em **Vercel → Seu Projeto → Settings → Environment Variables** e adicione:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://kojduqsmxipoayecuvsi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0Nzg4NjUsImV4cCI6MjA4MTA1NDg2NX0.O_7jS8fFWKMI9tZ4EQPvdjKF7y6WzpeZKMIR03CNEDs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig
NEXT_PUBLIC_RAILWAY_BACKEND_URL=https://ddddddd-whatsapp-production.up.railway.app
BACKEND_API_KEY=whatsapp_secret_2024_abcd
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=https://seu-dominio.vercel.app
\`\`\`

**ATENÇÃO:** Troque `NEXT_PUBLIC_SUPABASE_REDIRECT_URL` pela URL real do Vercel após o primeiro deploy!

### 2. Atualizar Railway

Depois do deploy da Vercel, volte na Railway e atualize:

\`\`\`
ALLOWED_ORIGINS=https://sua-url-real.vercel.app
API_KEY=whatsapp_secret_2024_abcd
\`\`\`

(Use a MESMA chave em `API_KEY` e `BACKEND_API_KEY`)

### 3. Fazer Redeploy na Vercel

Após adicionar variáveis, clique em **Redeploy** na Vercel.

---

## 🔑 GERANDO CHAVE SECRETA

Para `BACKEND_API_KEY` e `API_KEY`, use qualquer um:

**Opção 1 - Simples:**
\`\`\`
whatsapp_saas_secret_2024_abc123xyz
\`\`\`

**Opção 2 - Online:**
https://randomkeygen.com/ (copie "Fort Knox Password")

**Opção 3 - Terminal:**
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

---

## ✅ CHECKLIST FINAL

### Na Vercel:
- [ ] Adicionar as 5 variáveis listadas acima
- [ ] Fazer deploy/redeploy
- [ ] Copiar URL gerada

### Na Railway:
- [ ] Atualizar `ALLOWED_ORIGINS` com URL da Vercel
- [ ] Verificar se `API_KEY` é igual ao `BACKEND_API_KEY`
- [ ] Confirmar que está online

### Testar:
- [ ] Acessar URL da Vercel
- [ ] Criar conta
- [ ] Criar instância WhatsApp
- [ ] Ver QR Code aparecer

---

## 🐛 ERROS COMUNS

**"Failed to fetch" na Vercel:**
- Falta adicionar `NEXT_PUBLIC_RAILWAY_BACKEND_URL`
- Railway está offline (verifique)

**"Unauthorized" ao conectar WhatsApp:**
- `API_KEY` e `BACKEND_API_KEY` diferentes
- Corrija para serem IGUAIS

**"Cannot read properties of null":**
- Falta `NEXT_PUBLIC_SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Adicione na Vercel

**Build falha na Vercel:**
- TypeScript warning (OK, não afeta)
- Se der erro de prerender: já corrigido no código ✅
