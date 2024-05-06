<script lang="ts" setup>
import { useLangStore } from '@/stores/lang'
import { useWebStore } from '@/stores/web'
import { computed } from 'vue'

const webStore = useWebStore()
const langStore = useLangStore()

const utcList = computed(() => {
  const texts = langStore.texts.Login
  return [
    { value: '', label: texts.localUtc },
    { value: '+08:00' },
    { value: '+09:00' },
    { value: '+00:00' },
  ]
})
</script>
<template lang="pug">
rk-select.time(v-model="webStore.utcOffset" :opts="utcList" :title="langStore.texts.Web['時區']")
  svg-icon(icon="time") 
</template>
