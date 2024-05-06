<script setup lang="ts">
import v from '@/utils/validate'
import { Login } from '@/api/User'
import useMsg from '@/utils/useMsg'
import { reactive, ref } from 'vue'
import { object, string } from 'yup'
import useLang from '@/utils/useLang'
import { useWebStore } from '@/stores/web'
import { useRouter, useRoute } from 'vue-router'
import TimeBtn from '@/components/layout/timeBtn.vue'
import LangBtn from '@/components/layout/langBtn.vue'
import ThemeBtn from '@/components/layout/themeBtn.vue'

const webStore = useWebStore()
const { texts } = useLang('Login')
const router = useRouter()
const route = useRoute()
const { addApiMsg } = useMsg()
const schema = object({
  Account: string().required().default('myAccount01'),
  Password: string().required().default('007'),
})

const loading = ref(false)
const postData = reactive(schema.getDefault())

async function submit() {
  v(schema, texts.value, postData).then(_postData => {
    loading.value = true
    Login()
      .then(({ Data }) => {
        webStore.token = Data.AccessToken
        const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
        router.push(redirect)
        webStore.account = _postData.Account
      })
      .catch(e => {
        addApiMsg(texts.value.routeName, e)
      })
      .finally(() => {
        loading.value = false
      })
  })
}
</script>
<template lang="pug">
#login
  rk-scroll(:get-target="()=>$el")
  rk-scroll(:get-target="()=>$el" horizontal)
  form(@submit.prevent="submit")
    h1 {{ texts.title }}
    lang-btn(v-if="!~webStore.theme" :icon="false")
    span {{texts.Account}}
    rk-input(v-model="postData.Account" autocomplete="username")
    span {{texts.Password}}
    rk-input(v-model="postData.Password" type="password" autocomplete="current-password")
    rk-button(submit :loading="loading") {{texts.routeName}}
  div 
    span {{ webStore.time }}
    div(v-if="~webStore.theme")
      time-btn
      lang-btn 
      theme-btn
</template>

<style lang="sass" scoped>
[data-theme='-1'] #login
  --border-color: #777
  --form-radius: 20px
  --rk-form-item-height: 50px
  background: #2d3a4a
  > form
    background: #273542
    box-shadow: 0 0 0 1px var(--border-color)
    position: relative
    > h1
      position: absolute
      top: -70px
      left: 50%
      transform: translateX(-50%)
    > :deep(.rk-select)
      --rk-form-item-height: 40px
      justify-self: flex-end
      &:not(.selecting) > svg
        color: white
      > .rk-input > input
        width: 90px
    :deep(.rk-input) > input
      background: #252b32
      color: white
    > .rk-input
      margin-top: 30px
    > span
      display: none
    > .rk-button
      width: var(--rk-form-item-width)
      justify-self: center
  > div
    transform: translateY(210px)
[data-theme='1'] #login
  background: var(--color-1)
  > form > h1
    background-image: url('@img/logo_w.png')
</style>
<style lang="sass" scoped>
#login
  --form-radius: 40px
  --rk-form-item-height: 75px
  display: grid
  gap: 10px
  height: 100vh
  grid-template-columns: 50px auto 50px
  grid-template-rows: 50px auto 50px
  overflow: auto
  > form
    padding: 40px 50px
    border-radius: var(--form-radius)
    background: var(--bg)
    display: grid
    grid-area: 2 / 2 / span 1 / span 1
    width: 650px
    align-self: center
    justify-self: center
    > h1
      font-size: 30px
      text-align: center
      font-weight: bold
      line-height: 55px
      color: transparent !important
      background: url('@img/logo_w.png') no-repeat center
      background-size: 100px
      user-select: none
    > span
      font-size: 20px
      color: #697388
      padding: 25px 0 5px 0
      line-height: 40px
    > :deep(.rk-input)
      width: 100%
      font-size: 20px
      border-radius: 10px
      display: block
      > input
        width: inherit
        padding: 0 20px
    > .rk-button
      margin-top: 30px
      border-radius: 10px
      width: 100%
      font-size: 20px
  > div
    grid-area: 2 / 2 / span 1 / span 1
    justify-self: center
    align-self: center
    font-size: 16px
    color: white
    transform: translateY(290px)
    display: grid
    width: 650px
    > span, > div
      grid-area: 1 / 1 / span 1 / span 1
    > span
      justify-self: center
      opacity: 0.6
    > div
      justify-self: flex-end
      padding-right: 20px
      gap: 10px
      display: flex
      > *
        --rk-form-item-height: 20px
        height: var(--rk-form-item-height)
        opacity: 0.7
        &:hover
          opacity: 1
      > .rk-select
        font-size: 16px
</style>
