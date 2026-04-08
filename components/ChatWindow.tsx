'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@/hooks/useChat'

interface Props {
  chatId: string
  userId: string
}

export default function ChatWindow({ chatId, userId }: Props) {
  const { messages, connected, botTyping, sendMessage } = useChat({ chatId, userId })
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, botTyping])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    sendMessage(trimmed)
    setInput('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isBot = (uid: string) => uid === 'bot'
  const isMe = (uid: string) => uid === userId

  /** 봇 메시지에서 ![alt](url) 패턴을 이미지로 렌더링 */
  const renderMessage = (text: string, fromBot: boolean) => {
    if (!fromBot) return text

    const imgRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = imgRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index))
      }
      const alt = match[1]
      const url = match[2]
      parts.push(
        <img
          key={url}
          src={url}
          alt={alt || '약 이미지'}
          className="rounded-lg mt-2 max-w-full sm:max-w-[240px]"
          loading="lazy"
        />,
      )
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="flex items-center gap-2 px-3 py-3 sm:px-4 bg-white border-b shadow-sm">
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-400'}`} aria-label={connected ? '연결됨' : '연결 끊김'} />
        <h1 className="font-semibold text-gray-800 text-sm sm:text-base">AI 의약품 식별 챗봇</h1>
        <span className="text-xs text-gray-400 ml-auto">채팅방 #{chatId}</span>
      </header>

      {/* 메시지 목록 */}
      <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4 px-4">
            <span className="text-4xl sm:text-5xl" role="img" aria-label="알약">💊</span>
            <h2 className="font-semibold text-gray-700 text-base sm:text-lg">AI 의약품 식별 챗봇</h2>
            <p className="text-xs sm:text-sm text-center text-gray-400">약의 특징을 입력하면 어떤 약인지 찾아드립니다</p>

            <div className="w-full max-w-sm space-y-2 mt-2">
              <p className="text-xs font-medium text-gray-500 text-center">이렇게 물어보세요</p>
              {[
                '흰색 원형 알약에 C 글자가 있어',
                '노란색 긴 알약 뒷면에 325',
                '타이레놀 어떻게 생겼어?',
                '해열진통제 종류 알려줘',
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => { sendMessage(example); }}
                  className="w-full text-left px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 transition"
                >
                  &ldquo;{example}&rdquo;
                </button>
              ))}
            </div>

            <div className="text-[11px] text-gray-400 text-center mt-2 leading-relaxed">
              모양 · 색상 · 식별문자 · 약 이름 · 약효분류로 검색 가능<br />
              효능 · 용법 · 부작용 정보도 안내해드립니다
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <article
            key={msg.id}
            className={`flex ${isMe(msg.userId) ? 'justify-end' : 'justify-start'}`}
          >
            {/* 봇 아바타 */}
            {isBot(msg.userId) && (
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0 mt-1" aria-hidden="true">
                AI
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-[70%] min-w-0 ${isMe(msg.userId) ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
              {!isMe(msg.userId) && (
                <span className="text-xs text-gray-400 pl-1">{isBot(msg.userId) ? '봇' : msg.userId}</span>
              )}
              <div
                className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  isMe(msg.userId)
                    ? 'bg-indigo-500 text-white rounded-tr-sm'
                    : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'
                }`}
              >
                {renderMessage(msg.message, isBot(msg.userId))}
              </div>

              {/* 약 카드 목록 */}
              {msg.medicines && msg.medicines.length > 0 && (
                <div className="flex gap-2 overflow-x-auto mt-1.5 pb-1 touch-pan-x overscroll-x-contain">
                  {msg.medicines.map((med) => (
                    <button
                      key={med.item_name}
                      onClick={() => sendMessage(`${med.item_name} 알려줘`)}
                      className="flex-shrink-0 w-40 sm:w-48 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm text-left hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      {med.item_image && (
                        <img
                          src={med.item_image}
                          alt={med.item_name}
                          className="w-full h-24 sm:h-28 object-contain bg-gray-50 p-2"
                          loading="lazy"
                        />
                      )}
                      <div className="px-2.5 py-2 space-y-0.5">
                        <p className="text-xs font-semibold text-gray-800 truncate">{med.item_name}</p>
                        {med.entp_name && <p className="text-[11px] text-gray-400 truncate">{med.entp_name}</p>}
                        {med.class_name && (
                          <span className="inline-block text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full">{med.class_name}</span>
                        )}
                        {med.efcy && <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{med.efcy}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}

        {/* 봇 타이핑 인디케이터 */}
        {botTyping && (
          <div className="flex justify-start items-end gap-2" aria-live="polite" aria-label="봇이 입력 중입니다">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs flex-shrink-0" aria-hidden="true">
              AI
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* 입력창 */}
      <footer className="px-3 py-2 sm:px-4 sm:py-3 bg-white border-t">
        <div className="flex gap-2 items-center max-w-3xl mx-auto">
          <label htmlFor="chat-input" className="sr-only">메시지 입력</label>
          <input
            id="chat-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={connected ? '약 모양, 색상, 이름을 입력하세요...' : '연결 중...'}
            disabled={!connected}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full border border-gray-200 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50 disabled:text-gray-400 transition"
          />
          <button
            onClick={handleSend}
            disabled={!connected || !input.trim()}
            aria-label="메시지 보내기"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center disabled:opacity-40 hover:bg-indigo-600 active:scale-95 transition-all flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  )
}
