<script lang="ts" setup>
import { watch, onBeforeUnmount, computed, ref } from 'vue'

const props = defineProps<{
  modelValue: string
  folder: string
}>()
const emit = defineEmits<{ (e: 'update:modelValue', url: string): void }>()

const files = ref<File[]>([])
const key = ref(Date.now())

watch(
  () => props.modelValue,
  (ni, oi) => {
    URL.revokeObjectURL(oi)
    if (!ni) key.value = Date.now()
  },
)

const filesRender = computed(() => {
  if (files.value.length || !props.modelValue) return files.value
  return [new File([], props.modelValue)]
})
const imageUrl = computed(() => {
  if (props.modelValue.match(/^blob:https?:\/\//i)) {
    return props.modelValue
  } else if (!props.modelValue) return ''

  return `${location.origin}/cdn/${props.folder}/${props.modelValue}`
})

function changeHandler(_files: File[]) {
  files.value = _files
  if (!_files.length) return
  emit('update:modelValue', URL.createObjectURL(_files[0]))
}

onBeforeUnmount(() => {
  URL.revokeObjectURL(props.modelValue)
})
</script>
<template lang="pug">
rk-file(:key="key" :model-value="filesRender" accept="image/*" v-bind="$attrs" @update:model-value="changeHandler")
.image-wrapper
  img(:src="imageUrl")
</template>
<style lang="sass" scoped>
.image-wrapper
  display: grid
  justify-content: end
  > img
    object-fit: contain
    max-width: var(--rk-form-item-width)
    max-height: var(--rk-form-item-width)
    &[src='']
      display: none
</style>
