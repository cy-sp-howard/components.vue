import { useLangStore } from '@/stores/lang'
import { computed } from 'vue'

export default function (routeName: string) {
  const langStore = useLangStore()

  const texts = computed(() => {
    return langStore.texts[routeName || 'Web']
  })
  const webTexts = computed(() => {
    return langStore.texts.Web
  })
  const rootTexts = computed(() => {
    return langStore.texts
  })
  return { texts, webTexts, langStore, rootTexts }
}
