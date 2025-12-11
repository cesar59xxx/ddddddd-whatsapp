import { createServerClient } from "@supabase/ssr"
import { chatbotService } from "@/lib/services/chatbot"
import { whatsappWebService } from "@/lib/services/whatsapp-web"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { instanceId, apiKey, from, message, type = "text" } = body

    if (!instanceId || !apiKey) {
      return NextResponse.json({ error: "Missing instanceId or apiKey" }, { status: 400 })
    }

    // Create Supabase client with service role for webhook processing
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    })

    // Verify API key
    const { data: instance, error: instanceError } = await supabase
      .from("whatsapp_instances")
      .select("*, chatbot_configs(*)")
      .eq("id", instanceId)
      .eq("api_key", apiKey)
      .single()

    if (instanceError || !instance) {
      return NextResponse.json({ error: "Invalid instance or API key" }, { status: 401 })
    }

    // Get or create conversation
    let { data: conversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("instance_id", instanceId)
      .eq("phone_number", from)
      .eq("status", "open")
      .single()

    if (!conversation) {
      const { data: newConv, error: convError } = await supabase
        .from("conversations")
        .insert({
          instance_id: instanceId,
          phone_number: from,
          status: "open",
        })
        .select()
        .single()

      if (convError) {
        console.error("[WhatsApp] Error creating conversation:", convError)
        return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
      }

      conversation = newConv
    }

    // Save incoming message
    await supabase.from("messages").insert({
      conversation_id: conversation.id,
      message_id: `msg_${Date.now()}`,
      direction: "inbound",
      content: message,
      type: type,
      is_from_bot: false,
    })

    // Get or create lead
    const { data: lead } = await supabase
      .from("leads")
      .select("*")
      .eq("instance_id", instanceId)
      .eq("phone_number", from)
      .single()

    if (!lead) {
      await supabase.from("leads").insert({
        instance_id: instanceId,
        phone_number: from,
        source: "whatsapp",
        status: "new",
        last_interaction: new Date().toISOString(),
      })
    } else {
      await supabase.from("leads").update({ last_interaction: new Date().toISOString() }).eq("id", lead.id)
    }

    // Process with chatbot if active
    if (conversation.is_bot_active && instance.chatbot_configs && instance.chatbot_configs.length > 0) {
      const config = instance.chatbot_configs[0]

      if (config.is_active) {
        const response = await chatbotService.processMessage(config, message, {
          hasInteracted: true,
          leadId: lead?.id,
        })

        // Send bot response
        await whatsappWebService.sendMessage(instanceId, from, response.message)

        // Save bot response
        await supabase.from("messages").insert({
          conversation_id: conversation.id,
          direction: "outbound",
          content: response.message,
          type: "text",
          is_from_bot: true,
        })
      }
    }

    // Log analytics event
    await supabase.from("analytics_events").insert({
      instance_id: instanceId,
      event_type: "message_received",
      event_data: { from, type },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[WhatsApp] Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
