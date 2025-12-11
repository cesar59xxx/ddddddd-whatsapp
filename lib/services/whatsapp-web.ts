// Real WhatsApp Web.js integration
import type { Client, Message } from "whatsapp-web.js"
import { messageHandler } from "./whatsapp-web-handler"

interface WhatsAppMessage {
  from: string
  to: string
  content: string
  type: "text" | "image" | "video" | "audio" | "document"
  mediaUrl?: string
}

interface InstanceStatus {
  status: "disconnected" | "connecting" | "connected" | "error"
  phoneNumber?: string
  qrCode?: string
}

class WhatsAppWebService {
  private instances: Map<string, { client: Client; status: InstanceStatus }> = new Map()

  async initializeInstance(instanceId: string): Promise<{ qrCode?: string }> {
    try {
      // Dynamically import whatsapp-web.js
      const { Client, LocalAuth } = await import("whatsapp-web.js")

      const client = new Client({
        authStrategy: new LocalAuth({
          clientId: instanceId,
        }),
        puppeteer: {
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
            "--disable-gpu",
          ],
        },
      })

      // Store instance with connecting status
      this.instances.set(instanceId, {
        client,
        status: { status: "connecting" },
      })

      // Handle QR code generation
      client.on("qr", (qr: string) => {
        console.log(`[WhatsApp] QR Code generated for ${instanceId}`)
        const instance = this.instances.get(instanceId)
        if (instance) {
          instance.status = {
            status: "connecting",
            qrCode: qr,
          }
        }
      })

      // Handle successful authentication
      client.on("ready", () => {
        console.log(`[WhatsApp] Instance ${instanceId} is ready`)
        const instance = this.instances.get(instanceId)
        if (instance) {
          instance.status = {
            status: "connected",
            phoneNumber: client.info?.wid?.user || "Unknown",
          }
        }
      })

      // Handle disconnection
      client.on("disconnected", (reason: string) => {
        console.log(`[WhatsApp] Instance ${instanceId} disconnected:`, reason)
        const instance = this.instances.get(instanceId)
        if (instance) {
          instance.status = { status: "disconnected" }
        }
      })

      client.on("message", async (message: Message) => {
        await messageHandler.handleIncomingMessage(instanceId, message)
      })

      // Initialize client
      await client.initialize()

      return { qrCode: undefined }
    } catch (error) {
      console.error(`[WhatsApp] Error initializing instance ${instanceId}:`, error)
      this.instances.set(instanceId, {
        client: {} as Client,
        status: { status: "error" },
      })
      throw error
    }
  }

  async getInstanceStatus(instanceId: string): Promise<InstanceStatus | null> {
    const instance = this.instances.get(instanceId)
    return instance?.status || null
  }

  async sendMessage(instanceId: string, to: string, message: string): Promise<void> {
    const instance = this.instances.get(instanceId)
    if (!instance || instance.status.status !== "connected") {
      throw new Error("Instance not connected")
    }

    try {
      // Format phone number properly for WhatsApp (remove special chars and add @c.us)
      const formattedNumber = to.replace(/[^\d]/g, "") + "@c.us"
      await instance.client.sendMessage(formattedNumber, message)
      console.log(`[WhatsApp] Message sent from ${instanceId} to ${to}`)
    } catch (error) {
      console.error(`[WhatsApp] Error sending message from ${instanceId}:`, error)
      throw error
    }
  }

  async sendMediaMessage(instanceId: string, to: string, mediaUrl: string, caption?: string): Promise<void> {
    const instance = this.instances.get(instanceId)
    if (!instance || instance.status.status !== "connected") {
      throw new Error("Instance not connected")
    }

    try {
      const { MessageMedia } = await import("whatsapp-web.js")
      const media = await MessageMedia.fromUrl(mediaUrl)
      const formattedNumber = to.replace(/[^\d]/g, "") + "@c.us"
      await instance.client.sendMessage(formattedNumber, media, { caption })
      console.log(`[WhatsApp] Media sent from ${instanceId} to ${to}`)
    } catch (error) {
      console.error(`[WhatsApp] Error sending media from ${instanceId}:`, error)
      throw error
    }
  }

  async disconnectInstance(instanceId: string): Promise<void> {
    const instance = this.instances.get(instanceId)
    if (instance) {
      try {
        await instance.client.destroy()
        console.log(`[WhatsApp] Instance ${instanceId} destroyed`)
      } catch (error) {
        console.error(`[WhatsApp] Error disconnecting ${instanceId}:`, error)
      }
      this.instances.delete(instanceId)
    }
  }

  async getClient(instanceId: string): Promise<Client | null> {
    const instance = this.instances.get(instanceId)
    return instance?.client || null
  }
}

export const whatsappWebService = new WhatsAppWebService()
