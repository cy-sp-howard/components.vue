<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(0)
const done = ref(0)

router.beforeEach(() => {
  loading.value += 1
})
router.afterEach(() => {
  setTimeout(() => {
    done.value += 1
    setTimeout(() => {
      loading.value -= 1
      done.value -= 1
      if (loading.value < 0) loading.value = 0
      if (done.value < 0) done.value = 0
    }, 100)
  }, 300)
})
</script>
<template lang="pug">
span.rk-progress(:class="{loading,done}")
</template>
<style lang="sass" scoped>
.rk-progress
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 6px
  z-index: var(--z-progress)
  &::before
    content: ''
    display: block
    height: 100%
    width: 0%
    position: relative
    left: 0
    background: linear-gradient(to right,transparent, var(--color-3),transparent)
  &.loading
    &::before
      width: 100%
      transition: width 30s,transform 30s
      transform: translateX(30%)
      transition-timing-function: cubic-bezier(0,0.5,0,1)
    &.done::before
      transition: none
</style>
