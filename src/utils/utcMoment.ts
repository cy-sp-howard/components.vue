import { useWebStore } from '@/stores/web'
import moment from 'moment'

moment.updateLocale('en', { invalidDate: '' })

export default function (...args: Parameters<typeof moment>) {
  const webStore = useWebStore()
  return moment(...args).utcOffset(webStore.utcOffset)
}
