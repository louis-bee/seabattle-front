<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Cell from './cell.vue'
import type { Board, CellData } from '@/type/chess'
const SIZE = 10
const board: Board = Array.from({ length: SIZE }, (v1, row) =>
  Array.from({ length: SIZE }, (v2, col) => ({ status: 'unshoot', address: { x: col, y: row }, hasBoat: 0 })),
)

const boardListData = computed(() => {
  return board.flat() || []
})

const oneRef = ref(null)
onMounted(() => {
  console.log(oneRef.value)
})

const startDrag = (event) => {
  console.log(event)
  const target = event.target
  event.dataTransfer.setData('id', target.id)
  document.body.style.cursor = 'move'
}

const endDrag = () => {
  // console.log(e)
  document.body.style.cursor = 'default'
}

const onPlace = (cell: CellData) => {

}

</script>

<template>
  <div class="flex mt-50px">
    <div class="w-500px">
      <div
        id="one"
        draggable="true"
        class="w-50px h-50px bg-amber"
        @dragstart="startDrag"
        @dragend="endDrag"
      />
    </div>
    <div class="flex flex-wrap w-500px h-500px bg-bluegray">
      <Cell
        v-for="item, index in boardListData"
        :key="index"
        :cell-data="item"
        @place="onPlace"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
