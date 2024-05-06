<script lang="ts" setup>
import _ from 'lodash'
import { ref } from 'vue'
import type { Msg } from '@/utils/useMsg'

const msgs = ref<Msg[]>([])
let count = 0

function addMsg(msg: Omit<Msg, 'key'>) {
  if (!msg.text) return
  const data = _.assign({ key: ++count }, msg)
  msgs.value.push(data)
  return new Promise(rs => {
    setTimeout(() => {
      delMsg(data.key)
      rs(undefined)
    }, msg.duration || 3000)
  })
}
function delMsg(key: number) {
  msgs.value = _.reject(msgs.value, i => i.key === key)
}
defineExpose({ addMsg })
</script>
<template lang="pug">
transition-group#msg-wrapper(tag="ul" name="msg")
  li.rk-msg(v-for="i in msgs" :key="i.key" :class="i.type")
    span
      svg-icon(:icon='i.type==="error"?"err":"success"')
      h3
        b {{ i.text }}
        small(v-if="i.subText") {{ i.subText }}
      button(@click="delMsg(i.key)")
        svg-icon(icon="close")
</template>
<style lang="sass" scoped>
#msg-wrapper
  position: fixed
  bottom: 0
  right: 0
  overflow: hidden
  display: grid
  justify-content: flex-end
  align-items: flex-end
  align-content: flex-end
  pointer-events: none
  gap: 20px
  z-index: var(--z-msg)
  padding: 20px
  > .rk-msg
    width: 400px
    padding-left: 15px
    overflow: hidden
    border-radius: 3px
    background: var(--color-2)
    max-height: 200px
    &.error
      background: var(--color-3)
    > span
      display: grid
      gap: 15px
      min-height: 80px
      font-size: 25px
      color: white
      grid-template-columns: 30px 1fr 25px
      grid-auto-flow: column
      pointer-events: all
      > svg
        align-self: center
      > h3
        padding: 15px 0
        font-size: 16px
        align-self: center
        > b,> small
          word-break: break-all
          white-space: pre-wrap
          display: block
        > small
          font-size: 12px
          opacity: 0.7
      > button
        background: #00000025
        color: inherit
        cursor: pointer
        > svg
          opacity: 0.7
        &:hover > svg
          opacity: 1

.msg-enter-active
  transition: max-height 0.2s,opacity 0.2s
  transition-timing-function: linear
.msg-leave-active
  transition-timing-function: ease-in
  transition: max-height 0.2s,opacity 0.2s 0.05s
.msg-enter-from,.msg-leave-to
  max-height: 0 !important
  opacity: 0
</style>
