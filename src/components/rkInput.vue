<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import _ from 'lodash'

defineOptions({
  inheritAttrs: false,
})
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()
const props = defineProps<{
  modelValue?: unknown
  focus?: boolean
  disabled?: boolean | number
  label?: string
  textarea?: boolean
}>()
const instance = getCurrentInstance()

const input = ref<HTMLInputElement | null>(null)
const suffixRef = ref<HTMLElement | null>(null)
const suffixWidth = ref('15px')

const val = computed({
  get: () => props.modelValue,
  set: value => {
    if (props.disabled) return
    emit('update:modelValue', value as string)
  },
})
const className = computed(() => {
  return props.textarea ? 'rk-textarea' : 'rk-input'
})
const attrs = computed(() => {
  if (!instance || !instance.proxy) return
  const attrs = _.get(instance, 'proxy.$attrs', {})
  const input = _.pickBy(attrs, (i, k) => {
    const isCss = ['class', 'id', 'style'].includes(k)
    const isEvent = k.match(/^on[A-Z][a-z]*/)
    return !isCss && !isEvent
  })
  const div = _.chain(attrs).omit(_.keys(input)).value()
  return { div, input }
})
function getSuffixWidth() {
  if (suffixRef.value instanceof Element) {
    suffixWidth.value = `${suffixRef.value.offsetWidth}px`
  }
}

onMounted(() => {
  if (props.focus && input.value) {
    input.value.focus()
  }
  getSuffixWidth()
})
defineExpose({ input })
</script>
<template lang="pug">
label(v-bind="attrs.div" :class="className")
  textarea(v-if="textarea" ref="input" v-model="val" v-bind="attrs.input" :disabled="disabled")
  input(v-else ref="input" v-model="val" v-bind="attrs.input" :disabled="disabled")
  strong.label(v-if="label !== undefined || $slots.label") 
    slot(name="label" :label="label") {{ label }}
  span.suffix(v-if="$slots.suffix" ref="suffixRef")
    slot(name="suffix")
</template>
<style lang="sass" scoped>
.rk-input,.rk-textarea
  height: var(--rk-form-item-height)
  line-height: var(--rk-form-item-height)
  font-size: 14px
  color: var(--font-color)
  display: grid
  grid-auto-flow: column
  grid-template-columns: auto 1fr
  > .suffix
    grid-area: 1 / 2 / span 1 / span 1
    justify-self: flex-end
    display: flex
    padding: 0 10px
    justify-content: center
    align-items: center
    z-index: 1
  > .label
    font-size: 14px
    grid-area: 1 / 1 / span 1 / span 1
    padding-right: 10px
    text-align: right
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
  > input,> textarea
    display: block
    grid-area: 1 / 2 / span 1 / span 1
    background: var(--bg)
    height: 100%
    width: var(--rk-form-item-width)
    border-radius: 5px
    color: inherit
    font-size: inherit
    padding: 0 v-bind(suffixWidth) 0 15px
    border: 1px solid var(--border-color)
    &:hover,&:focus
      border-color: var(--color-1)
      + .label
        color: var(--color-1)
    &:disabled
      cursor: not-allowed
      opacity: var(--rk-disabled-opacity)
      ~ .suffix
        opacity: var(--rk-disabled-opacity)
.rk-textarea
  height: unset
  > textarea
    resize: none
    padding: 15px
</style>
