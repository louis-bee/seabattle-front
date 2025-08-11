<script setup lang="ts">
import { computed } from 'vue'
import Dialog from '@/components/dialog.vue'
import { useRouter } from 'vue-router'
import type { EndGameData } from '@/api/websocket'

const $router = useRouter()

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

const handleQuit = () => {
  $router.replace({ name: 'Home' })
}

</script>

<template>
  <Dialog :model-value="true">
    <div class="w-300px h-150px flex flex-col items-center bg-#fff p-20px rd-8px">
      <h2 class="mt-15px font-600">
        {{ titleText }}
      </h2>
      <button
        class="mt-30px w-80px h-30px"
        @click="handleQuit"
      >
        退出
      </button>
    </div>
  </Dialog>
</template>

<style scoped lang="scss"></style>
