import { createClient } from "@/lib/supabase/server"
import { whatsappWebService } from "@/lib/services/whatsapp-web"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const status = await whatsappWebService.getInstanceStatus(id)

    // Update database if status changed
    if (status && status.status !== instance.status) {
      await supabase
        .from("whatsapp_instances")
        .update({
          status: status.status,
          phone_number: status.phoneNumber,
          qr_code: status.qrCode || null,
        })
        .eq("id", id)
    }

    return NextResponse.json({
      status: status?.status || instance.status,
      phoneNumber: status?.phoneNumber || instance.phone_number,
      qrCode: status?.qrCode || instance.qr_code,
    })
  } catch (error) {
    console.error("[WhatsApp] Error fetching status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
