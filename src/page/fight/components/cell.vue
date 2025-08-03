<script setup lang="ts">
import { computed, defineProps } from 'vue'
import type { Address, CellData } from '@/type/chess'

const props = defineProps<{
  cellData: CellData
  chosenAddress: Address
  isMyBoard: boolean
}>()

const isChosen = computed(() => {
  const { x: chosenX, y: chosenY } = props.chosenAddress
  const { x, y } = props.cellData.address
  return chosenX === x && chosenY === y
})
</script>

<template>
  <div
    class="w-10% h-10% bg-bluegray b-solid b-1 b-black flex justify-center items-center"
  >
    <div
      v-if="isChosen"
      class="chosen"
    />
    <div
      v-if="props.cellData.status==='unshoot'"
      :class="{'bg-white': props.isMyBoard && props.cellData.hasBoat}"
      class="w-100% h-100%"
    />
    <div
      v-if="props.cellData.status==='miss'"
      class="miss"
    >
      miss
    </div>
    <div
      v-if="props.cellData.status==='goal'"
      :class="{'bg-white': props.cellData.hasBoat}"
      class="w-100% h-100% flex items-center justify-center"
    >
      <div class="goal">
        命中
      </div>
    </div>
    <div
      v-if="props.cellData.status==='down'"
      class="down"
    >
      击沉
    </div>
  </div>
</template>

<style lang="scss" scoped>
.miss {
  text-align: center;
  line-height: 38px;
  width: 80%;
  height: 80%;
  border-radius: 100%;
  background-color: rgba(0, 0, 0, 0.211);
}

.goal {
  text-align: center;
  line-height: 38px;
  width: 80%;
  height: 80%;
  border-radius: 100%;
  background-color: yellow;
}

.down {
  line-height: 50px;
  text-align: center;
  color: white;
  height: 100%;
  width: 100%;
  background-color: rgba(1, 1, 1, 0.673);
}

.chosen {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 100%;
  border: solid 1px rgb(26, 26, 26);
  background-color: transparent;
}
</style>
