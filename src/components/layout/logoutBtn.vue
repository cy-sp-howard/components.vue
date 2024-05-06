<script lang="ts" setup>
import { useLangStore } from '@/stores/lang'
import { useWebStore } from '@/stores/web'
import { logout } from '@/utils/request'
import { computed } from 'vue'

const langStore = useLangStore()
const webStore = useWebStore()

const texts = computed(() => langStore.texts.Web)

function changeHandler(e: string) {
  if (texts.value['登出'] === e) {
    logout()
  }
}
</script>
<template lang="pug">
.logout(v-if="~webStore.theme" :title="texts['登出']")
  svg-icon.logout(icon="logout" @click="logout()")
rk-select(v-else :opts="[{value:texts['登出']}]" @update:model-value="changeHandler")
  svg-icon(icon="setting")
</template>
<style lang="sass" scoped>
.logout
  cursor: pointer
  line-height: 20px
</style>
