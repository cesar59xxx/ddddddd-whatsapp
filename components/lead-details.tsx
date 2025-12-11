"use client"

import { useState } from "react"
import type { Database } from "@/lib/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, MessageSquare, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type Lead = Database["public"]["Tables"]["leads"]["Row"] & {
  whatsapp_instances: {
    id: string
    name: string
  }
}

type Conversation = Database["public"]["Tables"]["conversations"]["Row"] & {
  messages: Database["public"]["Tables"]["messages"]["Row"][]
}

interface LeadDetailsProps {
  lead: Lead
  conversations: Conversation[]
}

export function LeadDetails({ lead: initialLead, conversations }: LeadDetailsProps) {
  const [lead, setLead] = useState(initialLead)
  const [isSaving, setIsSaving] = useState(false)
  const [newTag, setNewTag] = useState("")
  const supabase = createClient()
  const router = useRouter()

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from("leads")
        .update({
          name: lead.name,
          email: lead.email,
          status: lead.status,
          tags: lead.tags,
          notes: lead.notes,
        })
        .eq("id", lead.id)

      if (error) throw error

      alert("Lead atualizado com sucesso!")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving lead:", error)
      alert("Erro ao salvar lead")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !lead.tags.includes(newTag.trim())) {
      setLead({ ...lead, tags: [...lead.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setLead({ ...lead, tags: lead.tags.filter((t) => t !== tag) })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500"
      case "contacted":
        return "bg-yellow-500"
      case "qualified":
        return "bg-purple-500"
      case "converted":
        return "bg-green-500"
      case "lost":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Tabs defaultValue="info" className="w-full">
          <TabsList>
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="conversations">
              Conversas
              {conversations.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {conversations.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dados do Lead</CardTitle>
                <CardDescription>Edite as informações do contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={lead.name || ""}
                      onChange={(e) => setLead({ ...lead, name: e.target.value })}
                      placeholder="Nome do contato"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" value={lead.phone_number} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={lead.email || ""}
                      onChange={(e) => setLead({ ...lead, email: e.target.value })}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={lead.status} onValueChange={(v: any) => setLead({ ...lead, status: v })}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Novo</SelectItem>
                        <SelectItem value="contacted">Contatado</SelectItem>
                        <SelectItem value="qualified">Qualificado</SelectItem>
                        <SelectItem value="converted">Convertido</SelectItem>
                        <SelectItem value="lost">Perdido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={lead.notes || ""}
                    onChange={(e) => setLead({ ...lead, notes: e.target.value })}
                    rows={4}
                    placeholder="Adicione observações sobre este lead..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Adicionar tag..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <Button onClick={handleAddTag}>Adicionar</Button>
                  </div>
                  {lead.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {lead.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversations" className="space-y-4">
            {conversations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">Nenhuma conversa</h3>
                  <p className="text-sm text-muted-foreground">Ainda não há conversas com este lead</p>
                </CardContent>
              </Card>
            ) : (
              conversations.map((conversation) => (
                <Card key={conversation.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        Conversa de {new Date(conversation.created_at).toLocaleDateString("pt-BR")}
                      </CardTitle>
                      <Badge variant={conversation.status === "open" ? "default" : "secondary"}>
                        {conversation.status === "open" ? "Aberta" : "Fechada"}
                      </Badge>
                    </div>
                    <CardDescription>{conversation.messages.length} mensagens</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {conversation.messages.slice(0, 5).map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-2 ${message.direction === "outbound" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.direction === "outbound" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            {message.is_from_bot && (
                              <Badge variant="outline" className="mb-1 text-xs">
                                Bot
                              </Badge>
                            )}
                            <p className="text-sm">{message.content}</p>
                            <p className="mt-1 text-xs opacity-70">
                              {new Date(message.created_at).toLocaleTimeString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      ))}
                      {conversation.messages.length > 5 && (
                        <p className="text-center text-sm text-muted-foreground">
                          + {conversation.messages.length - 5} mensagens
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge className={`mt-1 ${getStatusColor(lead.status)} text-white`}>
                {lead.status === "new" && "Novo"}
                {lead.status === "contacted" && "Contatado"}
                {lead.status === "qualified" && "Qualificado"}
                {lead.status === "converted" && "Convertido"}
                {lead.status === "lost" && "Perdido"}
              </Badge>
            </div>

            <div>
              <p className="text-muted-foreground">Instância</p>
              <p className="mt-1 font-medium">{lead.whatsapp_instances.name}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Fonte</p>
              <p className="mt-1 font-medium">{lead.source || "Desconhecida"}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Criado em</p>
              <p className="mt-1 font-medium">{new Date(lead.created_at).toLocaleDateString("pt-BR")}</p>
            </div>

            {lead.last_interaction && (
              <div>
                <p className="text-muted-foreground">Última interação</p>
                <p className="mt-1 font-medium">{new Date(lead.last_interaction).toLocaleString("pt-BR")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <MessageSquare className="mr-2 h-4 w-4" />
              Enviar Mensagem
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <User className="mr-2 h-4 w-4" />
              Exportar Dados
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
