import _ from 'lodash'
import { defineStore } from 'pinia'
import { useWebStore } from './web'
import { computed, reactive } from 'vue'

export const useLangStore = defineStore('lang', () => {
  const webStore: { lang: string } = useWebStore()
  const collection: Record<string, RouteLanguage> = reactive({
    Web: {
      routeName: {
        zh: '後台',
        en: 'mgt',
      },
      number: { zh: '數字' },
      email: {
        zh: '請輸入正確信箱',
      },
      positive: {
        zh: '須為正數',
        en: 'positive',
      },
      integer: {
        zh: '須為整數',
        en: 'integer',
      },
      noData: {
        zh: '無資料',
        en: 'No data',
      },
      required: {
        zh: '必填',
        en: 'required',
      },
      equal: {
        zh: '须一致',
        en: 'should equal',
      },
      azDig6to10: {
        zh: '需6-10英數字',
      },
      mixAzDig6to10: {
        zh: '需6-10英數混合字',
      },
      future: {
        zh: '須為未來時間',
      },
      vaildateErr: {
        zh: '格式錯誤',
      },
      lang: {
        zh: '中文',
        en: 'English',
      },
      Su: { zh: '日', en: 'Su' },
      Mo: { zh: '一', en: 'Mo' },
      Tu: { zh: '二', en: 'Tu' },
      We: { zh: '三', en: 'We' },
      Th: { zh: '四', en: 'Th' },
      Fr: { zh: '五', en: 'Fr' },
      Sa: { zh: '六', en: 'Sa' },
      周日: { zh: '周日', en: 'Sunday' },
      周一: {
        zh: '周一',
        en: 'Monday',
      },
      周二: {
        zh: '周二',
        en: 'Tuesday',
      },
      周三: {
        zh: '周三',
        en: 'Wednesday',
      },
      周四: {
        zh: '周四',
        en: 'Thursday',
      },
      周五: {
        zh: '周五',
        en: 'Friday',
      },
      周六: {
        zh: '周六',
        en: 'Saturday',
      },
      語言: {
        zh: '語言',
        en: 'Language',
      },
      樣式: {
        zh: '樣式',
        en: 'Theme',
      },
      確認: { zh: '確認', en: 'Confirm' },
      取消: { zh: '取消', en: 'Abort' },
      清除: { zh: '清除', en: 'Clear' },
      提示: { zh: '提示', en: 'Hint' },
      選擇: { zh: '選擇', en: 'Select' },
      年: { zh: '年', en: ' ' },
      月: { zh: '月', en: ' ' },
      日: { zh: '日', en: ' ' },
      登出: {
        zh: '登出',
        en: 'Logout',
      },
      失败: {
        zh: '失敗',
        en: 'Fail',
      },
      成功: {
        zh: '成功',
        en: 'Success',
      },
      已登出: {
        zh: '帳號已登出',
        en: 'Please relogin',
      },
      checkAction: {
        zh: '確定要',
        en: 'Are you sure?',
      },
      pageUnit: {
        zh: '頁',
        en: 'Page',
      },
      itemUnit: {
        zh: '筆',
        en: 'Per',
      },
      時區: {
        zh: '時區',
        en: 'Time zone',
      },

      重整: { zh: '重整', en: 'Refresh' },
      關閉: { zh: '關閉', en: 'Close' },
      關閉其它: { zh: '關閉其它', en: 'Close others' },
      關閉所有: { zh: '關閉所有', en: 'Close all' },
    },
    Child1: {
      routeName: {
        zh: '第二層分類1',
        en: 'Child1',
      },
    },
    Child2: {
      routeName: {
        zh: '第二層2',
        en: 'Child2',
      },
    },
    SecondGroup: {
      routeName: {
        zh: '第一層分類2',
        en: 'SecondGroup',
      },
    },
    FirstGroup: {
      routeName: {
        zh: '第一層分類',
        en: 'FirstGroup',
      },
    },
  })

  const texts = computed(() => {
    // default all unset route {}
    const currentLangTexts = _.mapValues(collection, route => {
      return _.mapValues(route, key => key[webStore.lang] || key['zh'])
    })
    return new Proxy(currentLangTexts, {
      get(target: typeof currentLangTexts, prop: string): (typeof currentLangTexts)[string] {
        const routeTexts = target[prop] || {}
        return new Proxy(routeTexts, {
          get(_routeTexts, key: string): string {
            // window._lang ??= {}
            // _lang[prop] ??= {}
            // if (key !== 'routeName') {
            //   _lang[prop][key] ??= {}
            //   _lang[prop][key].zh = collection[prop][key]?.zh || key
            //   _lang[prop][key].en = collection[prop][key]?.en || key
            //   const req = { route: prop, key, lang: webStore.lang, data: _lang[prop][key] }
            // }
            return _routeTexts[key] || key
          },
        })
      },
    })
  })

  function addLang(routeName: string, langs: RouteLanguage) {
    collection[routeName] = langs
    return collection
  }

  return { collection, texts, addLang }
})
interface langTexts extends Record<string, string> {
  zh: string
}
export type RouteLanguage = Record<string, langTexts> & { routeName: langTexts }
