<script lang="ts" setup>
import { computed, inject, type Ref } from 'vue'
import _ from 'lodash'

const rowData = inject<Ref<Record<string, unknown>>>('rowData')
const props = defineProps<{
  prop?: string
  title?: string
  w?: number
  minW?: number
  fold?: boolean
}>()

const widthWithUnit = computed(() => {
  return props.w ? props.w + 'px' : 'unset'
})
const minWidthWithUnit = computed(() => {
  return props.minW ? props.minW + 'px' : widthWithUnit.value
})
const tdVal = computed(() => {
  const val = _.get(rowData?.value, props.prop || '', '-')
  return val === '' ? '-' : val
})
</script>
<template lang="pug">
component.rk-table-col(:is='rowData?"td":"th"' colspan="1")
  slot(v-if="rowData" v-bind="rowData") {{ tdVal }}
  slot(v-else name="th") {{ title }}
</template>
<style lang="sass" scoped>
[data-theme='-1'] .rk-table-col
  --th-color: #505256
  --th-bg: #edf0f299
  --td-color: var(--font-color)
  --hover-color: #000
  --table-border-color: #dfe6ec
[data-theme='1'] .rk-table-col
  --th-color: #558888
  --th-bg: unset
  --td-color: var(--font-color)
  --hover-color: #000
  --table-border-color: #dfe6ec
</style>
<style lang="sass" scoped>
.rk-table-col
  --th-color: #ccc
  --th-bg: transparent
  --td-color: #ccc
  --hover-color: var(--font-color)
  --table-border-color: #fff3
  border-bottom: 1px solid var(--table-border-color)
  padding: 5px 10px
  text-align: center
  height: 50px
  width: v-bind(widthWithUnit)
  min-width: v-bind(minWidthWithUnit)
  word-break: break-all
  white-space: pre-wrap
  color: var(--td-color)
  &:not(td)
    color: var(--th-color)
    background: var(--th-bg)
  &:hover
    color: var(--hover-color)
</style>
