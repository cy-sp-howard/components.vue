import type { ComponentProps } from './mountVue'
import RkHint from '@/components/rkHint.vue'
import { useLangStore } from '@/stores/lang'
import Dialog from '@/utils/dialog'
import _ from 'lodash'
type HintProps = Partial<{
  -readonly [Key in keyof ComponentProps<typeof RkHint>]: ComponentProps<typeof RkHint>[Key]
}>

export default function () {
  const langStore = useLangStore()
  const app = new Dialog(RkHint, { title: '' })

  function showHint(content: unknown, props?: HintProps & { title?: string }) {
    return new Promise((rs, rj) => {
      app.dialogProps.title = props?.title ? props.title : langStore.texts.Web['提示']
      app.dialogProps.onClosed = () => rj('canceled hint without button')
      app.close()
      app.open(
        _.assign(
          { confirmCall: rs, cancelCall: () => rj('canceled hint by button') },
          _.omit(props, ['title']),
        ),
        { default: () => content },
      )
    })
  }
  function checkHint(actionName: string) {
    return showHint(langStore.texts.Web.checkAction + actionName + '？')
  }
  return { showHint, checkHint }
}
