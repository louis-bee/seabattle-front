<script setup lang="ts">
import Cell from './cell.vue'
import { usePlaceHook } from '@/logic/place'

const {
  boatNum,
  boardListData,
  dragStart,
  dragging,
  dragEnd,
  handleEnterCell,
  handleLeaveCell,
  handlePlaceCell,
  handleClick,
} = usePlaceHook()

</script>

<template>
  <div class="flex mt-50px">
    <div class="w-250px flex flex-col gap-20px">
      <div
        v-if="boatNum.one"
        class="flex gap-5px"
      >
        <div
          id="one"
          draggable="true"
          class="w-50px h-50px bg-amber"
          @click="handleClick"
          @dragstart="dragStart"
          @drag="dragging"
          @dragend="dragEnd"
        />
        <span>x{{ boatNum.one }}</span>
      </div>
      <div
        v-if="boatNum.two"
        class="flex gap-5px"
      >
        <div
          id="two"
          draggable="true"
          class="w-100px h-50px bg-amber"
          @click="handleClick"
          @dragstart="dragStart"
          @drag="dragging"
          @dragend="dragEnd"
        />
        <span>x{{ boatNum.two }}</span>
      </div>
      <div
        v-if="boatNum.three"
        class="flex gap-5px"
      >
        <div
          id="three"
          draggable="true"
          class="w-150px h-50px bg-amber"
          @click="handleClick"
          @dragstart="dragStart"
          @drag="dragging"
          @dragend="dragEnd"
        />
        <span>x{{ boatNum.three }}</span>
      </div>
      <div
        v-if="boatNum.four"
        class="flex gap-5px"
      >
        <div
          id="four"
          draggable="true"
          class="w-200px h-50px bg-amber"
          @click="handleClick"
          @dragstart="dragStart"
          @drag="dragging"
          @dragend="dragEnd"
        />
        <span>x{{ boatNum.four }}</span>
      </div>
      <div class="h-200px h-150px h-100px opacity-0" />
    </div>
    <div class="flex flex-wrap w-500px h-500px bg-bluegray">
      <Cell
        v-for="item, index in boardListData"
        :key="index"
        :cell-data="item"
        @enter="handleEnterCell"
        @leave="handleLeaveCell"
        @place="handlePlaceCell"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
