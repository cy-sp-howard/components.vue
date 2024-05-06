<script lang="ts" setup>
import { computed, ref } from 'vue'
import _ from 'lodash'
import useLang from '@/utils/useLang'

const props = defineProps<{
  disabled?: boolean
  modelValue: File[]
  accept?: string
  multiple?: boolean
  capture?: boolean
}>()
const emit = defineEmits<{ (e: 'update:modelValue', files: File[]): void }>()
const { texts } = useLang('Web')

const fileInputRef = ref<HTMLInputElement | null>(null)
const inputKey = ref(Date.now())

const fileNames = computed(() => {
  return _.chain(props.modelValue).map('name').join(', ').value()
})

function changeHandler() {
  if (!fileInputRef.value) return
  const files = _.chain(fileInputRef.value.files?.length || 0)
    .times(i => {
      return fileInputRef.value?.files?.item(i)
    })
    .compact()
    .value()
  emit('update:modelValue', files)
  inputKey.value = Date.now()
}
</script>
<template lang="pug">
rk-input(v-bind="$attrs" :disabled="disabled" :model-value="fileNames" readonly)
  template(#suffix)
    rk-button.mini(:disabled="disabled" @click="()=>(!disabled &&$refs.fileInputRef.click())") {{ texts['瀏覽'] }}
teleport(v-if="!disabled" to="body")
  input.file-input(ref="fileInputRef" :key="inputKey" type='file' :accept="accept" :multiple="multiple" :capture="capture" @change="changeHandler")
</template>
<style lang="sass" scoped>
input
  position: absolute
  opacity: 0
  z-index: -1
  top: 0
  left: 0
</style>
