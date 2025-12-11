import ChatbotDetailPageClient from "./client"

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0

export default async function ChatbotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params

  return <ChatbotDetailPageClient id={resolvedParams.id} />
}
