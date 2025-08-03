<script setup lang="ts">
// 受控：父组件用 v-model 控制显隐
defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [v: boolean] }>()
</script>

<template>
  <!-- 1. 脱离父级 DOM，永远挂在 body 下 -->
  <Teleport to="body">
    <!-- 2. 半透明遮罩，占满视口，flex 垂直水平居中 -->
    <div
      v-if="modelValue"
      class="fixed inset-0 flex items-center justify-center bg-black/45 z-9999"
      @click.self="$emit('update:modelValue', false)"
    >
      <!-- 3. 插槽：完全没样式，由调用方决定内容 -->
      <slot />
    </div>
  </Teleport>
</template>
