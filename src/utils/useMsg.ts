import RkMsg from '@/components/rkMsg.vue'
import { Teleport, h, ref } from 'vue'
import mountVue from './mountVue'
import useLang from './useLang'
import _ from 'lodash'

const msgInstance = mountVue({
  component: {
    setup() {
      const main = ref<{ addMsg: typeof addMsg } | null>(null)
      return { main }
    },
    render() {
      return h(Teleport, { to: 'body' }, h(RkMsg, { ref: 'main' }))
    },
  },
}).instance

export default function () {
  const _addMsg = (msgInstance as { main?: { addMsg?: typeof addMsg } }).main?.addMsg || (() => {})
  const { texts } = useLang('Web')
  return {
    addMsg: _addMsg,
    addApiMsg: (
      actionName: string,
      apiResp:
        | { Code?: number; Message?: string }
        | { body: string; headers: Headers; status: number; statusText: string; url: string }
        | Error,
    ) => {
      if (apiResp instanceof Object) {
        if ('Code' in apiResp && apiResp.Code === 0) {
          _addMsg({ text: actionName + texts.value['成功'] })
        } else if ('Code' in apiResp) {
          const err = _.omitBy(apiResp, i => i === null)
          const subText = _.isEmpty(err) ? undefined : JSON.stringify(err)
          const isEmptyMsg = apiResp.Message === 'ResultCode_Fail' || !apiResp.Message
          _addMsg({
            text: isEmptyMsg ? actionName + texts.value['失败'] : apiResp.Message || '',
            subText: isEmptyMsg ? subText : '',
            type: 'error',
          })
        } else if ('status' in apiResp && apiResp.status !== 200) {
          _addMsg({
            text: `${apiResp.status} ${apiResp.statusText}`,
            type: 'error',
          })
        } else if (apiResp instanceof Error) {
          _addMsg({
            text: apiResp.message,
            type: 'error',
          })
        }
        return
      }
      _addMsg({
        text: String(apiResp),
        type: 'error',
      })
    },
  }
}

export type Msg = {
  text: string
  subText?: string
  type?: 'error' | 'success'
  key: number
  duration?: number
}

declare function addMsg(msg: Omit<Msg, 'key'>): Promise<undefined>
