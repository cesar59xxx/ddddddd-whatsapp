# Configuração do WhatsApp Automation SaaS

## 1. Configurar Variáveis de Ambiente no v0

No painel lateral do v0, vá em **Vars** e adicione as seguintes variáveis:

### Variáveis PÚBLICAS (seguras para front-end):
- `NEXT_PUBLIC_SUPABASE_URL` = `https://kojduqsmxipoayecuvsi.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0Nzg4NjUsImV4cCI6MjA4MTA1NDg2NX0.O_7jS8fFWKMI9tZ4EQPvdjKF7y6WzpeZKMIR03CNEDs`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` = `http://localhost:3000/dashboard`

### Variáveis PRIVADAS (apenas server-side):
- `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig`

## 2. Executar Scripts SQL

No chat do v0, execute os scripts SQL na ordem:
1. `scripts/001_create_database_schema.sql`
2. `scripts/002_setup_rls_policies.sql`

## 3. Entendendo os Links

- **http://localhost:3000/dashboard** - É o SEU app rodando na sua máquina (não é do Supabase!)
  - Depois de criar a conta, você será redirecionado para essa URL
  - É onde fica o painel de controle da sua aplicação
  
- **https://kojduqsmxipoayecuvsi.supabase.co** - É o servidor do Supabase onde seus dados ficam

## 4. Fluxo de Cadastro

1. Usuário preenche formulário em `/auth/sign-up`
2. Supabase envia email de confirmação
3. Usuário clica no link do email
4. Supabase redireciona para `http://localhost:3000/dashboard` (seu app)
5. Usuário já está logado e vê o dashboard

## 5. Segurança das Keys

### ANON KEY (Pública) ✅
- Pode ficar no front-end
- Protegida por RLS (Row Level Security)
- Usuários só acessam seus próprios dados

### SERVICE ROLE KEY (Privada) ⚠️
- NUNCA expor no front-end
- Apenas em APIs server-side (pasta `/app/api/`)
- Bypassa RLS - use com cuidado!
