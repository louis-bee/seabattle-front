<script setup lang="ts">
import { useWebSocket } from '@/api/websocket'
import { useRouter } from 'vue-router'
const $router = useRouter()

const begin = () => {
  $router.push('/fight')
}

const test = async () => {
  const data = await fetch('http://127.0.0.1:3000/test')
  const result = await data.text()
  console.log(result)
}

let ws: ReturnType<typeof useWebSocket> | undefined = undefined
const testGameSocket = () => {
  ws = useWebSocket()
}

const testSend = () => {
  if (ws) {
    ws.send({ type: 'info', data: { message: 'hallo,i am user' } })
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-100vh">
    <h2 @click="begin">
      开始
    </h2>
    <button @click="test">
      test
    </button>
    <button @click="testGameSocket">
      testGameSocket
    </button>
    <button @click="testSend">
      testSend
    </button>
  </div>
</template>

<style lang="scss" scoped>
</style>
