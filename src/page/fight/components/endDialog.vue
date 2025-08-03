<script setup lang="ts">
import { defineProps } from 'vue'
import Dialog from '@/components/dialog.vue'

const props = defineProps<{
  show?: boolean
  title: string
}>()

const $emits = defineEmits(['quit'])

</script>

<template>
  <Dialog :model-value="true">
    <!-- 这里放任何内容，完全由你决定样式 -->
    <div class="w-300px h-150px flex flex-col items-center bg-#fff p-20px rd-8px">
      <h2 class="mt-15px font-600">
        {{ props.title }}
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
