<script lang="ts" setup>
import { useLangStore } from '@/stores/lang'
import { useWebStore } from '@/stores/web'
import { computed } from 'vue'

const webStore = useWebStore()
const langStore = useLangStore()

const icon = computed(() => {
  const icons: Record<string, string> = {
    '0': 'moon',
    '1': 'sun',
    // '-1': 'star',
  }
  return icons[webStore.theme.toString()]
})

function changeTheme() {
  webStore.theme += 1
  if (webStore.theme > 1) {
    webStore.theme = 0
  }
}
</script>
<template lang="pug">
.theme(:title="langStore.texts.Web['樣式']" @click="changeTheme")
  svg-icon(:icon="icon")
</template>
<style lang="sass" scoped>
.theme
  line-height: var(--rk-form-item-height)
  cursor: pointer
</style>
