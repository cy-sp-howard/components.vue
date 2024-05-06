import { addRouteWithLang } from '@/router/asyncRoutes'

const language = {
  routeName: {
    zh: '第三層1',
    en: 'layer 3-1',
  },

  名稱: {
    zh: '名稱',
    en: 'Name',
  },
  狀態: {
    zh: '狀態',
    en: 'Status',
  },
  全部: {
    zh: '全部',
    en: 'All',
  },
  申請時間: {
    zh: '申請時間',
    en: 'Apply time',
  },
  審核時間: {
    zh: '審核時間',
    en: 'Review Time',
  },
  待處理: {
    zh: '待處理',
    en: 'Pending',
  },
  通過: {
    zh: '通過',
    en: 'Pass',
  },
  失敗: {
    zh: '失敗',
    en: 'Fail',
  },
  A: {
    zh: 'A',
    en: 'A',
  },
  B: {
    zh: 'B',
    en: 'B',
  },
  C: {
    zh: 'C',
    en: 'C',
  },
  款式: {
    zh: '款式',
    en: 'Type',
  },
  正常: {
    zh: '正常',
    en: 'OK',
  },
  查詢: {
    zh: '查詢',
    en: 'Search',
  },
  試算得分: {
    zh: '試算得分',
    en: 'Calculated Score',
  },
  實際得分: {
    zh: '實際得分',
    en: 'Real Score',
  },
  操作者: {
    zh: '操作者',
    en: 'Editor',
  },
}

addRouteWithLang({
  name: 'ChildChild1',
  component: () => import('./index.vue'),
  alias: '/',
  language,
})

export default {}
