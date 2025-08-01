<script setup lang="ts">
import { computed, ref } from 'vue'
import Cell from './cell.vue'
import type { BoardRow, Address, CellData } from '@/type/chess'

const boardData = ref<BoardRow[]>(
  Array.from({ length: 10 }, (v1, row) =>
    Array.from({ length: 10 }, (v2, col) => ({ status: 'unshoot', address: { x: col, y: row } })),
  ),
)

const boardListData = computed(() => {
  return boardData.value.flat()
})
const chosenAddress = ref<Address>({ x: -1, y: -1 })

const onClickCell = (item: CellData) => {
  chosenAddress.value = item.address
}

const fire = () => {
  // send
  const newData: BoardRow[] = Array.from({ length: 10 }, (v1, row) =>
    Array.from({ length: 10 }, (v2, col) => ({ status: 'unshoot', address: { x: col, y: row } })))
  newData[chosenAddress.value.y][chosenAddress.value.x].status = 'miss'
  const res = {
    type: 'fire-resp',
    message: '击中了',
    address: {
      x: chosenAddress.value.x,
      y: chosenAddress.value.y,
    },
    data: newData,
  }
  boardData.value = res.data
  chosenAddress.value = { x: -1, y: -1 }
  console.log(res.message)
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
  <button @click="fire">
    确定
  </button>
</template>

<style scoped>
</style>
