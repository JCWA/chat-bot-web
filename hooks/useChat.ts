'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export interface ChatMessage {
  id: string
  userId: string
  message: string
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
      transports: ['websocket'],
    })

    socketRef.current = socket

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('receiveMessage', (data: { userId: string; message: string }) => {
      if (data.userId === 'bot') setBotTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          userId: data.userId,
          message: data.message,
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
