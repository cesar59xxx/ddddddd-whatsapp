# Backend Railway - WhatsApp Automation

Backend Node.js/Express para gerenciar whatsapp-web.js no Railway.

## Arquitetura

\`\`\`
Frontend (Vercel) → Backend (Railway) → Supabase
                         ↓
                   WhatsApp Web.js
\`\`\`

## Setup Railway

1. Crie um novo projeto no Railway: https://railway.app

2. Conecte este repositório ou faça upload dos arquivos da pasta `backend-railway`

3. Configure as variáveis de ambiente:
   - `PORT=3001`
   - `FRONTEND_URL=https://seu-app.vercel.app`
   - `SUPABASE_URL=https://kojduqsmxipoayecuvsi.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key`

4. Deploy será automático!

## Endpoints

### WhatsApp
- `POST /api/whatsapp/instances/:id/connect` - Conectar instância
- `GET /api/whatsapp/instances/:id/qr` - Obter QR Code
- `GET /api/whatsapp/instances/:id/status` - Status da conexão
- `POST /api/whatsapp/instances/:id/disconnect` - Desconectar
- `POST /api/whatsapp/instances/:id/send` - Enviar mensagem

### Webhook
- `POST /api/webhook/message` - Receber mensagens

## Desenvolvimento Local

\`\`\`bash
cd backend-railway
npm install
npm run dev
\`\`\`

## Deploy

\`\`\`bash
npm run build
npm start
\`\`\`

O Railway detecta automaticamente e faz deploy!
