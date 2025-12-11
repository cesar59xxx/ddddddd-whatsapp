"use client"

import type { Database } from "@/lib/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, Settings, Trash2, Power, PowerOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

type Chatbot = Database["public"]["Tables"]["chatbot_configs"]["Row"] & {
  whatsapp_instances: {
    id: string
    name: string
  }
}

interface ChatbotsListProps {
  chatbots: Chatbot[]
}

export function ChatbotsList({ chatbots }: ChatbotsListProps) {
  const router = useRouter()
  const supabase = createClient()
  const [updating, setUpdating] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setUpdating(id)
    const { error } = await supabase.from("chatbot_configs").update({ is_active: !currentStatus }).eq("id", id)

    if (error) {
      console.error("[v0] Error toggling chatbot:", error)
      alert("Erro ao atualizar chatbot")
    } else {
      router.refresh()
    }
    setUpdating(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este chatbot?")) {
      return
    }

    setDeleting(id)
    const { error } = await supabase.from("chatbot_configs").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting chatbot:", error)
      alert("Erro ao excluir chatbot")
    } else {
      router.refresh()
    }
    setDeleting(null)
  }

  if (chatbots.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bot className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Nenhum chatbot encontrado</h3>
          <p className="mb-4 text-sm text-muted-foreground">Comece criando seu primeiro chatbot</p>
          <Button asChild>
            <Link href="/chatbots/new">Criar Primeiro Chatbot</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {chatbots.map((chatbot) => (
        <Card key={chatbot.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <CardTitle className="text-lg">{chatbot.name}</CardTitle>
              </div>
              <Badge variant={chatbot.is_active ? "default" : "secondary"}>
                {chatbot.is_active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <CardDescription>{chatbot.whatsapp_instances.name}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-end gap-2">
            <div className="mb-2 text-sm text-muted-foreground">
              {chatbot.openai_enabled && <Badge variant="outline">IA Ativada</Badge>}
            </div>
            <Button asChild className="w-full">
              <Link href={`/chatbots/${chatbot.id}`}>
                <Settings className="mr-2 h-4 w-4" />
                Configurar
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => handleToggleActive(chatbot.id, chatbot.is_active)}
                disabled={updating === chatbot.id}
              >
                {chatbot.is_active ? <PowerOff className="mr-2 h-4 w-4" /> : <Power className="mr-2 h-4 w-4" />}
                {updating === chatbot.id ? "..." : chatbot.is_active ? "Desativar" : "Ativar"}
              </Button>
              <Button
                variant="outline"
                className="text-destructive bg-transparent"
                onClick={() => handleDelete(chatbot.id)}
                disabled={deleting === chatbot.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
