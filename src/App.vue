<script setup lang="ts">
import { RouterView } from 'vue-router'
import useReconnect from '@/logic/reconnect'

const { controller } = useReconnect()
controller()
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
