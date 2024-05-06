import { useWebStore } from '@/stores/web'
import { CheckOnline } from '@/api/User'
import mountVue from './utils/mountVue'
import '@/assets/css/main.sass'
import App from './App.vue'
import moment from 'moment'
import _ from 'lodash'

mountVue({ component: App, el: '#root' })

function getNewToken() {
  if (webStore.token) {
    CheckOnline().then(({ Data }) => {
      webStore.token = Data.RefreshToken
    })
  }
}
function setTime() {
  webStore.time = moment().utcOffset(webStore.utcOffset).format('YYYY/MM/DD HH:mm:ss Z')
}

const webStore = useWebStore()
document.documentElement.lang = webStore.lang
setTime()
getNewToken()
setInterval(setTime, 1000)
setInterval(getNewToken, 3 * 60 * 1000)
addEventListener('resize', () => {
  _.assign(webStore.size, { vw: innerWidth, vh: innerHeight })
})
