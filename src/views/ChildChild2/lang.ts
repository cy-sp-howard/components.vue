import { addRouteWithLang } from '@/router/asyncRoutes'

const language = {
  routeName: {
    zh: '第三層2',
    en: 'layer 3-2',
  },

  彈窗: {
    zh: '彈窗',
    en: 'Modal',
  },
  詳情: {
    zh: '詳情',
    en: 'Detail',
  },
  帳號: {
    zh: '帳號',
    en: 'Account',
  },
  顯示訊息: {
    zh: '顯示訊息',
    en: 'Show Tip Text',
  },
  訊息: {
    zh: '訊息',
    en: 'Message',
  },
  成功: {
    zh: '成功',
    en: 'Success',
  },
}

addRouteWithLang({
  name: 'ChildChild2',
  component: () => import('./index.vue'),
  language,
})

export default {}
