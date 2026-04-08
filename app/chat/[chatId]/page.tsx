import ChatWindow from '@/components/ChatWindow'
import { nanoid } from 'nanoid'

interface Props {
  params: Promise<{ chatId: string }>
}

export default async function ChatPage({ params }: Props) {
  const { chatId } = await params
  // 익명 userId: 실제 서비스에서는 로그인 정보로 교체
  const userId = `user-${nanoid(6)}`

  return <ChatWindow chatId={chatId} userId={userId} />
}
