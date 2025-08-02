<script setup lang="ts">
import { computed } from 'vue'
import Cell from './cell.vue'
import type { Address, CellData, BoardData } from '@/type/chess'

const props = defineProps<{
  data: BoardData
  address: Address
}>()

const boardListData = computed(() => {
  return props.data.flat() || []
})

const onClickCell = (item: CellData) => {
  props.address.x = item.address.x
  props.address.y = item.address.y
}

</script>

<template>
  <div class="flex flex-wrap w-500px h-500px bg-bluegray">
    <Cell
      v-for="item, index in boardListData"
      :key="index"
      :cell-data="item"
      :chosen-address="props.address"
      @click="onClickCell(item)"
    />
  </div>
</template>

<style scoped>
</style>
