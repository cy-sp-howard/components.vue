<script setup lang="ts">
import useLang from '@/utils/useLang'

defineProps<{
  item: {
    Account: string
    Name: string
    statusStr: string
    bonusStr: string
    flowStr: string
  }
}>()
const { texts } = useLang('ChildChild1')
</script>
<template lang="pug">
form#audit-detail
  rk-input(:model-value="item.Account" :label="texts['會員']" disabled)
  rk-input(:model-value="item.Name" :label="texts['活動名稱']" disabled)
  rk-input(:model-value="item.statusStr" :label="texts['狀態']" disabled)
  rk-input(:model-value="item.bonusStr" :label="texts['獎金']" disabled)
  rk-input(model-value="-" textarea :label="texts['備註']" disabled)
</template>
<style lang="sass" scoped>
#audit-detail
  --rk-disabled-opacity: 0.7
  :deep(.label)
    width: 100px
  > label,> .rk-select
    --rk-form-item-width: 210px
</style>
