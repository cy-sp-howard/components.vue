import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import asyncRoutes, { type AsyncRoute } from '@/router/asyncRoutes'
import { useLangStore } from '@/stores/lang'
import { useWebStore } from '@/stores/web'
import { GetUserMenu } from '@/api/User'
import { logout } from '@/utils/request'
import router from './index'
import _ from 'lodash'

export default async function (to: RouteLocationNormalized) {
  const isToLogin = to.name === 'Login'
  const webStore = useWebStore()
  if (webStore.token) {
    if (isToLogin) return '/'
    else if (!clearAsyncRoutes) {
      try {
        await generateRoutes()
      } catch (e) {
        logout()
        return false
      }
      return to.fullPath
    }
    return true
  } else {
    resetRoutes()
    return isToLogin ? true : { name: 'Login', query: { redirect: to.path } }
  }
}

let clearAsyncRoutes: (() => void) | undefined

function resetRoutes() {
  clearAsyncRoutes && clearAsyncRoutes()
  clearAsyncRoutes = undefined
}

async function generateRoutes() {
  const langStore = useLangStore()
  const webStore = useWebStore()
  webStore.routesSetting = await GetUserMenu().then(({ Data }) => {
    const children: (RouteRecordRaw | PermissionRoutes)[] = _.chain(Data)
      .sortBy('Sort')
      .map<PermissionRoutes>(i => {
        const routeLang = langStore.collection[i.MenuName]
        const langName = webStore.lang
        if (!routeLang) {
          langStore.collection[i.MenuName] = { routeName: { zh: i.Description } }
        } else {
          routeLang.routeName[langName] = routeLang.routeName[langName] || i.Description
        }
        const id = i.MainPageID
        const foundComp = _.find(
          asyncRoutes,
          route => route.meta?.id === id || route.name === i.MenuName,
        )
        const name = foundComp?.name || i.MenuName
        return _.assign(
          {
            name,
            path: (i.Level ? '' : '/') + name,
            children: [],
            struct: { id, parent: i.ParentMenuID, menuID: i.MenuID, level: i.Level },
          },
          foundComp,
        )
      })
      .each((i, index, ary) => {
        i.children = _.filter(ary, item => item.struct.parent === i.struct.menuID)
        if (!i.meta) {
          i.meta = { id: i.struct.id }
        }
        if (i.children.length || !i.component) {
          i.redirect = '/308'
        }
      })
      .reject('struct.level')
      .value()

    const layout: RouteRecordRaw = {
      path: '/LayoutRoot',
      component: () => import('@/components/layout/index.vue'),
      redirect: '/',
      children: children.concat({
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
      }),
    }
    clearAsyncRoutes = router.addRoute(layout)
    return children
  })
}

export interface PermissionRoutes extends AsyncRoute {
  name: string
  path: string
  redirect?: string
  children: PermissionRoutes[]
  struct: { id: number; parent: number; menuID: number; level: number }
}
