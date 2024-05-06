<script setup lang="ts">
import _ from 'lodash'
import useLang from '@/utils/useLang'
import { useWebStore } from '@/stores/web'
import useStorage from '@/utils/useStorage'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { computed, inject, onBeforeUnmount, reactive, ref, watch, type Ref } from 'vue'
import { nextTick } from 'vue'

const excludeAlivePage = inject<Ref<string[]>>('excludeAlivePage') || ref([])
const route = useRoute()
const router = useRouter()
const { texts, rootTexts } = useLang('Web')
const webStore = useWebStore()
const { record } = useStorage<{ record: string[] }>({ record: [] })
const caching = ref<string[]>([])
let abortCtrl = new AbortController()

const menuShow = ref('')
const tab = ref<{ $el: HTMLElement } | null>(null)
const menuStyle = reactive({
  left: '0px',
  top: '0px',
})

const recordRender = computed(() => {
  const totalRoutes = router.getRoutes()
  return _.chain(record.value)
    .map(i => {
      return {
        text: rootTexts.value[i].routeName,
        to: { name: i },
        caching: caching.value.includes(i),
      }
    })
    .filter(i => _.some(totalRoutes, r => r.name === i.to.name))
    .value()
})

watch(
  route,
  ni => {
    if (typeof ni.name === 'string' && !['NotFound'].includes(ni.name)) {
      add(ni.name)
    }
    setTimeout(() => {
      tab.value &&
        tab.value.$el.querySelector('.router-link-active')?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  },
  { immediate: true },
)
watch(
  () => webStore.token,
  ni => {
    if (!ni) {
      record.value = []
      caching.value = []
    }
  },
)

function openMenu(evt: MouseEvent, name: string) {
  menuShow.value = name
  const { clientX, clientY } = evt
  menuStyle.top = clientY + 'px'
  menuStyle.left = clientX + 'px'

  abortCtrl = new AbortController()
  addEventListener('mousedown', closeMenu, { signal: abortCtrl.signal })
}
function closeMenu() {
  menuShow.value = ''
  abortCtrl.abort()
}
function refresh(name: string) {
  excludeAlivePage.value.push(name)
  router.replace({ name: 'NotFound' }).finally(() => {
    _.pull(excludeAlivePage.value, name)
    const emptyState = _.chain(history.state)
      .omit(['back', 'current', 'forward', 'replaced', 'position', 'scroll'])
      .mapValues(() => undefined)
      .value()
    router.replace({ name, state: emptyState })
  })
}
function del(name: string) {
  const index = record.value.indexOf(name)
  excludeAlivePage.value.push(name)
  nextTick(() => {
    _.pull(excludeAlivePage.value, name)
  })
  _.pull(record.value, name)
  _.pull(caching.value, name)
  if (!record.value.length) {
    router.push('/')
  } else if (route.name === name) {
    router.push({ name: record.value[index] || record.value[index - 1] })
  }
}
async function delOther(name: string) {
  if (route.name !== name) {
    await router.push({ name })
  }

  _.chain(record.value).cloneDeep().pull(name).each(del).value()
}
function add(name: string) {
  record.value.push(name)
  caching.value.push(name)
  record.value = _.uniq(record.value)
  caching.value = _.uniq(caching.value)
}

onBeforeUnmount(closeMenu)
</script>
<template lang="pug">
#tab
  transition-group.wrapper(ref="tab" tag="div" name="tab")
    router-link(v-for="i in recordRender" :key="i.to.name" :to="i.to" :class="{caching:i.caching}" @contextmenu.prevent="e=>openMenu(e,i.to.name)")
      span {{ i.text }}
      svg-icon(icon="close" @click.prevent="del(i.to.name)")
  rk-scroll(:get-target="()=>tab.$el" horizontal :mutation-opt="{childList:true}")
  teleport(v-if="menuShow" to="body")
    ol.context-menu(:style="menuStyle")
      li(@mousedown="refresh(menuShow)") {{texts['重整']}}
      li(@mousedown="del(menuShow)") {{texts['關閉']}}
      li(@mousedown="delOther(menuShow)") {{texts['關閉其它']}}
      li(@mousedown="delOther(menuShow),del(menuShow)") {{texts['關閉所有']}}
</template>
<style lang="sass" scoped>
[data-theme='-1'] #tab
  --close-bg: #0003
  --close-color: white
  --active-bg: var(--color-2)
</style>
<style lang="sass" scoped>
#tab
  --close-bg: #fff3
  --close-color: unset
  --active-bg: var(--color-1)
  font-size: 12px
  position: relative
  overflow: hidden
  padding-bottom: 7px
  > .wrapper
    display: grid
    overflow: auto
    width: 100%
    gap: 5px
    grid-auto-flow: column
    justify-content: flex-start
    min-height: 26px
    > a
      border: 1px solid var(--border-color)
      display: grid
      grid-template-columns: 1fr 15px
      line-height: 2
      padding-right: 5px
      cursor: pointer
      border-radius: 3px
      color: var(--font-color)
      white-space: nowrap
      &:hover
        border-color: var(--active-bg)
      &.router-link-active
        background: var(--active-bg)
        grid-template-columns: 20px 1fr 15px
        color: white
        &::before
          content: ''
          width: 7px
          height: 7px
          align-self: center
          justify-self: center
          background: white
          display: inline-block
          border-radius: 50%
        > span
          padding-left: 0
      &:not(.caching)
        opacity: 0.5
      > span
        padding-left: 10px
      > svg
        align-self: center
        border-radius: 50%
        &:hover
          background: var(--close-bg)
          color: var(--close-color)
  .rk-scroll
    z-index: 0
    --visible-w: 5px
    --trigger-w: 10px

.context-menu
  position: fixed
  z-index: 0 !important
  background: var(--bg)
  transform: translate(5px,5px)
  box-shadow: 0 0 0 1px var(--border-color)
  > li
    font-size: 12px
    text-align: left
    line-height: 2
    padding: 0 10px
    cursor: pointer
    &:hover
      background: #313642
      color: white
.tab-move
  transition: transform .1s
.tab-enter-active,.tab-leave-active
  transition: max-width .2s, border-width .2s, padding-right .2s
  transition-timing-function: ease-out
  overflow: hidden
  max-width: 200px
.tab-enter-from,.tab-leave-to
  max-width: 0
  padding-right: 0 !important
  border-width: 0 !important
</style>
