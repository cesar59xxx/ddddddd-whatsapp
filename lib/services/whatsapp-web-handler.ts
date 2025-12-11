// Message handler that integrates WhatsApp Web.js with the database and chatbot
import { createServerClient } from "@supabase/ssr"
import type { Message } from "whatsapp-web.js"
import { chatbotService } from "./chatbot"
import { whatsappWebService } from "./whatsapp-web"

export class WhatsAppMessageHandler {
  private supabase

  constructor() {
    // Create Supabase client with service role for background processing
    this.supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    })
  }

  async handleIncomingMessage(instanceId: string, message: Message): Promise<void> {
    try {
      const from = message.from
      const content = message.body
      const hasMedia = message.hasMedia

      // Get instance with chatbot config
      const { data: instance } = await this.supabase
        .from("whatsapp_instances")
        .select("*, chatbot_configs(*)")
        .eq("id", instanceId)
        .single()

      if (!instance) {
        console.error("[WhatsApp] Instance not found:", instanceId)
        return
      }

      // Get or create conversation
      let { data: conversation } = await this.supabase
        .from("conversations")
        .select("*")
        .eq("instance_id", instanceId)
        .eq("phone_number", from)
        .eq("status", "open")
        .single()

      if (!conversation) {
        const { data: newConv } = await this.supabase
          .from("conversations")
          .insert({
            instance_id: instanceId,
            phone_number: from,
            status: "open",
          })
          .select()
          .single()

        conversation = newConv
      }

      if (!conversation) {
        console.error("[WhatsApp] Failed to create conversation")
        return
      }

      // Save incoming message
      await this.supabase.from("messages").insert({
        conversation_id: conversation.id,
        message_id: message.id.id,
        direction: "inbound",
        content: content,
        type: hasMedia ? "media" : "text",
        is_from_bot: false,
      })

      // Get or create lead
      const { data: lead } = await this.supabase
        .from("leads")
        .select("*")
        .eq("instance_id", instanceId)
        .eq("phone_number", from)
        .single()

      if (!lead) {
        await this.supabase.from("leads").insert({
          instance_id: instanceId,
          phone_number: from,
          source: "whatsapp",
          status: "new",
          last_interaction: new Date().toISOString(),
        })
      } else {
        await this.supabase.from("leads").update({ last_interaction: new Date().toISOString() }).eq("id", lead.id)
      }

      // Process with chatbot if active
      if (conversation.is_bot_active && instance.chatbot_configs && instance.chatbot_configs.length > 0) {
        const config = instance.chatbot_configs[0]

        if (config.is_active) {
          const response = await chatbotService.processMessage(config, content, {
            hasInteracted: true,
            leadId: lead?.id,
          })

          // Send bot response
          await whatsappWebService.sendMessage(instanceId, from, response.message)

          // Save bot response
          await this.supabase.from("messages").insert({
            conversation_id: conversation.id,
            direction: "outbound",
            content: response.message,
            type: "text",
            is_from_bot: true,
          })
        }
      }

      // Log analytics event
      await this.supabase.from("analytics_events").insert({
        instance_id: instanceId,
        event_type: "message_received",
        event_data: { from, hasMedia },
      })
    } catch (error) {
      console.error("[WhatsApp] Error handling incoming message:", error)
    }
  }
}

export const messageHandler = new WhatsAppMessageHandler()
