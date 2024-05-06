<script lang="ts" setup>
import { computed, watch, ref } from 'vue'
import RkTableRow from './rkTableRow.vue'
import { useLangStore } from '@/stores/lang'

defineOptions({
  name: 'RkTable',
})
const props = withDefaults(defineProps<{ data: unknown[]; loading?: boolean | number }>(), {
  loading: false,
})
const langStore = useLangStore()

const got = ref(false)

const noDataText = computed(() => (got.value ? langStore.texts.Web.noData : '--'))

watch(
  () => [props.data, props.loading],
  () => (got.value = true),
)
</script>
<template lang="pug">
table.rk-table(:class="{loading}")
  transition(name="fade")
    caption(v-if="loading")
      svg-icon(icon="loading")
  thead
    rk-table-row
      slot
  tbody(:data-empty-text="noDataText")
    rk-table-row(v-for="(i,index) in props.data" :key="index" :row-data="i")
      slot
</template>
<style lang="sass" scoped>
[data-theme='-1'] .rk-table
  box-shadow: 0 0 2px #0006
</style>
<style lang="sass" scoped>
.rk-table
  font-size: 14px
  border-spacing: 0
  width: 100%
  position: relative
  &.loading
    cursor: progress
    > *
      pointer-events: none
      &:not(caption)
        opacity: 0.8
  > caption
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    font-size: 30px
    display: flex
    align-items: center
    justify-content: center
    z-index: 1
    background: var(--bg)
    opacity: 0.7
    > svg
      animation: rotate 1s linear infinite


  > tbody
    position: relative
    &:empty
      height: 100px
      &::before
        content: attr(data-empty-text)
        opacity: 0.6
        font-size: 16px
        line-height: 100px
        position: absolute
        width: 100%
        text-align: center
</style>
