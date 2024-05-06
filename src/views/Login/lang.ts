import { useLangStore } from '@/stores/lang'

const language = {
  routeName: {
    zh: '登入',
    en: 'Login',
  },
  title: {
    zh: '後台',
    en: 'Mgt',
  },
  Account: {
    zh: '帳號',
    en: 'Account',
  },
  Password: {
    zh: '密碼',
    en: 'Password',
  },
  localUtc: {
    zh: '本機時區',
    en: 'Local',
  },
  樣式: {
    zh: '樣式',
    en: 'Theme',
  },
  語言: {
    zh: '語言',
    en: 'Language',
  },
  時區: {
    zh: '時區',
    en: 'Time zone',
  },
}

const langStore = useLangStore()
langStore.addLang('Login', language)

export default {}
