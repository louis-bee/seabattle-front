<script setup lang="ts">
import { useWebSocket, type FireRes } from '@/api/websocket'
import ChessBoard from './components/chessBoard.vue'
import { ref, computed } from 'vue'
import type { BoardData, Address } from '@/type/chess'

interface MatchBoardData {
  myBoard: BoardData
  enemyBoard: BoardData
}
const matching = ref(true)
const myBoardData = ref<BoardData>()

const enemyBoardData = ref<BoardData>()

const ws = useWebSocket()
ws.onMatch((data: MatchBoardData) => {
  myBoardData.value = data.myBoard
  enemyBoardData.value = data.enemyBoard
  matching.value = false
})

const waiting = ref(false)

const onEnemyFireResp = (res: FireRes) => {
  console.log('对方射击的结果:', res)
  const { newBoard, message } = res as FireRes
  console.log(message)
  myBoardData.value = newBoard
}

const onMyFireResp = (res: FireRes) => {
  console.log('我方射击的结果:', res)
  const { newBoard, message } = res as FireRes
  console.log(message)
  enemyBoardData.value = newBoard
}

const shotting = ref(false)

const fireDisabled = computed(() => {
  return shotting.value || waiting.value
})

const chosenAddress = ref<Address>({ x: -1, y: -1 })

const fire = async () => {
  if (chosenAddress.value.x < 0 || chosenAddress.value.y < 0 || chosenAddress.value.x >= 10 || chosenAddress.value.y >= 10) return
  shotting.value = true
  waiting.value = true

  const myShot = ws.fire(chosenAddress.value)
  const enemyShot = ws.wait()
  const [myRes, enemyRes] = await Promise.all([myShot, enemyShot])

  onEnemyFireResp(enemyRes as FireRes)
  onMyFireResp(myRes as FireRes)
  chosenAddress.value = { x: -1, y: -1 }
  shotting.value = false
  waiting.value = false
}

const myAddress = ref<Address>({ x: -1, y: -1 })

</script>

<template>
  <div class="flex items-center justify-center h-100vh">
    <h2
      v-if="matching"
    >
      正在匹配对手。。
    </h2>
    <div
      v-else
      class="flex"
    >
      <ChessBoard
        v-if="myBoardData"
        :data="myBoardData"
        :address="myAddress"
        :is-my-board="true"
      />
      <div class="w-150px flex items-center justify-center">
        <button
          class="w-70px h-40px"
          :disabled="fireDisabled"
          @click="fire"
        >
          开炮
        </button>
      </div>
      <ChessBoard
        v-if="enemyBoardData"
        :data="enemyBoardData"
        :address="chosenAddress"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
