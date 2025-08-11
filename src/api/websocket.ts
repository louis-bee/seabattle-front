import type { BoardData } from '@/type/chess'
import { getUserId, getUserName } from '@/utils/userInfo'
import type { ReceiveMessage, SendMessage } from '@/type/message'

interface UseWSParam {
  userId: string
  userName?: string
}

export interface EndGameData {
  message: 'fair' | 'win' | 'lose'
}

export interface FireRes {
  newBoard: BoardData
  message: string
}

type WebSocketInstance = ReturnType<typeof createWebSocket>

let webSocketInstance: WebSocketInstance

function createWebSocket(params: UseWSParam) {
  const socket = new WebSocket(`ws://${import.meta.env.VITE_WS_ADDRESS}/game?userName=${params.userName || ''}&userId=${params.userId}`)

  socket.onopen = () => {
    console.log('client: connect success')
  }

  socket.onmessage = handleMessage
  function handleMessage({ data }: MessageEvent) {
    const message: ReceiveMessage = JSON.parse(data.toString())
    const type = message.type

    switch (true) {
      case type.startsWith('connect'): {
        const handleConnectMessage = new CustomEvent<ReceiveMessage>('connect', {
          detail: message,
        })
        window.dispatchEvent(handleConnectMessage)
        break
      }

      case type.startsWith('match'): {
        const handleMatchMessage = new CustomEvent('match', {
          detail: message,
        })
        window.dispatchEvent(handleMatchMessage)
        break
      }

      case type.startsWith('place'): {
        const handlePlaceMessage = new CustomEvent('place', {
          detail: message,
        })
        window.dispatchEvent(handlePlaceMessage)
        console.log(message.data.message)
        break
      }

      case type.startsWith('battle'): {
        const handleBattleMessage = new CustomEvent('battle', {
          detail: message,
        })
        window.dispatchEvent(handleBattleMessage)
        console.log(message.data.message)
        break
      }

      case type.startsWith('info'): {
        console.log(message.data.message)
        break
      }
    }
  }

  socket.onclose = () => {
    console.log('Websocket close')
  }

  function sendMessage(message: SendMessage) {
    const rawData = JSON.stringify(message)
    socket.send(rawData)
  }

  function getWsStatus() {
    return socket.readyState
  }

  return {
    sendMessage,
    getWsStatus,
  }
}

export default function useWebSocket(): WebSocketInstance {
  const userId = getUserId()
  const userName = getUserName()
  if (webSocketInstance) {
    return webSocketInstance
  } else {
    webSocketInstance = createWebSocket({ userId, userName })
    return webSocketInstance
  }
}
