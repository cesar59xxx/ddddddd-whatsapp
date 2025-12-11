"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Database } from "@/lib/types/database"

type Instance = Database["public"]["Tables"]["whatsapp_instances"]["Row"]

interface NewChatbotFormProps {
  instances: Instance[]
}

export function NewChatbotForm({ instances }: NewChatbotFormProps) {
  const [name, setName] = useState("")
  const [instanceId, setInstanceId] = useState("")
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Olá! Bem-vindo ao nosso atendimento automatizado. Como posso ajudar?",
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!instanceId) {
        throw new Error("Selecione uma instância")
      }

      const { data: chatbot, error: createError } = await supabase
        .from("chatbot_configs")
        .insert({
          instance_id: instanceId,
          name,
          welcome_message: welcomeMessage,
          is_active: true,
          initial_options: [],
          flows: [],
        })
        .select()
        .single()

      if (createError) throw createError

      router.push(`/chatbots/${chatbot.id}`)
    } catch (error: any) {
      console.error("[v0] Error creating chatbot:", error)
      setError(error.message || "Erro ao criar chatbot")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Chatbot</Label>
        <Input
          id="name"
          type="text"
          placeholder="Ex: Atendimento Comercial"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instance">Instância WhatsApp</Label>
        <Select value={instanceId} onValueChange={setInstanceId} required>
          <SelectTrigger id="instance">
            <SelectValue placeholder="Selecione uma instância" />
          </SelectTrigger>
          <SelectContent>
            {instances.map((instance) => (
              <SelectItem key={instance.id} value={instance.id}>
                {instance.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="welcomeMessage">Mensagem de Boas-vindas</Label>
        <Textarea
          id="welcomeMessage"
          placeholder="Digite a mensagem inicial..."
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
          rows={4}
          required
        />
      </div>

      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Criando..." : "Criar Chatbot"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
