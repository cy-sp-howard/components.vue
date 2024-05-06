import type { RouteComponent } from 'vue-router'
import { useLangStore, type RouteLanguage } from '@/stores/lang'
import _ from 'lodash'

const asyncRoutes: AsyncRoute[] = []

export default asyncRoutes
export function addRouteWithLang(
  route: {
    name: string
    language: RouteLanguage | (() => Promise<{ default: RouteLanguage }>)
  } & AsyncRoute,
) {
  const langStore = useLangStore()
  if (route.language instanceof Function) {
    route.language().then(module => {
      langStore.addLang(route.name, module.default)
      asyncRoutes.push(_.omit(route, 'language'))
    })
  } else {
    langStore.addLang(route.name, route.language)
    asyncRoutes.push(_.omit(route, 'language'))
  }
}

declare module 'vue-router' {
  interface RouteMeta extends Exclude<AsyncRoute['meta'], undefined> {}
}

export interface AsyncRoute {
  name?: string
  path?: string
  meta?: { id?: number }
  alias?: string
  component: () => Promise<RouteComponent>
}

// invoke all @/views/**/lang.ts file(add route with language)
_.each(import.meta.glob('@/views/**/lang.ts'), i => i())
