<script setup lang="ts">
import { RouterView } from 'vue-router'
import useMatchController from '@/logic/match'
import useInfoController from '@/logic/info'

const { matchController } = useMatchController()
matchController()

const { infoController } = useInfoController()
infoController()
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
