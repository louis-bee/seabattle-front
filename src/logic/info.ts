import type { ReceiveMessage, EventListener } from '@/type/message'
// import { useRouter } from 'vue-router'

// import useWebSocket from '@/api/websocket'

export default function useInfoController() {
  // const $router = useRouter()

  // const { sendMessage } = useWebSocket()
  window.addEventListener('info', ((e: CustomEvent<ReceiveMessage>) => {
    handleMessage(e.detail)
  }) as EventListener)

  function handleMessage(message: ReceiveMessage) {
    const type = message.type
    switch (type) {
      // TODO 处理info信息
      // case 'info:disconnect': {
      //   const wait = confirm('对手已掉线，是否等待对方重连？')
      //   if (wait) return
      //   else {
      //     sendMessage({ type: 'info:disconnect' })
      //     $router.replace({ name: 'Home' })
      //   }
      //   break
      // }
      default: {
        console.log(message.data.message)
      }
    }
  }

  function infoController() {
    console.log('处理info进程')
  }

  return {
    infoController,
  }
}
