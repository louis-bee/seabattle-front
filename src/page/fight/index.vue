<script setup lang="ts">
import { useWebSocket, type EndGameData, type FireRes } from '@/api/websocket'
import ChessBoard from './components/chessBoard.vue'
import { ref, computed } from 'vue'
import type { Address, BoardData } from '@/type/chess'
import { onBeforeRouteLeave, useRouter, useRoute } from 'vue-router'
import EndDialog from './components/endDialog.vue'

interface MatchBoardData {
  enemyName: string
  myBoard: BoardData
  enemyBoard: BoardData
}

const $route = useRoute()
const $router = useRouter()

if (!$route.query.userName) {
  $router.back()
}

const userName = ref({
  myName: $route.query.userName as string,
  enemyName: '',
})

const matching = ref(true)
const myBoardData = ref<BoardData>()

const enemyBoardData = ref<BoardData>()

const ws = useWebSocket(
  {
    userName: userName.value.myName,
    quitCallback: () => {
      alert('对方退出了游戏')
      $router.push('/')
    },
    endGameCallback: (data: EndGameData) => {
      endGameData.value = data
      showEndDialog.value = true
    },
  })

ws.onMatch((data: MatchBoardData) => {
  userName.value.enemyName = data.enemyName
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
  return shotting.value || waiting.value || repeatAddress.value
})

const chosenAddress = ref<Address>({ x: -1, y: -1 })

const repeatAddress = computed(() => {
  const { x, y } = chosenAddress.value
  if (x < 0 || x >= 10 || y < 0 || y >= 10) return false
  return enemyBoardData.value?.board[y][x].status !== 'unshoot'
})

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

const onQuit = () => {
  ws.quit()
  $router.push('/')
}

const showEndDialog = ref(false)

// const dailogTitle = computed(() => {
//   const lose = myBoardData.value?.aliveNum.total === 0
//   const win = enemyBoardData.value?.aliveNum.total === 0
//   if (lose && win) return '平局'
//   if (lose) return '全军覆没'
//   if (win) return '胜利'
//   else return ''
// })

const endGameData = ref<EndGameData>()

onBeforeRouteLeave(() => {
  ws.quit()
})

</script>

<template>
  <div class="flex items-center justify-around h-100vh overflow-auto">
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
        :user-name="userName.myName"
        :is-my-board="true"
        :is-waiting="waiting"
      />
      <div class="w-150px flex flex-col items-center justify-center">
        <button
          class="w-70px h-40px"
          :disabled="fireDisabled"
          @click="fire"
        >
          开炮
        </button>
        <span
          class="mt-10px"
          :class="{'opacity-0': !waiting}"
        >等待对方开炮 . . .</span>
      </div>
      <ChessBoard
        v-if="enemyBoardData"
        :data="enemyBoardData"
        :address="chosenAddress"
        :user-name="userName.enemyName"
        :is-waiting="waiting"
        @quit="onQuit"
      />
    </div>
  </div>
  <EndDialog
    v-if="showEndDialog"
    :data="endGameData!"
    @quit="onQuit"
  />
</template>

<style scoped>
</style>
