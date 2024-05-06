import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useWebStore } from '@/stores/web'
import _ from 'lodash'

export default function (
  getTarget: () => HTMLElement | unknown,
  handler: (i: DOMRect) => void,
  callable: () => boolean,
  close?: Function,
) {
  const webStore = useWebStore()
  const obs = new IntersectionObserver(
    ent => {
      ent.forEach(i => {
        !i.isIntersecting && close && close()
      })
    },
    {
      root: document.body,
      rootMargin: '0px',
      threshold: _.times(101, i => i * 0.01),
    },
  )
  const abortCtrl = new AbortController()
  addEventListener('scroll', callHandler, { capture: true, signal: abortCtrl.signal })

  watch(() => webStore.size, callHandler, { deep: true })

  function callHandler() {
    if (!callable()) return
    const el = getTarget()
    if (el instanceof HTMLElement) {
      handler(el.getBoundingClientRect())
    }
  }

  onMounted(() => {
    const el = getTarget()
    if (el instanceof HTMLElement) {
      obs.observe(el)
    }
  })
  onBeforeUnmount(() => {
    abortCtrl.abort()
    obs.disconnect()
  })

  return {
    triggerAnchor: callHandler,
  }
}
