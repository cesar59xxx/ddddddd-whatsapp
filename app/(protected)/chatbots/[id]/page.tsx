import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ChatbotEditor } from "@/components/chatbot-editor"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
export const dynamicParams = true

export default async function ChatbotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: chatbot } = await supabase
    .from("chatbot_configs")
    .select(
      `
      *,
      whatsapp_instances!inner(id, name, user_id)
    `,
    )
    .eq("id", id)
    .eq("whatsapp_instances.user_id", user.id)
    .single()

  if (!chatbot) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">{chatbot.name}</h1>
        <p className="text-muted-foreground">Edite as configurações do chatbot</p>
      </div>

      <ChatbotEditor chatbot={chatbot} />
    </div>
  )
}
