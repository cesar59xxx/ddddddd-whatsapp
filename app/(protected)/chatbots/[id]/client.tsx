"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ChatbotEditor } from "@/components/chatbot-editor"
import { Loader2 } from "lucide-react"

export default function ChatbotDetailPageClient({ id }: { id: string }) {
  const [chatbot, setChatbot] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadChatbot() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push("/auth/login")
        return
      }

      const { data, error } = await supabase
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

      if (error || !data) {
        router.push("/chatbots")
        return
      }

      setChatbot(data)
      setLoading(false)
    }

    loadChatbot()
  }, [id, router, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!chatbot) return null

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
