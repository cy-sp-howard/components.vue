<script lang="ts" setup>
import { ref, inject } from 'vue'
import useLang from '@/utils/useLang'

const props = defineProps<{
  url?: string
  desc?: string
  resolve: (link: { url: string; desc: string }) => void
}>()
const close = inject<() => void>('close') || (() => {})
const { texts } = useLang('Web')

const _url = ref(props.url || '')
const _desc = ref(props.desc || '')

function submit() {
  props.resolve({
    url: _url.value,
    desc: _desc.value,
  })
  close()
}
</script>
<template lang="pug">
form#link-dialog(@submit.prevent="submit")
  rk-input(v-model="_url" :label="texts['地址']")
  rk-input(v-model="_desc" :label="texts['描述']")
  rk-button(submit) {{ texts['確認'] }}
</template>
<style lang="sass" scoped>
#link-dialog
  :deep(.label)
    width: 50px
</style>
