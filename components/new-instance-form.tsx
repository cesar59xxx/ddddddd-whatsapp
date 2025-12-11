"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function NewInstanceForm() {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Usuário não autenticado")
      }

      const { data: instance, error: createError } = await supabase
        .from("whatsapp_instances")
        .insert({
          user_id: user.id,
          name,
          status: "disconnected",
        })
        .select()
        .single()

      if (createError) throw createError

      router.push(`/instances/${instance.id}`)
    } catch (error: any) {
      console.error("[v0] Error creating instance:", error)
      setError(error.message || "Erro ao criar instância")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Instância</Label>
        <Input
          id="name"
          type="text"
          placeholder="Ex: Atendimento Principal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <p className="text-sm text-muted-foreground">
          Escolha um nome que ajude a identificar esta conexão do WhatsApp
        </p>
      </div>

      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Criando..." : "Criar Instância"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
