import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { InstanceDetails } from "@/components/instance-details"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function InstanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: instance } = await supabase
    .from("whatsapp_instances")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!instance) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">{instance.name}</h1>
        <p className="text-muted-foreground">Detalhes e configurações da instância</p>
      </div>

      <InstanceDetails instance={instance} />
    </div>
  )
}
