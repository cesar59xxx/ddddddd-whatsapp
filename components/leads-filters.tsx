"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import type { Database } from "@/lib/types/database"

type Instance = Pick<Database["public"]["Tables"]["whatsapp_instances"]["Row"], "id" | "name">

interface LeadsFiltersProps {
  instances: Instance[]
  currentFilters: {
    status?: string
    instance?: string
    search?: string
  }
}

export function LeadsFilters({ instances, currentFilters }: LeadsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/leads?${params.toString()}`)
  }

  const handleClearFilters = () => {
    router.push("/leads")
  }

  const hasActiveFilters = currentFilters.status || currentFilters.instance || currentFilters.search

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Nome, telefone ou email..."
                defaultValue={currentFilters.search}
                onChange={(e) => {
                  const value = e.target.value
                  const timeoutId = setTimeout(() => {
                    handleFilterChange("search", value || null)
                  }, 500)
                  return () => clearTimeout(timeoutId)
                }}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2 md:w-48">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={currentFilters.status || "all"}
              onValueChange={(v) => handleFilterChange("status", v === "all" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="new">Novo</SelectItem>
                <SelectItem value="contacted">Contatado</SelectItem>
                <SelectItem value="qualified">Qualificado</SelectItem>
                <SelectItem value="converted">Convertido</SelectItem>
                <SelectItem value="lost">Perdido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:w-48">
            <label className="text-sm font-medium">Instância</label>
            <Select
              value={currentFilters.instance || "all"}
              onValueChange={(v) => handleFilterChange("instance", v === "all" ? null : v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {instances.map((instance) => (
                  <SelectItem key={instance.id} value={instance.id}>
                    {instance.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
