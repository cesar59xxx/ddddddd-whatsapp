# Deploy na Vercel - Guia Completo

## Passo 1: Publicar pelo v0

1. No v0, clique no botão **"Publish"** no canto superior direito
2. O v0 vai automaticamente fazer o deploy na Vercel
3. Anote a URL que a Vercel criar (ex: `https://seu-app.vercel.app`)

## Passo 2: Configurar Variáveis de Ambiente na Vercel

Acesse seu projeto na Vercel → Settings → Environment Variables e adicione:

### Variáveis Públicas:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://kojduqsmxipoayecuvsi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0Nzg4NjUsImV4cCI6MjA4MTA1NDg2NX0.O_7jS8fFWKMI9tZ4EQPvdjKF7y6WzpeZKMIR03CNEDs
\`\`\`

### Variável Privada (⚠️ NUNCA expor):
\`\`\`
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig
\`\`\`

## Passo 3: Configurar Redirect URL no Supabase

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard/project/kojduqsmxipoayecuvsi)
2. Vá em **Authentication → URL Configuration**
3. Em **Redirect URLs**, adicione:
   - `https://seu-app.vercel.app/dashboard`
   - `https://seu-app.vercel.app/**` (permite todos os caminhos)
4. Clique em **Save**

## Passo 4: Executar Scripts SQL

No Supabase Dashboard:
1. Vá em **SQL Editor**
2. Crie uma nova query
3. Cole o conteúdo de `scripts/001_create_database_schema.sql`
4. Execute (Run)
5. Repita com `scripts/002_setup_rls_policies.sql`

## Passo 5: Testar

1. Acesse `https://seu-app.vercel.app`
2. Clique em "Cadastre-se"
3. Preencha o formulário
4. Confirme seu email
5. Faça login

## Troubleshooting

### Erro "Failed to fetch"
- Verifique se as variáveis de ambiente estão corretas na Vercel
- Certifique-se que você fez o Redeploy após adicionar as variáveis

### Email não chegou
- Verifique a pasta de spam
- No Supabase, vá em Authentication → Email Templates e configure um provider SMTP customizado

### Redirect não funciona
- Verifique se adicionou as URLs corretas no Supabase (Passo 3)
- A URL deve incluir `https://` no início

## Como funciona o WhatsApp Web.js na Vercel

⚠️ **IMPORTANTE**: O whatsapp-web.js requer armazenamento persistente para manter as sessões do WhatsApp. Na Vercel, as funções serverless são efêmeras (sem estado persistente).

### Soluções:

1. **Para Desenvolvimento/Testes**: Use o preview do v0
2. **Para Produção**: Você precisa de um servidor dedicado para o whatsapp-web.js
   - Opções: Railway, Render, DigitalOcean, AWS EC2
   - O frontend fica na Vercel
   - O backend WhatsApp fica no servidor dedicado
   - Comunicação via API REST entre eles

### Arquitetura Recomendada:

\`\`\`
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Vercel    │ ◄─────► │   Servidor   │ ◄─────► │  WhatsApp   │
│  (Frontend) │   API   │  Dedicado    │  Web.js │   Servers   │
│             │         │ (Railway/EC2)│         │             │
└─────────────┘         └──────────────┘         └─────────────┘
        │                       │
        │                       │
        └───────────┬───────────┘
                    ▼
              ┌─────────────┐
              │  Supabase   │
              │  (Database) │
              └─────────────┘
\`\`\`

Posso ajudar você a configurar essa arquitetura quando quiser!
