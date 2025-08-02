<script setup lang="ts">
import { computed, ref } from 'vue'
import Cell from './cell.vue'
import type { Address, CellData, BoardData } from '@/type/chess'
import _ from 'lodash'
import { useWebSocket, type FireRes } from '@/api/websocket'

const props = defineProps<{
  data: BoardData
}>()

const boardData = ref<BoardData>(_.cloneDeep(props.data) || [])

const boardListData = computed(() => {
  return boardData.value.flat() || []
})
const chosenAddress = ref<Address>({ x: -1, y: -1 })

const onClickCell = (item: CellData) => {
  chosenAddress.value = item.address
}

const ws = useWebSocket()

const waiting = ref(false)

const onEnemyFireResp = (res: FireRes) => {
  // boardData.value = res.newBoard
  console.log('对方射击的结果:', res)
}

const onMyFireResp = (res: FireRes) => {
  console.log('对方射击的结果:', res)
  const { newBoard, message } = res as FireRes
  console.log(message)
  boardData.value = newBoard
}

const shotting = ref(false)

const fireDisabled = computed(() => {
  return shotting.value || waiting.value
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
</script>

<template>
  <div class="flex flex-wrap w-500px h-500px bg-bluegray">
    <Cell
      v-for="item, index in boardListData"
      :key="index"
      :cell-data="item"
      :chosen-address="chosenAddress"
      @click="onClickCell(item)"
    />
  </div>
  <button
    :disabled="fireDisabled"
    @click="fire"
  >
    确定
  </button>
</template>

<style scoped>
</style>
