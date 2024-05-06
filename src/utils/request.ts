import router from '@/router'
import { Logout } from '@/api/User'
import { useWebStore } from '@/stores/web'
import { useLangStore } from '@/stores/lang'

import _ from 'lodash'

export type RespData<T extends (...args: never[]) => Promise<RespBodyWrapper<unknown>>> = Awaited<
  ReturnType<T>
>['Data']
export type ReqData<T extends (...args: never[]) => unknown> = Parameters<T>[0]
export interface Pagination {
  PageIndex: number
  PageSize: number
  TotalCount?: number
  PageCount?: number
}
export interface RespBodyWrapper<Resp> {
  Code: number
  Data: Resp
  ExtensionData: null
  Message: string
  Success: boolean
  Pagination: Pagination | null
}

class ReqPending {
  private readonly pending = new Map()
  private absReq: Promise<unknown> = Promise.resolve()
  private reqList: Promise<unknown>[] = []
  private started = false

  private start() {
    const { value, done } = this.pending.entries().next()
    if (done) {
      this.started = false
      return
    }
    const [cb, { isAbsolute, rs }] = value
    if (isAbsolute) {
      const reqList = this.reqList
      this.reqList = []
      this.absReq = Promise.allSettled(reqList.concat(this.absReq)).finally(() => {
        const req = cb()
        rs(req)
        return new Promise(resolve => {
          req.finally(() => {
            // 延遲100ms 提供運算緩衝
            setTimeout(resolve, 100)
          })
        })
      }) as Promise<unknown>
    } else {
      const p = this.absReq.finally(() => {
        const req = cb()
        rs(req)
        _.pull(this.reqList, p)
        return req
      })
      this.reqList.push(p)
    }
    this.pending.delete(cb)
    this.start()
  }
  add<Resp>(cb: () => Promise<Resp>, isAbsolute?: boolean): Promise<Resp> {
    return new Promise(rs => {
      this.pending.set(cb, { isAbsolute, rs })
      if (!this.started) {
        this.started = true
        this.start()
      }
    })
  }
  clear() {
    this.pending.forEach(i => i.rs(Promise.reject('clear')))
    this.pending.clear()
  }
  req<Resp>(
    opts: Parameters<typeof request<Resp>>[0] & { absolute?: boolean; checkCode?: boolean },
  ) {
    const cb = () => {
      const abortCtrl = new AbortController()
      const req = request<Resp>(
        _.assign({}, _.omit(opts, ['absolute']), {
          signal: abortCtrl.signal,
          before(url: string, originOpts: RequestInit) {
            const langVerbose: Record<string, string> = {
              zh: 'zh-Hans',
              en: 'en-US',
              ja: 'ja-JP',
            }
            const webStore = useWebStore()
            const acceptLang = langVerbose[webStore.lang] || langVerbose.en
            const headers = new Headers(originOpts.headers)
            headers.set('accept-language', acceptLang)
            webStore.token && headers.set('authorization', `Bearer ${webStore.token}`)

            const resultOpts = _.assign({}, originOpts, { headers })
            if (opts.before) {
              const [resultURL, result2Opts] = opts.before(url, originOpts)
              _.assign(resultOpts, result2Opts)
              url = resultURL
            }
            return [url, resultOpts]
          },
        }),
      )

      abortableMap.set(req, () => abortCtrl.abort())
      const pid = setTimeout(() => abortCtrl.abort(), 30000)
      req.finally(() => {
        clearTimeout(pid)
      })

      return req
    }
    const p = this.add(cb, opts.absolute)
    return p
      .catch(e => e)
      .then(resp => {
        if (resp?.body?.Code !== 0) {
          if (resp.status === 401 && !resp.url.match(/logout/i)) {
            reqPending.clear()
            logout(true)
          }
          if (opts.checkCode === false) {
            return {
              Code: 0,
              Data: resp.body,
              ExtensionData: null,
              Message: '',
              Success: true,
              Pagination: null,
            }
          }
          if (!(resp.status >= 200 && resp.status < 300)) {
            return Promise.reject(resp)
          }
          return Promise.reject(resp.body || resp)
        }
        return resp.body
      })
      .then(body => {
        return body as RespBodyWrapper<Resp>
      })
  }
}
const reqPending = new ReqPending()

export default reqPending.req.bind(reqPending)
export const abortableMap = new WeakMap<object, () => void>()
export function logout(is401 = false) {
  import('./useMsg').then(({ default: useMsg }) => {
    const webStore = useWebStore()
    const langStore = useLangStore()
    const { addMsg } = useMsg()

    if (!webStore.token) return
    Logout()
    webStore.token = ''
    const redirect = router.currentRoute.value.path
    router.push({ name: 'Login', query: { redirect } })
    addMsg({ type: is401 ? 'error' : 'success', text: langStore.texts.Web['已登出'] })
  })
}

export function request<Resp>(
  opts: Omit<RequestInit, 'body'> & {
    data?: unknown
    url: string
    before?: (url: string, opts: RequestInit) => [string, RequestInit]
    after?: (
      resp: Pick<Response, 'headers' | 'url' | 'status' | 'statusText'> & {
        body: Resp
        response: Response
      },
    ) => typeof resp | Promise<typeof resp>
  },
) {
  let finalURL = opts.url
  let finalOpts: RequestInit
  let body: BodyInit | undefined

  const headers = new Headers()
  headers.set('content-type', 'application/json')

  const base = new URL(location.origin)
  const fullURL = new URL(opts.url, base.origin + base.pathname)

  if (!opts.method || opts.method.toLowerCase() === 'get') {
    _.each(opts.data as Record<string, string>, (val: string, key: string) => {
      fullURL.searchParams.set(key, JSON.stringify(val))
    })
  } else if (opts.data instanceof FormData) {
    body = opts.data
    headers.delete('content-type')
  } else {
    body = JSON.stringify(opts.data)
  }
  new Headers(opts.headers).forEach((i, k) => {
    headers.set(k, i)
  })

  finalOpts = _.chain({ credentials: 'omit' as 'omit' })
    .assign(opts)
    .omit(['data', 'url', 'before', 'after'])
    .assign({ body, headers })
    .value()
  if (opts.before) {
    const [_url, _opts] = opts.before(opts.url, finalOpts)
    finalOpts = _opts
    finalURL = _url
  }

  return fetch(finalURL, finalOpts).then(response => {
    const contentType = response.headers.get('content-type') || ''
    const isText = ~contentType.indexOf('text/')
    const isJson = ~contentType.indexOf('application/json')
    return response
      .clone()
      [isJson ? 'json' : isText ? 'json' : 'blob']()
      .catch(() => response.text())
      .then((body: Resp) => {
        return _.chain(response)
          .pick(['status', 'statusText', 'url', 'headers'])
          .assign({ body, response })
          .value()
      })
      .then(resp => {
        if (opts.after) {
          return opts.after(resp)
        }
        if (resp.status >= 200 && resp.status < 300) return resp
        return Promise.reject(resp)
      })
  })
}
