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

export function useWebSocket() {
  const socket = new WebSocket('ws://localhost:3000/game')

  socket.onopen = () => {
    sendMessage(socket, { type: 'info', data: { message: '连接成功' } })
  }

  socket.onmessage = ({ data }) => {
    console.log(JSON.parse(data.toString()))
  }
  console.log(socket)

  function send(message: SendMessage) {
    sendMessage(socket, message)
  }

  return {
    send,
  }
}

function sendMessage(ws: WebSocket, message: SendMessage) {
  const rawData = JSON.stringify(message)
  ws.send(rawData)
}
