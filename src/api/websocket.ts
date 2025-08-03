import type { Address, BoardData } from '@/type/chess'

export interface UseWSParams {
  userName?: string
  endGameCallback?: Callback
  quitCallback?: Callback
}

export interface ReceiveMessage {
  type: 'match' | 'fireRes' | 'fire' | 'quit' | 'info' | 'endGame'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}

export interface SendMessage {
  type: 'fire' | 'quit' | 'info'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}

export interface EndGameData {
  message: 'fair' | 'win' | 'lose'
}

export interface FireRes {
  newBoard: BoardData
  message: string
}

type callType = 'fire' | 'wait'

interface PromiseEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (value?: any) => void
  reject: (reason?: string) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Callback = ((data?: any) => void)

let socket: WebSocket | undefined = undefined

const callbackMap = new Map<ReceiveMessage['type'], Callback>()
const promiseMap = new Map<callType, PromiseEntry>()

export function useWebSocket(params: UseWSParams) {
  if (!socket) {
    socket = new WebSocket(`ws://${import.meta.env.VITE_WS_ADDRESS}/game?userName=${params.userName}`)
  }

  if (params.quitCallback) callbackMap.set('quit', params.quitCallback)
  if (params.endGameCallback) callbackMap.set('endGame', params.endGameCallback)

  socket.onopen = () => {
    console.log('client: connect success')
  }

  socket.onmessage = handleMessage

  function onMatch(callback: Callback) {
    callbackMap.set('match', callback)
  }

  function fire(address: Address) {
    if (promiseMap.has('fire')) return
    return new Promise((resolve, reject) => {
      promiseMap.set('fire', { resolve, reject })
      send({ type: 'fire', data: { address } })
    })
  }

  function send(message: SendMessage) {
    if (socket) {
      sendMessage(socket, message)
    }
  }

  function wait() {
    return new Promise((resolve, reject) => {
      promiseMap.set('wait', { resolve, reject })
    })
  }

  function handleMessage({ data }: MessageEvent) {
    const message: ReceiveMessage = JSON.parse(data.toString())
    switch (message.type) {
      case 'info': {
        console.log(message.data.message)
        break
      }
      case 'match': {
        const boardData = message.data
        console.log('匹配成功，初始化棋盘：', boardData)
        // 触发onMatch
        if (callbackMap.has('match')) {
          const onMatchCallback = callbackMap.get('match')!
          onMatchCallback(boardData)
          callbackMap.delete('match')
        }
        break
      }
      case 'fire': {
        promiseMap.get('wait')?.resolve(message.data)
        promiseMap.delete('wait')
        break
      }
      case 'fireRes': {
        promiseMap.get('fire')?.resolve(message.data)
        promiseMap.delete('fire')
        break
      }
      case 'endGame': {
        if (callbackMap.has('endGame')) {
          const onEndGameCallback = callbackMap.get('endGame')!
          onEndGameCallback(message.data)
          callbackMap.delete('endGame')
        }
        break
      }
      case 'quit': {
        console.log('服务器要求关闭连接')
        quit()
        if (callbackMap.has('quit')) {
          const onQuitCallback = callbackMap.get('quit')!
          onQuitCallback()
          callbackMap.delete('quit')
        }
        break
      }
    }
  }

  function quit() {
    socket?.close()
    socket = undefined
  }

  return {
    send,
    fire,
    onMatch,
    quit,
    wait,
  }
}

function sendMessage(ws: WebSocket, message: SendMessage) {
  const rawData = JSON.stringify(message)
  ws.send(rawData)
}
