import { Client, LocalAuth } from "whatsapp-web.js"
import { createClient } from "@supabase/supabase-js"

interface ClientData {
  client: Client
  qrCode: string | null
  status: "initializing" | "qr" | "ready" | "disconnected"
  userId: string
}

export class WhatsAppManager {
  private static instance: WhatsAppManager
  private clients: Map<string, ClientData> = new Map()
  private supabase

  private constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || "https://kojduqsmxipoayecuvsi.supabase.co",
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig",
    )
  }

  public static getInstance(): WhatsAppManager {
    if (!WhatsAppManager.instance) {
      WhatsAppManager.instance = new WhatsAppManager()
    }
    return WhatsAppManager.instance
  }

  async initializeClient(instanceId: string, userId: string): Promise<void> {
    if (this.clients.has(instanceId)) {
      console.log(`Cliente ${instanceId} já existe`)
      return
    }

    const client = new Client({
      authStrategy: new LocalAuth({ clientId: instanceId }),
      puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    })

    const clientData: ClientData = {
      client,
      qrCode: null,
      status: "initializing",
      userId,
    }

    this.clients.set(instanceId, clientData)

    // QR Code recebido
    client.on("qr", async (qr) => {
      console.log(`QR Code gerado para ${instanceId}`)
      clientData.qrCode = qr
      clientData.status = "qr"

      await this.supabase.from("whatsapp_instances").update({ status: "qr_code" }).eq("id", instanceId)
    })

    // Cliente pronto
    client.on("ready", async () => {
      console.log(`Cliente ${instanceId} conectado!`)
      clientData.status = "ready"
      clientData.qrCode = null

      await this.supabase
        .from("whatsapp_instances")
        .update({
          status: "connected",
          connected_at: new Date().toISOString(),
        })
        .eq("id", instanceId)
    })

    // Mensagem recebida
    client.on("message", async (msg) => {
      console.log(`Mensagem recebida em ${instanceId}: ${msg.body}`)

      // Salvar no banco
      await this.supabase.from("messages").insert({
        instance_id: instanceId,
        from_number: msg.from,
        message_type: "text",
        content: msg.body,
        direction: "incoming",
        timestamp: new Date(msg.timestamp * 1000).toISOString(),
      })

      // TODO: Processar com chatbot
    })

    // Desconectado
    client.on("disconnected", async (reason) => {
      console.log(`Cliente ${instanceId} desconectado: ${reason}`)
      clientData.status = "disconnected"

      await this.supabase.from("whatsapp_instances").update({ status: "disconnected" }).eq("id", instanceId)

      this.clients.delete(instanceId)
    })

    await client.initialize()
  }

  getQRCode(instanceId: string): string | null {
    const clientData = this.clients.get(instanceId)
    return clientData?.qrCode || null
  }

  getStatus(instanceId: string): string {
    const clientData = this.clients.get(instanceId)
    return clientData?.status || "disconnected"
  }

  async sendMessage(instanceId: string, to: string, message: string): Promise<string> {
    const clientData = this.clients.get(instanceId)

    if (!clientData || clientData.status !== "ready") {
      throw new Error("Cliente não conectado")
    }

    const result = await clientData.client.sendMessage(to, message)

    // Salvar no banco
    await this.supabase.from("messages").insert({
      instance_id: instanceId,
      to_number: to,
      message_type: "text",
      content: message,
      direction: "outgoing",
      timestamp: new Date().toISOString(),
    })

    return result.id.id
  }

  async disconnectClient(instanceId: string): Promise<void> {
    const clientData = this.clients.get(instanceId)

    if (clientData) {
      await clientData.client.destroy()
      this.clients.delete(instanceId)
    }
  }
}
