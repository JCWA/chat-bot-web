'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export interface MedicineCard {
  item_name: string
  entp_name: string
  item_image: string | null
  drug_shape: string | null
  color: string | null
  class_name: string | null
  efcy: string | null
}

export interface ChatMessage {
  id: string
  userId: string
  message: string
  medicines?: MedicineCard[]
  timestamp: number
}

interface UseChatOptions {
  chatId: string
  userId: string
}

export function useChat({ chatId, userId }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [connected, setConnected] = useState(false)
  const [botTyping, setBotTyping] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3000'
    const socket = io(`${socketUrl}/chat/${chatId}`, {
      query: { userId },
      transports: ['polling', 'websocket'],
    })

    socketRef.current = socket

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('receiveMessage', (data: { userId: string; message: string; medicines?: MedicineCard[] }) => {
      if (data.userId === 'bot') setBotTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          userId: data.userId,
          message: data.message,
          medicines: data.medicines,
          timestamp: Date.now(),
        },
      ])
    })

    return () => {
      socket.disconnect()
    }
  }, [chatId, userId])

  const sendMessage = useCallback((message: string) => {
    if (!socketRef.current?.connected || !message.trim()) return
    setBotTyping(true)
    socketRef.current.emit('sendMessage', { message })
  }, [])

  return { messages, connected, botTyping, sendMessage }
}
