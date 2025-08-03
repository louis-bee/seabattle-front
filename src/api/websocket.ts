import type { Address, BoardData } from '@/type/chess'

export interface ReceiveMessage {
  type: 'match' | 'fireRes' | 'fire' | 'quit' | 'info'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}

export interface SendMessage {
  type: 'fire' | 'quit' | 'info'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
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
let onMatchCallback: Callback | undefined = undefined
let onQuitCallback: Callback | undefined = undefined

const promiseMap = new Map<callType, PromiseEntry>()

export function useWebSocket(quitCallback?: Callback) {
  if (!socket) {
    socket = new WebSocket('ws://localhost:3000/game')
  }

  if (quitCallback) onQuitCallback = quitCallback

  socket.onopen = () => {
    console.log('client: connect success')
  }

  socket.onmessage = handleMessage

  function onMatch(callback: Callback) {
    onMatchCallback = callback
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
        if (onMatchCallback) {
          onMatchCallback(boardData)
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
      case 'quit': {
        console.log('服务器要求关闭连接')
        quit()
        if (onQuitCallback) onQuitCallback()
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
