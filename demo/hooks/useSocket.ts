'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'

interface Message {
  user: string
  message: string
  timestamp: Date
}

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) return

    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL!)

    socketInstance.on('connect', () => {
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    socketInstance.on('message', (data: Message) => {
      setMessages(prev => [...prev, data])
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [session])

  const sendMessage = (message: string) => {
    if (socket && session?.user?.name) {
      const messageData = {
        user: session.user.name,
        message,
        timestamp: new Date()
      }
      socket.emit('message', messageData)
    }
  }

  return {
    socket,
    isConnected,
    messages,
    sendMessage
  }
}
