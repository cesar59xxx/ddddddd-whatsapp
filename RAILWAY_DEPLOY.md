# Deploy do Backend WhatsApp (Railway)

## Por que Railway?

O whatsapp-web.js precisa de um servidor sempre ativo (stateful) para manter as sessões do WhatsApp conectadas. A Vercel usa funções serverless que são efêmeras, então não funcionam para o WhatsApp.

## Arquitetura

- **Vercel**: Frontend (páginas, dashboard, auth)
- **Railway**: Backend WhatsApp (whatsapp-web.js, QR codes, mensagens)
- **Supabase**: Database (usuários, leads, conversas)

## Passo 1: Criar conta no Railway

1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em **"New Project"**

## Passo 2: Preparar código do backend

Vou criar uma estrutura separada para o backend WhatsApp que você pode deployar no Railway.

## Passo 3: Conectar Vercel + Railway

O frontend na Vercel vai fazer requisições para o backend no Railway via API REST.

### No Railway:
- URL do backend: `https://seu-backend.railway.app`

### No Vercel:
Adicione variável de ambiente:
\`\`\`
NEXT_PUBLIC_WHATSAPP_API_URL=https://seu-backend.railway.app
\`\`\`

## Continuar?

Quer que eu crie a estrutura completa do backend separado para deploy no Railway? Isso incluirá:
- Servidor Express.js dedicado
- Gerenciamento de sessões whatsapp-web.js
- APIs para conectar/desconectar
- Sistema de webhooks para notificar o frontend
- Docker configuration para Railway
