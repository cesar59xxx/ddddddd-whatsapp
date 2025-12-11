"use client"

import { useParams } from "next/navigation"
import ChatbotDetailPageClient from "./client"

export default function ChatbotDetailPage() {
  const params = useParams()
  const id = params?.id as string

  return <ChatbotDetailPageClient id={id} />
}
