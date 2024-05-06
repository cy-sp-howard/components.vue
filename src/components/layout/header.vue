<script setup lang="ts">
import Tab from './tab.vue'
import TimeBtn from './timeBtn.vue'
import LangBtn from './langBtn.vue'
import ThemeBtn from './themeBtn.vue'
import LogoutBtn from './logoutBtn.vue'
import { useWebStore } from '@/stores/web'

const webStore = useWebStore()
</script>
<template lang="pug">
header
  h6
    span(v-for="(i,index) in webStore.pagePath" :key="index") {{ i }}
  tab
  .info
    span(@click="webStore.theme = 0") {{ webStore.time}}
    div
      b {{ webStore.account }}
      logout-btn
      time-btn(v-if="~webStore.theme")
      lang-btn(v-if="~webStore.theme")
      theme-btn(v-if="~webStore.theme")
</template>
<style lang="sass" scoped>
[data-theme='-1'] header
  --header-border-color: #0002
  > .info
    grid-auto-flow: column
[data-theme='1'] header
  --header-border-color: #0002
</style>
<style lang="sass" scoped>
header
  --header-border-color: #fff2
  padding: 15px 30px 0 30px
  grid-template-columns: 1fr auto
  border-bottom: 1px solid var(--header-border-color)
  overflow: hidden
  display: grid
  gap: 10px
  > h6
    grid-area: 1 / 1 / span 1 / span 1
    font-size: 13px
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    > span
      &:not(:first-of-type)::before
        content: '/'
        position: relative
        padding: 0 5px

      @for $i from 0 through 2
        &:nth-last-of-type(#{$i + 1})
          opacity: 1 - $i * 0.3
      &:nth-last-of-type(n+4)
        opacity: 0.3
  > #tab
    grid-area: 2 / 1 / span 1 / span 1
  > .info
    align-self: flex-start
    display: grid
    justify-content: flex-end
    font-size: 12px
    gap: inherit
    grid-area: 1 / 2 / span 2 / span 1
    --rk-form-item-height: 20px
    > span
      text-align: right
    > div
      justify-self: flex-end
      display: flex
      gap: 5px
      > b
        color: var(--color-1)
        font-weight: bold
        font-size: 12px
      > .logout
        margin-right: 10px
      > *:not(b)
        opacity: 0.7
        font-size: 16px
        &:hover
          opacity: 1

@media (width < 600px)
  header
    padding-bottom: 15px
    > h6, > #tab, > .info > span
      display: none
</style>
