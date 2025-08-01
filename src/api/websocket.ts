export function useWebSocket() {
  const socket = new WebSocket('ws://localhost:3000/basic')

  socket.onopen = () => {
    socket.send('你好')
  }

  socket.onmessage = ({ data }) => {
    console.log(data)
  }
  console.log(socket)

  return {
  }
}
