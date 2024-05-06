<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    loading?: number | boolean
    disabled?: number | boolean
    color?: 'error' | 'success' | 'normal' | 'hollow'
    submit?: boolean
  }>(),
  { color: 'normal', loading: 0, disabled: false, submit: false },
)
const emit = defineEmits<{ (e: 'click', value: MouseEvent): void }>()

function clickHandler(evt: MouseEvent) {
  if (props.loading || props.disabled) return
  emit('click', evt)
}
</script>
<template lang="pug">
.rk-button(:class="{ loading,disabled,[color]:true }" @click="clickHandler")
  button(:disabled="disabled || loading" :type="submit?'submit':'button'")
    slot
  svg-icon(v-if="loading" icon="loading")
</template>
<style lang="sass" scoped>

.rk-button
  height: var(--rk-form-item-height)
  line-height: var(--rk-form-item-height)
  color: white
  font-size: 14px
  text-align: center
  display: inline-grid
  &:not(.loading):not(.disabled):hover
    filter: brightness(110%)
    &.hollow > button
      box-shadow: 0 0 0 1px var(--font-color)
  &.loading
    cursor: progress
    > svg
      animation: rotate 1s linear infinite
    > button
      color: transparent
      pointer-events: none
      > :deep(*)
        visibility: hidden
  &.disabled
    cursor: not-allowed
    > button
      opacity: var(--rk-disabled-opacity)
      pointer-events: none
  &.normal > button
    background: var(--color-1)
  &.success > button
    background: var(--color-2)
  &.error > button
    background: var(--color-3)
  &.hollow
    color: var(--font-color)
    > button
      background: transparent
      box-shadow: 0 0 0 1px var(--border-color)
  > svg
    grid-area: 1 / 1 / span 1 / span 1
    justify-self: center
    align-self: center
    pointer-events: none
  > button
    width: 100%
    height: 100%
    display: block
    color: inherit
    font-size: inherit
    cursor: pointer
    grid-area: 1 / 1 / span 1 / span 1
    border-radius: 5px
    padding: 0 12px
    &:active
      filter: brightness(0.8)
</style>
