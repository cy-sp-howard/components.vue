import _ from 'lodash'
import { reactive, toRefs, watch } from 'vue'

const key = 'storage'

export default function <T extends Record<string, unknown>>(defaultData?: T) {
  const storage = reactive((defaultData || {}) as T)

  try {
    _.assign(storage, JSON.parse(atob(localStorage.getItem(key) as string)))
  } catch (e) {
    /* empty */
  }

  watch(storage, ni => {
    localStorage.setItem(key, btoa(JSON.stringify(ni)))
  })

  return { ...toRefs(storage), storage }
}
