<script setup lang="ts">
import ChessBoard from './components/chessBoard.vue'

const socket = new WebSocket('ws://localhost:3000/basic')

socket.onopen = () => {
  socket.send('你好')
}

socket.onmessage = ({ data }) => {
  console.log(data)
}
console.log(socket)

</script>

<template>
  <div class="flex flex-col items-center justify-center h-100vh">
    <ChessBoard />
  </div>
</template>

<style scoped>
</style>
