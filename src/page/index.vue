<script setup lang="ts">
import { useRouter } from 'vue-router'
const $router = useRouter()
const begin = () => {
  $router.push('/fight')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-100vh">
    <h2 @click="begin">
      开始
    </h2>
  </div>
</template>

<style lang="scss" scoped>
</style>
