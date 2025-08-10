<script setup lang="ts">
import type { ReceiveMessage } from '@/type/message'
import { RouterView, useRouter } from 'vue-router'

import useWebSocket from '@/api/websocket'

const $router = useRouter()

type EventListener = (event: Event) => void

useWebSocket()

window.addEventListener('match', ((e: CustomEvent<ReceiveMessage>) => {
  handleMessage(e.detail)
}) as EventListener)

function handleMessage(message: ReceiveMessage) {
  const type = message.type
  switch (type) {
    case 'match:success': {
      $router.replace({ name: 'placePage' })
      break
    }
    case 'match:wait': {
      console.log(message.data.message)
      $router.replace({ name: 'matchPage' })
      break
    }
    case 'match:reconnect-placing': {
      $router.replace({ name: 'placePage' })
      break
    }
    case 'match:reconnect-placed': {
      break
    }
    case 'match:reconnect-firing': {
      break
    }
    case 'match:reconnect-fired': {
      break
    }
  }
}
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
