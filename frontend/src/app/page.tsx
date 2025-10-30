'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useSocket } from '@/hooks/useSocket'
import { FileUpload } from '@/components/FileUpload'
import { useState } from 'react'

export default function Home() {
  const { data: session, status } = useSession()
  const { socket, isConnected, messages, sendMessage } = useSocket()
  const [message, setMessage] = useState('')

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message)
      setMessage('')
    }
  }

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Boilerplate App</h1>
      
      {!session ? (
        <div className="text-center">
          <p className="mb-4">Please sign in to continue</p>
          <button
            onClick={() => signIn('google')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="text-center">
            <p className="mb-4">Welcome, {session.user?.name}!</p>
            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign out
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">WebSocket Chat</h2>
              <div className="mb-4">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
              
              <div className="bg-white p-4 rounded mb-4 h-40 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div key={index} className="mb-2">
                    <span className="font-semibold">{msg.user}:</span> {msg.message}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Send
                </button>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">File Upload</h2>
              <FileUpload />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
