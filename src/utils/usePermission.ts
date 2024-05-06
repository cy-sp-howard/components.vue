import { inject, provide, reactive } from 'vue'
import { GetPermission } from '@/api/User'
import { useRoute } from 'vue-router'
import _ from 'lodash'

export default function (id?: number) {
  const idFromRoute = !_.isNumber(id)
  const route = useRoute()
  const injectPermission = inject<Record<string, boolean> | null>('permission', null)
  const _permission = reactive<Record<string, boolean>>({})
  const permission = idFromRoute ? injectPermission || _permission : _permission

  if (!injectPermission) {
    const metaIDExist = typeof route.meta?.id === 'number'
    const metaID = metaIDExist ? route.meta?.id : null
    const MainPageID = idFromRoute ? metaID : id
    if (!_.isNil(MainPageID)) {
      GetPermission({ MainPageID }).then(({ Data }) => {
        _.each(Data, i => {
          permission[i.FunctionID] = true
        })
      })
    }
  }

  if (!injectPermission || !idFromRoute) {
    provide('permission', permission)
  }
  return permission
}
