import type { ReceiveMessage, EventListener } from '@/type/message'
import { useRouter } from 'vue-router'

import useWebSocket from '@/api/websocket'
import { setEnemyInfo } from '@/utils/userInfo'

export default function useReconnect() {
  const $router = useRouter()

  useWebSocket()
  window.addEventListener('match', ((e: CustomEvent<ReceiveMessage>) => {
    handleMessage(e.detail)
  }) as EventListener)

  function handleMessage(message: ReceiveMessage) {
    const type = message.type
    switch (type) {
      case 'match:success': {
        setEnemyInfo(message.data.enemyInfo)
        $router.replace({ name: 'placePage' })
        break
      }
      case 'match:wait': {
        console.log(message.data.message)
        $router.replace({ name: 'matchPage' })
        break
      }
      case 'match:reconnect-unmatch': {
        console.log(message.data.message)
        $router.replace({ name: 'Home' })
        break
      }
      case 'match:reconnect-placing': {
        setEnemyInfo(message.data.enemyInfo)
        $router.replace({ name: 'placePage' })
        break
      }
      case 'match:reconnect-placed': {
        setEnemyInfo(message.data.enemyInfo)
        sessionStorage.setItem('placeBoardData', JSON.stringify(message.data.placeBoardData))
        $router.replace({ name: 'placePage' })
        break
      }
      case 'match:reconnect-firing': {
        // 未开炮
        $router.replace({ name: 'fightPage' })
        break
      }
      case 'match:reconnect-fired': {
        // 已开炮
        $router.replace({ name: 'fightPage' })
        break
      }
    }
  }

  function controller() {
    console.log('自动重连启动')
  }

  return {
    controller,
  }
}
