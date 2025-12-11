import { createClient } from "@/lib/supabase/server"
import { whatsappWebService } from "@/lib/services/whatsapp-web"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify instance belongs to user
    const { data: instance, error: instanceError } = await supabase
      .from("whatsapp_instances")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (instanceError || !instance) {
      return NextResponse.json({ error: "Instance not found" }, { status: 404 })
    }

    const body = await request.json()
    const { to, message, mediaUrl, caption } = body

    if (!to || (!message && !mediaUrl)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Send message via whatsapp-web.js
    if (mediaUrl) {
      await whatsappWebService.sendMediaMessage(id, to, mediaUrl, caption)
    } else {
      await whatsappWebService.sendMessage(id, to, message)
    }

    // Log analytics event
    await supabase.from("analytics_events").insert({
      instance_id: id,
      event_type: "message_sent",
      event_data: { to, hasMedia: !!mediaUrl },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[WhatsApp] Error sending message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
