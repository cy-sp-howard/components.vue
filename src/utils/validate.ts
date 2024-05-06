import useMsg from './useMsg'
import moment from './utcMoment'
import { useLangStore } from '@/stores/lang'
import {
  setLocale,
  addMethod,
  string,
  number,
  ref,
  type AnyObjectSchema,
  type ValidateOptions,
} from 'yup'

setLocale({
  string: {
    email: 'email',
  },
  number: {
    positive: 'positive',
    integer: 'integer',
  },
  mixed: {
    required: 'required',
    notType: err => {
      const langStore = useLangStore()
      return `须为${langStore.texts.Web[err.type] || err.type}`
    },
  },
})
addMethod(string, 'equal', function (targetRef: ReturnType<typeof ref>) {
  return this.test('equal', 'equal', function (val) {
    return this.resolve(targetRef) === val
  })
})
addMethod(string, 'mixAzDig6to10', function () {
  return this.matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,10}$/, {
    message: 'mixAzDig6to10',
    excludeEmptyString: true,
  })
})
addMethod(string, 'azDig6to10', function () {
  return this.matches(/^[A-Za-z\d]{6,10}$/, {
    message: 'azDig6to10',
    excludeEmptyString: true,
  })
})
addMethod(string, 'phone', function () {
  return this.matches(/^\+?[\d]*$/, {
    message: 'vaildateErr',
    excludeEmptyString: true,
  })
})
addMethod(string, 'future', function () {
  return this.test('future', 'future', function (val) {
    return moment(val) > moment()
  })
})
addMethod(number, 'emptyTrans', function () {
  return this.transform((val, _val) => (_val === '' ? undefined : val))
})

export default function <Data>(
  s: AnyObjectSchema,
  lang: Record<string, string>,
  data: Data,
  opts?: ValidateOptions,
): Promise<Data> {
  return s.validate(data, opts).catch(e => {
    const langStore = useLangStore()
    const { addMsg } = useMsg()
    // 依規則名稱至lang.Web 尋找翻譯 + 使用提供的lang物件依錯誤參數名尋找中文
    addMsg({ text: lang[e.path] + ' ' + (langStore.texts.Web[e.message] || ''), type: 'error' })
    return Promise.reject(e)
  })
}
