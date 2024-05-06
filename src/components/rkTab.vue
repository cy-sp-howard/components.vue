<script lang="ts" setup>
const emit = defineEmits<(e: 'update:modelValue', val: unknown) => void>()
defineProps<{ modelValue: unknown; opts: { label?: number | string; value: unknown }[] }>()

function clickHandler(val: unknown) {
  emit('update:modelValue', val)
}
</script>
<template lang="pug">
.rk-tab
  span(v-for="(i,index) in opts" :key="index" :class="{active: modelValue === i.value}" @click="clickHandler(i.value)") {{ i.label || i.value }}
</template>
<style lang="sass" scoped>
.rk-tab
  display: grid
  grid-auto-flow: column
  gap: 15px
  white-space: nowrap
  font-size: 13px
  line-height: 35px
  height: 40px
  border-bottom: 1px solid var(--border-color)
  text-align: center
  > span
    transition: border-color 0.2s
    border-bottom: 3px solid transparent
    opacity: 0.6
    cursor: pointer
    &.active
      opacity: 1
      border-color: var(--color-1)
      pointer-events: none
    &:hover
      opacity: 1
</style>
