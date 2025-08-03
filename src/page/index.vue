<script setup lang="ts">
import { useRouter } from 'vue-router'
const $router = useRouter()

const begin = () => {
  $router.push('/fight')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-100vh">
    <h1 class="font-600 text-36px">
      海 战 棋
    </h1>
    <button
      class="cursor-pointer mt-20px h-36px w-100px"
      @click="begin"
    >
      开始
    </button>
  </div>
</template>

<style lang="scss" scoped>
</style>
