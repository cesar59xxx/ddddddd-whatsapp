"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database"
import { Save } from "lucide-react"

type Profile = Database["public"]["Tables"]["users"]["Row"]

interface SettingsFormProps {
  user: User
  profile: Profile | null
}

export function SettingsForm({ user, profile }: SettingsFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [companyName, setCompanyName] = useState(profile?.company_name || "")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: fullName,
          company_name: companyName,
        })
        .eq("id", user.id)

      if (error) throw error

      alert("Perfil atualizado com sucesso!")
    } catch (error: any) {
      console.error("[v0] Error updating profile:", error)
      setError(error.message || "Erro ao atualizar perfil")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={user.email} disabled />
        <p className="text-sm text-muted-foreground">O email não pode ser alterado</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Nome Completo</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Seu nome"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">Nome da Empresa</Label>
        <Input
          id="companyName"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Nome da sua empresa"
        />
      </div>

      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <Button type="submit" disabled={isSaving}>
        <Save className="mr-2 h-4 w-4" />
        {isSaving ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  )
}
