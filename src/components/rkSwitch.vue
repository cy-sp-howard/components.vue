<script lang="ts" setup>
import { computed } from 'vue'
import _ from 'lodash'

const emit = defineEmits<{ (e: 'update:modelValue', value: unknown): void }>()
const props = defineProps<{
  modelValue?: unknown
  leftValue?: unknown
  rightValue?: unknown
}>()

const valAry = computed(() => [
  _.isUndefined(props.leftValue) ? 0 : props.leftValue,
  _.isUndefined(props.rightValue) ? 0 : props.rightValue,
])

const currentStatus = computed(() => {
  return _.findIndex(valAry.value, i => i === props.modelValue) || 0
})

function handleClick() {
  emit('update:modelValue', +!currentStatus.value)
}
</script>
<template lang="pug">
.rk-switch(:class="{active:currentStatus}" @click="handleClick")
</template>
<style lang="sass" scoped>
.rk-switch
  display: inline-block
  border-radius: 100px
  height: var(--rk-form-item-height)
  line-height: var(--rk-form-item-height)
  width: calc(var(--rk-form-item-height) * 2)
  color: #0003
  background: currentColor
  padding: 1px
  transition: color 0.2s
  cursor: pointer
  &::before
    content: ''
    display: block
    width: calc(var(--rk-form-item-height) - 2px)
    height: 100%
    border-radius: 50%
    background: var(--bg)
    transition: transform 0.2s
  &.active
    color: var(--color-1)
    &::before
      transform: translateX(100%)
      left: 1px
      position: relative
</style>
