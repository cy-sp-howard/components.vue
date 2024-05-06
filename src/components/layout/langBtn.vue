<script lang="ts" setup>
import { useLangStore } from '@/stores/lang'
import { useWebStore } from '@/stores/web'
import { computed } from 'vue'
import _ from 'lodash'

withDefaults(defineProps<{ icon?: boolean }>(), { icon: true })

const langStore = useLangStore()
const webStore = useWebStore()

const langOpts = computed(() => {
  return _.map(langStore.collection.Web.lang, (i, k) => ({ label: i, value: k }))
})
</script>
<template lang="pug">
rk-select.lang(v-model="webStore.lang" :title="langStore.texts.Web['語言']" :opts="langOpts")
  svg-icon(v-if="icon" icon="lang")
</template>
