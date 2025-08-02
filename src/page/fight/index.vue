<script setup lang="ts">
import { useWebSocket } from '@/api/websocket'
import ChessBoard from './components/chessBoard.vue'
import { ref } from 'vue'
import type { BoardData } from '@/type/chess'

const ws = useWebSocket()

ws.onMatch((data) => {
  boardData.value = data
})

const boardData = ref<BoardData>()

</script>

<template>
  <div class="flex flex-col items-center justify-center h-100vh">
    <h2
      v-if="!boardData"
    >
      正在匹配对手。。
    </h2>
    <ChessBoard
      v-else
      :data="boardData"
    />
  </div>
</template>

<style scoped>
</style>
