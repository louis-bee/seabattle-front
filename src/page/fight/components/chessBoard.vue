<script setup lang="ts">
import { computed } from 'vue'
import Cell from './cell.vue'
import type { Address, CellData, BoardData } from '@/type/chess'

const props = defineProps<{
  data: BoardData
  address: Address
  isMyBoard?: boolean
  userName: string
}>()

const boardListData = computed(() => {
  return props.data.board.flat() || []
})

const onClickCell = (item: CellData) => {
  if (props.isMyBoard) return
  props.address.x = item.address.x
  props.address.y = item.address.y
}

const aliveNum = computed(() => {
  return props.data.aliveNum
})

</script>

<template>
  <div class="flex gap-18px">
    <div
      :class="{'order-2': !props.isMyBoard,'text-right': props.isMyBoard}"
      class="w-120px"
    >
      <div class="c-bluegray mt-10px font-600 text-28px ">
        {{ props.userName }}
      </div>
      <h3 class="font-600 text-22px mt-16px">
        存活军舰
      </h3>
      <li class="font-600 text-16px mt-10px">
        总数: {{ aliveNum.total }}
      </li>
      <li
        class="mt-5px"
        :class="{'line-through decoration-2 text-red-7': !aliveNum.four}"
      >
        战列舰: {{ aliveNum.four }}
      </li>
      <li :class="{'line-through decoration-2 text-red-7': !aliveNum.three}">
        巡洋舰: {{ aliveNum.three }}
      </li>
      <li :class="{'line-through decoration-2 text-red-7': !aliveNum.two}">
        驱逐舰: {{ aliveNum.two }}
      </li>
      <li :class="{'line-through decoration-2 text-red-7': !aliveNum.one}">
        护卫舰: {{ aliveNum.one }}
      </li>
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
