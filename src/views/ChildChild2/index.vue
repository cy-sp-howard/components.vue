<script setup lang="ts">
import { computed, ref } from 'vue'
import DetailDialog from './detailDialog.vue'
import useLang from '@/utils/useLang'
import Dialog from '@/utils/dialog'
import utcMoment from '@/utils/utcMoment'

defineOptions({ name: 'ChildChild2' })
const { texts } = useLang('ChildChild2')
const DetailDialogApp = new Dialog(DetailDialog)

const loading = ref(0)

const timeDemo = computed(() => {
  return utcMoment('2020-02-03T20:00:00Z').format('YYYY/MM/DD HH:mm:SS')
})

function openDetailDialog() {
  loading.value += 1
  DetailDialogApp.dialogProps.title = texts.value['詳情']
  setTimeout(() => {
    loading.value -= 1
    DetailDialogApp.open()
  }, 1000)
}
</script>
<template lang="pug">
#child-child-2
  span {{ timeDemo }}
  rk-button(:loading="loading" color="success" @click="openDetailDialog") {{ texts["彈窗"] }}

</template>
<style lang="sass" scoped>
#child-child-2
  display: grid
  gap: 20px
  span
    display: block
</style>
