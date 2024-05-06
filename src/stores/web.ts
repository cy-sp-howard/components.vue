import type { PermissionRoutes } from '@/router/permission'
import { ref, computed, reactive, watch } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import useStorage from '@/utils/useStorage'
import cookieRef from '@/utils/cookieRef'
import { useLangStore } from './lang'
import router from '@/router/index'
import { defineStore } from 'pinia'
import _ from 'lodash'

export const useWebStore = defineStore('web', () => {
  const langStore = useLangStore()
  const { lang, theme, utcOffset, account } = useStorage({
    lang: getDefaultLang(),
    utcOffset: '',
    theme: 0,
    account: '',
  })

  const routesSetting = ref<(RouteRecordRaw | PermissionRoutes)[]>([])
  const time = ref('')
  const token = cookieRef('', {
    key: 'auth-token',
    sameSite: 'strict',
    expires: (1 / 24 / 60) * 15,
  })
  const size = reactive({ vw: window.innerWidth, vh: window.innerHeight })

  const pageName = computed(() => {
    return _.last(pagePath.value)
  })
  const pagePath = computed(() => {
    return _.chain(router.currentRoute.value.matched)
      .map('name')
      .compact()
      .map(i => {
        const name = langStore.texts[i as string]?.routeName
        return name === 'routeName' ? i : name
      })
      .value()
  })

  watch(
    theme,
    ni => {
      document.documentElement.dataset.theme = String(ni)
    },
    { immediate: true },
  )
  watch(
    pageName,
    ni => {
      document.title = langStore.texts.Web.routeName
      if (ni && typeof ni === 'string') {
        document.title = `${ni} - ${document.title}`
      }
    },
    { immediate: true },
  )

  function getDefaultLang() {
    const langs = _.keys(langStore.collection.Web.lang)
    const preferLangs = _.map(navigator.languages, i => i.split('-')[0])
    return _.find(preferLangs, i => langs.includes(i)) || 'zh'
  }

  return {
    token,
    routesSetting,
    lang,
    utcOffset,
    time,
    size,
    theme,
    pagePath,
    account,
    pageName,
  }
})
