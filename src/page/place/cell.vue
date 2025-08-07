<script setup lang="ts">
import { ref } from 'vue'
import type { CellData } from '@/type/chess'

const props = defineProps<{
  cellData: CellData
}>()
const emits = defineEmits(['place'])

const dragHover = ref(false)
const onEnter = () => {
  dragHover.value = true
}
const onLeave = () => {
  dragHover.value = false
}
const onPlace = (event) => {
  console.log(event)
  emits('place', props.cellData)
  const id = event.dataTransfer.getData('id')
  const origin = document.querySelector(`#${id}`)
  event.target.appendChild(origin)

  // target.appendChild(document.getElementById(drag_id))
}

</script>

<template>
  <div
    class="w-10% h-10% bg-bluegray b-solid b-1 b-black flex justify-center items-center relative"
    :class="{
      'bg-gray-5': dragHover
    }"
    @dragenter.prevent="onEnter"
    @dragover.prevent=""
    @dragleave.prevent="onLeave"
    @drop="onPlace"
  />
</template>

<style lang="scss" scoped>
</style>
