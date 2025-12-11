import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LeadDetails } from "@/components/lead-details"
import { notFound } from "next/navigation"

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get lead with instance info
  const { data: lead } = await supabase
    .from("leads")
    .select(
      `
      *,
      whatsapp_instances!inner(id, name, user_id)
    `,
    )
    .eq("id", id)
    .eq("whatsapp_instances.user_id", user.id)
    .single()

  if (!lead) {
    notFound()
  }

  // Get conversations for this lead
  const { data: conversations } = await supabase
    .from("conversations")
    .select(
      `
      *,
      messages(*)
    `,
    )
    .eq("lead_id", id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">{lead.name || lead.phone_number}</h1>
        <p className="text-muted-foreground">Detalhes do lead</p>
      </div>

      <LeadDetails lead={lead} conversations={conversations || []} />
    </div>
  )
}
