<script setup lang="ts">
import { useWebStore } from '@/stores/web'
import useLang from '@/utils/useLang'
import useMsg from '@/utils/useMsg'

const { texts } = useLang('ChildChild2')
const webStore = useWebStore()
const { addMsg } = useMsg()

function msgShow() {
  addMsg({ text: texts.value['成功'] })
}
</script>
<template lang="pug">
form#audit-detail
  rk-input(v-model="webStore.account" :label="texts['帳號']" disabled)
  rk-tip.tip(v-slot="{showText, closeText}" anchor-y="bottom" :text="texts['顯示訊息']")
    rk-button(color="success" @click="msgShow" @mouseenter="showText" @mouseleave="closeText") {{ texts['訊息'] }}
</template>
<style lang="sass" scoped>
:global(.rk-tip.tip)
  z-index: 3000
  transform: translateY(10px)
#audit-detail
  --rk-disabled-opacity: 0.7
  :deep(.label)
    width: 100px
  > label,> .rk-select
    --rk-form-item-width: 210px
</style>
