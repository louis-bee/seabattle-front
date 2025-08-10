<script setup lang="ts">
import { ref } from 'vue'
import useWebSocket from '@/api/websocket'

const { sendMessage } = useWebSocket()

const nameInp = ref(localStorage.getItem('userName') || '')

const begin = () => {
  if (nameInp.value === '') {
    console.log('请输入昵称')
  }
  localStorage.setItem('userName', nameInp.value)
  sendMessage({ type: 'match:init', data: {
    userName: nameInp.value,
  } })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-100vh">
    <h1 class="font-600 text-36px">
      海 战 棋
    </h1>
    <input
      v-model="nameInp"
      class="mt-12px px-5px text-14px text-center h-32px w-220px b b-solid b-b-blueGray"
      placeholder="输入昵称"
      placeholder-class="placeholderStyle"
    >
    <button
      class="cursor-pointer mt-20px h-36px w-100px"
      @click="begin"
    >
      开始
    </button>
  </div>
  <div class="icp">
    <a
      href="https://beian.miit.gov.cn/"
      target="_blank"
    >粤ICP备2025414122号-1</a>
  </div>
</template>

<style lang="scss" scoped>
.placeholderStyle {
  padding: auto 6px;
}

.icp {
    position: fixed;
    bottom: 5vh;
    left: 50%;
    transform: translateX(-50%);
    a {
      color: #333;
      text-decoration: none;
      font-size: 12px;
      &:hover {
        opacity: 0.5;
      }
      &:active {
        opacity: 0.2;
      }
    }
  }
</style>
