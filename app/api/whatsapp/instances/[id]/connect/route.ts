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

    await whatsappWebService.initializeInstance(id)

    // Update instance status
    const { error: updateError } = await supabase
      .from("whatsapp_instances")
      .update({
        status: "connecting",
      })
      .eq("id", id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "WhatsApp connection initiated" })
  } catch (error) {
    console.error("[WhatsApp] Error connecting instance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
