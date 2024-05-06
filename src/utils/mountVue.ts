import globalComponents from '@/components/index'
import { createApp, type Component } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'

const pinia = createPinia()

export default function ({
  component,
  el = document.createElement('div'),
}: {
  component: Component
  el?: Element | string
}) {
  const app = createApp(component).use(pinia).use(router).use(globalComponents)
  return { app, instance: app.mount(el) }
}

export type ComponentProps<C extends Component> = C extends (abstract new (
  ...args: unknown[]
) => infer I extends { $props: unknown })
  ? I['$props']
  : C extends { props: unknown }
  ? C['props']
  : unknown
