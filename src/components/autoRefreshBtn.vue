<script setup lang="ts">
import { onDeactivated } from 'vue'
import { onActivated } from 'vue'
import { watch, ref, onBeforeUnmount } from 'vue'

const props = withDefaults(
  defineProps<{ timeout?: number; cb: Function; loading: boolean | number }>(),
  { timeout: 40 },
)
const remain = ref(0)
const pid = ref(-1)
let needCall = false
let pageActive = false

watch(
  () => props.loading,
  ni => {
    if (ni) {
      clearInterval(pid.value)
      remain.value = 0
      return
    }
    countdown()
  },
)

function countdown() {
  remain.value = props.timeout
  pid.value = setInterval(() => {
    remain.value -= 1
    if (remain.value <= 0) {
      remain.value = 0
      clearInterval(pid.value)
      if (pageActive) props.cb()
      else needCall = true
    }
  }, 1000)
}

onBeforeUnmount(() => {
  clearInterval(pid.value)
})
onActivated(() => {
  pageActive = true
  if (needCall) {
    props.cb()
    needCall = false
  }
})
onDeactivated(() => {
  pageActive = false
})
</script>
<template lang="pug">
rk-button(color="success" :loading="loading" @click="cb()")
  slot
  template(v-if="~pid" ) ({{ remain }})
</template>
