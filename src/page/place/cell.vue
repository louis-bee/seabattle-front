<script setup lang="ts">
import type { PlaceCell } from '@/type/chess'

const props = defineProps<{
  cellData: PlaceCell
}>()
const emits = defineEmits(['enter', 'leave', 'place'])

const onEnter = () => {
  emits('enter', props.cellData)
}
const onHover = () => {
}
const onLeave = () => {
  emits('leave')
}
const onPlace = () => {
  emits('place', props.cellData)
}

</script>

<template>
  <div
    class="w-10% h-10% b-solid b-1 b-black flex justify-center items-center relative"
    :class="{
      'bg-bluegray':props.cellData.status==='empty',
      'bg-#a78e8e': props.cellData.status==='hovernear',
      'bg-gray-5': props.cellData.status==='hover',
      'bg-white': props.cellData.status==='occupy',
      'bg-red-9': props.cellData.status==='hoverintersect'
    }"
    @dragenter.prevent="onEnter"
    @dragover.prevent="onHover"
    @dragleave.prevent="onLeave"
    @drop.prevent="onPlace"
  />
</template>

<style lang="scss" scoped>
</style>
