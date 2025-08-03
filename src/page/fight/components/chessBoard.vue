<script setup lang="ts">
import { computed } from 'vue'
import Cell from './cell.vue'
import type { Address, CellData, BoardData } from '@/type/chess'

const props = defineProps<{
  data: BoardData
  address: Address
  isMyBoard?: boolean
}>()

const boardListData = computed(() => {
  return props.data.board.flat() || []
})

const onClickCell = (item: CellData) => {
  if (props.isMyBoard) return
  props.address.x = item.address.x
  props.address.y = item.address.y
}

</script>

<template>
  <div class="flex gap-10px">
    <div
      :class="{'order-2': !props.isMyBoard}"
      class="w-100px"
    >
      <h3 class="font-600 text-22px mt-10px">
        存活军舰
      </h3>
      <li class="font-600 text-16px mt-10px">
        总数: {{ props.data.aliveNum.total }}
      </li>
      <li class="mt-5px">
        战列舰: {{ props.data.aliveNum.four }}
      </li>
      <li>巡洋舰: {{ props.data.aliveNum.three }}</li>
      <li>驱逐舰: {{ props.data.aliveNum.two }}</li>
      <li>护卫舰: {{ props.data.aliveNum.one }}</li>
    </div>
    <div>
      <div class="flex flex-wrap w-500px h-500px bg-bluegray">
        <Cell
          v-for="item, index in boardListData"
          :key="index"
          :cell-data="item"
          :chosen-address="props.address"
          :is-my-board="props.isMyBoard"
          @click="onClickCell(item)"
        />
      </div>
      <h4 class="text-center font-500 text-18px mt-8px">
        {{ `${props.isMyBoard?'我方海域':'敌方海域'}` }}
      </h4>
    </div>
  </div>
</template>

<style scoped>
</style>
