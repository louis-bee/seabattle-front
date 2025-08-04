<script setup lang="ts">
import { computed } from 'vue'
import Dialog from '@/components/dialog.vue'
import type { EndGameData } from '@/api/websocket'

const props = defineProps<{
  show?: boolean
  data: EndGameData
}>()

const titleText = computed(() => {
  switch (props.data.message) {
    case 'fair': return '平局'
    case 'lose': return '全军覆没'
    case 'win': return '胜利'
    default: return ''
  }
})

const $emits = defineEmits(['quit'])

</script>

<template>
  <Dialog :model-value="true">
    <!-- 这里放任何内容，完全由你决定样式 -->
    <div class="w-300px h-150px flex flex-col items-center bg-#fff p-20px rd-8px">
      <h2 class="mt-15px font-600">
        {{ titleText }}
      </h2>
      <button
        class="mt-30px w-80px h-30px"
        @click="$emits('quit')"
      >
        退出
      </button>
    </div>
  </Dialog>
</template>

<style scoped lang="scss"></style>
