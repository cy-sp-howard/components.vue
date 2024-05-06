<script setup lang="ts">
import { useWebStore } from '@/stores/web'
import { RouterView } from 'vue-router'
import MainHeader from './header.vue'
import AsideLink from './link.vue'
import { provide, ref } from 'vue'

defineOptions({
  name: 'Layout',
})
const routeIcons = {
  HomePage: 'shapes',
  BusinessData: 'monitor',
  MemberMgt: 'cat',
  AgentManage: 'dog',
  MoneyMgt: 'money',
  ActivityMgt: 'balloon',
  MessageMgt: 'earth',
  ReportMgt: 'mouse',
  GameMgt: 'game',
  SystemMgt: 'gun',
  MaintainMgt: 'skull',
}
const webStore = useWebStore()

const links = ref<{ unfold: boolean }[] | null>(null)
const wrapperWidth = ref(0)
const excludeAlivePage = ref<string[]>([])

function showActiveLink(el?: HTMLElement) {
  if (el) el.querySelector('.router-link-active')?.scrollIntoView({ block: 'center' })
}
provide('excludeAlivePage', excludeAlivePage)
</script>
<template lang="pug">
.layout
  aside(@transitionstart.self="showActiveLink($refs.linksParent)")
    .top
    .links(ref="linksParent")
      aside-link(v-for="(i,index) in webStore.routesSetting" :key="index" ref="links" :item="i" :extract-only-child="false")
        template(#prefix) 
          svg-icon(:icon="routeIcons[i.name]||'building'")
    rk-scroll(:get-target="()=>$refs.linksParent")
  main
    main-header
    .route-wrapper(ref="wrapper")
      router-view(v-slot="{ Component }")
        transition(name="fade" mode="out-in" appear)
          keep-alive(:exclude="excludeAlivePage")
            component.route-block(:is="Component")
    rk-scroll(:get-target="()=>$refs.wrapper")
    rk-scroll(:get-target="()=>$refs.wrapper" horizontal @updated="e=>(wrapperWidth = e.wrapperHeight)")
  rk-scroll(:get-target="()=>$el" horizontal)
</template>
<style lang="sass" scoped>
[data-theme='-1'] .layout
  --aside-bg: #304156
  --active-color: white
  --active-border: #bfcbd9
  --active-bg: #263445
  .rk-scroll
    opacity: 0.5
  :deep(.route-block)
    box-shadow: 0 0 2px 0 var(--border-color)
[data-theme='1'] .layout
  --aside-bg: #619ff6
  --active-color: white
  --active-border: #fff
  --active-bg: #fff3
  --link-color: #fffd
</style>
<style lang="sass" scoped>
$icons-w: 50px
$routes-w: 200px
@mixin asideHover
  width: $icons-w + $routes-w
  > .top
    transition: opacity 0.2s 0.1s
    opacity: 1
  > .links > :deep(.link.unfold) > div
    display: block
  > .rk-scroll
    opacity: 0.5
    --visible-w: 10px
.layout
  --aside-bg: var(--bg)
  --active-color: var(--font-color)
  --link-color: #fffa
  --active-border: white
  --active-bg: #51545b
  display: grid
  overflow: hidden
  height: 100vh
  width: 100vw
  grid-template-columns: $icons-w $routes-w 1fr
  > aside
    $top-h: 100px
    overflow: hidden
    background: var(--aside-bg)
    grid-area: 1 / 1 / span 1 / span 2
    display: grid
    height: inherit
    grid-template-rows: $top-h 1fr
    align-items: flex-start
    z-index: var(--z-sidebar)
    width: $icons-w
    transition: width 0.1s
    &:hover
      z-index: calc(var(--z-menu) + 1)
      @include asideHover

    > .top
      grid-area: 1 / 1 / span 1 / span 1
      content: attr(title)
      color: white
      font-size: 20px
      height: $top-h
      background: url('@img/logo_w.png') no-repeat center
      background-size: 100px
      text-align: center
      opacity: 0
    > .links,> .rk-scroll
      grid-area: 2 / 1 / span 1 / span 1
    > :deep(.rk-scroll)
      opacity: 0.2
      justify-self: flex-end
      position: relative
      --visible-w: 5px
      > span
        height: 100% !important
    > .links
      max-height: calc(100vh - #{$top-h})
      overflow-x: hidden
      overflow-y: auto
      :deep(.link)
        > a, > h3
          width: $icons-w + $routes-w
          color: var(--link-color)
      > :deep(.link)
        &.unfold > div
          display: none
        &.active
          > h3, > a
            $b: 3px
            color: var(--active-color)
            background: linear-gradient(to right,var(--active-border) 0%, var(--active-border) $b ,var(--active-bg) $b,var(--active-bg) $icons-w) !important
        &:hover
          > h3 ,>a
            color: var(--active-color)
        > h3, > a
          grid-template-columns: $icons-w 1fr
          display: grid
          > svg
            align-self: center
            justify-self: center
            font-size: 18px
          > span
            padding-left: 0
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
        > div
          > .link
            > h3,> a
              padding-left: $icons-w
            .link
              h3, a
                padding-left: $icons-w + 15


  > main
    grid-area: 1 / 2 / span 1 / span 2
    display: grid
    gap: 30px
    position: relative
    grid-template-rows: auto 1fr
    overflow: hidden
    > .route-wrapper
      overflow: auto
      padding: 0 30px 30px 0
      margin: 0 20px 0 30px
      > *
        min-width: fit-content
      :deep(.route-block)
        background: var(--bg)
        border-radius: 25px
        padding: 30px
        align-content: flex-start
        display: grid
        transition-duration: 0.1s
        &:not(:first-child)
          margin-top: 30px
        &.block-wrapper
          background: unset
          border-radius: unset
          padding: unset
        > form
          display: flex
          flex-wrap: wrap
          gap: 15px 30px
          padding-bottom: 30px
        > .rk-tab,> form
          width: calc(v-bind(wrapperWidth) * 1px - 60px)
          min-width: 500px
          position: sticky
          left: 10px
    > .rk-scroll.horizontal
      right: 20px

  > .rk-scroll
    z-index: calc(var(--z-scroll) + 1)

@mixin layoutExtend
  .layout
    > aside
      @include asideHover
    > main
      grid-area: 1 / 3 / span 1 / span 1

@media (width >= 1600px)
  @include layoutExtend

@media (width < #{$icons-w + $routes-w + 100})
  @include layoutExtend
  .layout
    grid-template-columns: 50px $routes-w auto
    overflow: auto
    > main
      width: max-content
</style>
