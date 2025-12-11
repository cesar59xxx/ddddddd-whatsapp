import { Router } from "express"
import { WhatsAppManager } from "../services/whatsapp-manager"
import { createClient } from "@supabase/supabase-js"
import QRCode from "qrcode"

const router = Router()
const whatsappManager = WhatsAppManager.getInstance()

const supabase = createClient(
  process.env.SUPABASE_URL || "https://kojduqsmxipoayecuvsi.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvamR1cXNteGlwb2F5ZWN1dnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQ3ODg2NSwiZXhwIjoyMDgxMDU0ODY1fQ.dEgoQAHl78BbrMRucng075-kx4b7ErWWIhh-WySX8ig",
)

// Conectar instância
router.post("/instances/:id/connect", async (req, res) => {
  try {
    const { id } = req.params

    // Buscar instância no Supabase
    const { data: instance, error } = await supabase.from("whatsapp_instances").select("*").eq("id", id).single()

    if (error || !instance) {
      return res.status(404).json({ error: "Instância não encontrada" })
    }

    // Inicializar cliente WhatsApp
    await whatsappManager.initializeClient(instance.id, instance.user_id)

    res.json({ success: true, message: "Conexão iniciada" })
  } catch (error) {
    console.error("Erro ao conectar:", error)
    res.status(500).json({ error: "Erro ao conectar instância" })
  }
})

// Obter QR Code
router.get("/instances/:id/qr", async (req, res) => {
  try {
    const { id } = req.params
    const qrData = whatsappManager.getQRCode(id)

    if (!qrData) {
      return res.status(404).json({ error: "QR Code não disponível" })
    }

    // Converter para base64 image
    const qrImage = await QRCode.toDataURL(qrData)

    res.json({ qr: qrImage })
  } catch (error) {
    console.error("Erro ao obter QR:", error)
    res.status(500).json({ error: "Erro ao obter QR Code" })
  }
})

// Status da instância
router.get("/instances/:id/status", async (req, res) => {
  try {
    const { id } = req.params
    const status = whatsappManager.getStatus(id)

    res.json({ status })
  } catch (error) {
    console.error("Erro ao obter status:", error)
    res.status(500).json({ error: "Erro ao obter status" })
  }
})

// Desconectar instância
router.post("/instances/:id/disconnect", async (req, res) => {
  try {
    const { id } = req.params
    await whatsappManager.disconnectClient(id)

    // Atualizar status no Supabase
    await supabase.from("whatsapp_instances").update({ status: "disconnected" }).eq("id", id)

    res.json({ success: true, message: "Desconectado com sucesso" })
  } catch (error) {
    console.error("Erro ao desconectar:", error)
    res.status(500).json({ error: "Erro ao desconectar instância" })
  }
})

// Enviar mensagem
router.post("/instances/:id/send", async (req, res) => {
  try {
    const { id } = req.params
    const { to, message } = req.body

    if (!to || !message) {
      return res.status(400).json({ error: "Destinatário e mensagem são obrigatórios" })
    }

    const result = await whatsappManager.sendMessage(id, to, message)

    res.json({ success: true, messageId: result })
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error)
    res.status(500).json({ error: "Erro ao enviar mensagem" })
  }
})

export { router as whatsappRouter }
