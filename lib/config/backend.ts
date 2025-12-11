export const BACKEND_CONFIG = {
  // Em produção na Vercel, usar a URL do Railway
  // Em desenvolvimento local, usar localhost
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
  endpoints: {
    whatsapp: {
      connect: (instanceId: string) => `/api/whatsapp/instances/${instanceId}/connect`,
      disconnect: (instanceId: string) => `/api/whatsapp/instances/${instanceId}/disconnect`,
      status: (instanceId: string) => `/api/whatsapp/instances/${instanceId}/status`,
      send: (instanceId: string) => `/api/whatsapp/instances/${instanceId}/send`,
    },
  },
}
