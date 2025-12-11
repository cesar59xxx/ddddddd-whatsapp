"use client"

import { useState, useEffect } from "react"
import type { Database } from "@/lib/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, RefreshCw, LinkIcon, Copy, Check, XCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Instance = Database["public"]["Tables"]["whatsapp_instances"]["Row"]

interface InstanceDetailsProps {
  instance: Instance
}

export function InstanceDetails({ instance: initialInstance }: InstanceDetailsProps) {
  const [instance, setInstance] = useState(initialInstance)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [copied, setCopied] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (instance.status === "connecting") {
      const interval = setInterval(() => {
        refreshStatus()
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [instance.status])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500"
      case "connecting":
        return "bg-yellow-500"
      case "disconnected":
        return "bg-gray-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "connected":
        return "Conectado"
      case "connecting":
        return "Conectando"
      case "disconnected":
        return "Desconectado"
      case "error":
        return "Erro"
      default:
        return status
    }
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const response = await fetch(`/api/whatsapp/instances/${instance.id}/connect`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Erro ao conectar instância")
      }

      setInstance((prev) => ({
        ...prev,
        status: "connecting",
      }))
    } catch (error) {
      console.error("[WhatsApp] Error connecting:", error)
      alert("Erro ao conectar instância. Verifique os logs do servidor.")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm("Tem certeza que deseja desconectar esta instância?")) {
      return
    }

    setIsDisconnecting(true)
    try {
      const response = await fetch(`/api/whatsapp/instances/${instance.id}/disconnect`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Erro ao desconectar instância")
      }

      setInstance((prev) => ({
        ...prev,
        status: "disconnected",
        phone_number: null,
        qr_code: null,
      }))
    } catch (error) {
      console.error("[WhatsApp] Error disconnecting:", error)
      alert("Erro ao desconectar instância")
    } finally {
      setIsDisconnecting(false)
    }
  }

  const refreshStatus = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch(`/api/whatsapp/instances/${instance.id}/status`)

      if (!response.ok) {
        throw new Error("Erro ao buscar status")
      }

      const data = await response.json()

      setInstance((prev) => ({
        ...prev,
        status: data.status,
        phone_number: data.phoneNumber || prev.phone_number,
        qr_code: data.qrCode || prev.qr_code,
      }))
    } catch (error) {
      console.error("[WhatsApp] Error refreshing status:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateQRCodeDataUrl = (qrString: string) => {
    if (!qrString) return null
    // Use a QR code generation API
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrString)}`
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Tabs defaultValue="connection" className="w-full">
          <TabsList>
            <TabsTrigger value="connection">Conexão</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Status da Conexão</CardTitle>
                <CardDescription>Conecte seu WhatsApp escaneando o QR Code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${getStatusColor(instance.status)}`} />
                    <span className="font-medium">{getStatusLabel(instance.status)}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={refreshStatus} disabled={isRefreshing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    Atualizar
                  </Button>
                </div>

                {instance.status === "disconnected" && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Para conectar esta instância, clique no botão abaixo e escaneie o QR Code no seu WhatsApp.
                    </p>
                    <Button onClick={handleConnect} disabled={isConnecting}>
                      <QrCode className="mr-2 h-4 w-4" />
                      {isConnecting ? "Iniciando conexão..." : "Conectar WhatsApp"}
                    </Button>
                  </div>
                )}

                {instance.status === "connecting" && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Escaneie este QR Code no seu WhatsApp em: Configurações → Aparelhos Conectados → Conectar um
                      aparelho
                    </p>
                    {instance.qr_code ? (
                      <div className="flex justify-center rounded-lg border bg-white p-4">
                        <img
                          src={generateQRCodeDataUrl(instance.qr_code) || "/placeholder.svg"}
                          alt="QR Code"
                          className="h-64 w-64"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center rounded-lg border bg-muted p-8">
                        <div className="text-center">
                          <RefreshCw className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
                          <p className="mt-4 text-sm text-muted-foreground">Gerando QR Code...</p>
                        </div>
                      </div>
                    )}
                    <p className="text-center text-xs text-muted-foreground">
                      O status será atualizado automaticamente quando a conexão for estabelecida
                    </p>
                  </div>
                )}

                {instance.status === "connected" && (
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">WhatsApp Conectado!</p>
                      {instance.phone_number && (
                        <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                          Número: +{instance.phone_number}
                        </p>
                      )}
                    </div>
                    <Button variant="destructive" onClick={handleDisconnect} disabled={isDisconnecting}>
                      <XCircle className="mr-2 h-4 w-4" />
                      {isDisconnecting ? "Desconectando..." : "Desconectar"}
                    </Button>
                  </div>
                )}

                {instance.status === "error" && (
                  <div className="rounded-lg border bg-destructive/10 p-4">
                    <p className="text-sm font-medium text-destructive">Erro na Conexão</p>
                    <p className="mt-1 text-sm text-destructive/80">
                      Houve um erro ao conectar. Tente novamente ou entre em contato com o suporte.
                    </p>
                    <Button className="mt-4" variant="destructive" onClick={handleConnect} disabled={isConnecting}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Tentar Novamente
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Instância</CardTitle>
                <CardDescription>Personalize as configurações desta instância</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instanceName">Nome da Instância</Label>
                  <Input id="instanceName" defaultValue={instance.name} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">URL do Webhook (opcional)</Label>
                  <Input id="webhookUrl" defaultValue={instance.webhook_url || ""} placeholder="https://..." />
                  <p className="text-sm text-muted-foreground">
                    Receba notificações de mensagens em tempo real via webhook
                  </p>
                </div>

                <Button>Salvar Alterações</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Credenciais da API</CardTitle>
                <CardDescription>Use estas credenciais para integrar com sua aplicação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>ID da Instância</Label>
                  <div className="flex gap-2">
                    <Input value={instance.id} readOnly />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(instance.id)} title="Copiar">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {instance.api_key && (
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="flex gap-2">
                      <Input value={instance.api_key} readOnly type="password" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(instance.api_key!)}
                        title="Copiar"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Mantenha esta chave em segredo</p>
                  </div>
                )}

                <div className="rounded-lg border bg-muted p-4">
                  <p className="text-sm font-medium">Endpoint Base</p>
                  <code className="mt-1 block text-sm">{`${typeof window !== "undefined" ? window.location.origin : ""}/api/whatsapp`}</code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge className="mt-1" variant="secondary">
                {getStatusLabel(instance.status)}
              </Badge>
            </div>
            {instance.phone_number && (
              <div>
                <p className="text-muted-foreground">Número</p>
                <p className="mt-1 font-medium">+{instance.phone_number}</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground">Criada em</p>
              <p className="mt-1 font-medium">{new Date(instance.created_at).toLocaleDateString("pt-BR")}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <a href="/chatbots">
                <LinkIcon className="mr-2 h-4 w-4" />
                Ver Chatbots
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
              <a href="/leads">
                <LinkIcon className="mr-2 h-4 w-4" />
                Ver Leads
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
