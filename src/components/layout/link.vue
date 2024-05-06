<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useLangStore } from '@/stores/lang'
import ChildLink from './link.vue'

interface LinkItem {
  name: string
  path: string
  children: LinkItem[]
}
const emit = defineEmits<{ (e: 'unfold'): void }>()
const props = withDefaults(defineProps<{ item: LinkItem; extractOnlyChild?: boolean }>(), {
  extractOnlyChild: true,
})
const instance = getCurrentInstance()
const route = useRoute()
const langStore = useLangStore()

const unfold = ref(false)
const active = ref(false)

const name = computed(() => {
  return langStore.texts[props.item.name].routeName
})

watch(
  () => route.name,
  () => {
    nextTick(setActive)
  },
)

function setUnfold() {
  if (!unfold.value) emit('unfold')
  unfold.value = !unfold.value
}
function setActive() {
  active.value = Boolean(instance?.proxy?.$el.querySelector('.router-link-active'))
  if (active.value && !unfold.value) setUnfold()
}
function onBeforeLeave(el: HTMLElement) {
  el.style.setProperty('--h', `${el.offsetHeight}px`)
}

onMounted(setActive)
defineExpose({ unfold })
</script>
<template lang="pug">
child-link(v-if="extractOnlyChild && item.children.length === 1" :item="item.children[0]")
.link(v-else :class="{unfold,active}")
  template(v-if="item.children.length")
    h3(@click="setUnfold") 
      slot(name="prefix")
      span {{ name }}
      svg-icon(icon="down")
    transition(name="unfold" @before-leave="onBeforeLeave")
      div(v-show="unfold")
        child-link(v-for="(i,index) in item.children" :key="index" :item="i" :extract-only-child="false")
  router-link(v-else :to="{name:item.name}")
    slot(name="prefix")
    span {{ name }}

</template>
<style lang="sass" scoped>
[data-theme='1'] .link
  --children-bg: #0000ff05
  --children-shadow: #00331122
  --children-bg: #00880007
  --arrow-color: unset
  --unfold-bg: #81caf8dd
  --unfold-border: #0099cc
</style>
<style lang="sass" scoped>
.link
  --children-shadow: #00000055
  --children-bg: #00000013
  --arrow-color: var(--color-1)
  --unfold-bg: #90ffff20
  --unfold-border: var(--color-1)
  color: #dce2ea
  line-height: 50px
  user-select: none
  > h3, > a
    display: block
    cursor: pointer
    color: inherit
    position: relative
    font-size: 14px
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
    padding-right: 50px
    &:hover
      background: linear-gradient(to right,var(--unfold-bg) 0% ,var(--unfold-bg) 99%,var(--unfold-border) 99%)
  > a.router-link-active
    background: var(--unfold-bg)
  > h3  > svg
      position: absolute
      top: 50%
      right: 0
      color: var(--arrow-color)
      transform: translate(-20px,-50%)

  > div
    background: var(--children-bg)
    box-shadow: inset 0 0 10px var(--children-shadow)

  &.active
    color: var(--font-color)
  &.unfold > h3 > svg
    transform: translate(-20px,-50%) rotate3d(1,0,0,180deg)
</style>
<style lang="sass" scoped>
.unfold-enter-active,.unfold-leave-active
  overflow: hidden
  max-height: 0
  transition: max-height 0.2s
.unfold-enter-active
  transition-timing-function: ease-in
.unfold-leave-active
  transition-timing-function: linear
.unfold-leave-from,.unfold-enter-to
  max-height: var(--h, 100vh)
</style>
