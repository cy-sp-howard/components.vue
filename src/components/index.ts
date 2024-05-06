import type { App } from 'vue'
import RkTab from './rkTab.vue'
import RkTip from './rkTip.vue'
import RkFile from './rkFile.vue'
import RkPage from './rkPage.vue'
import SvgIcon from './svgIcon.vue'
import RkInput from './rkInput.vue'
import RkCheck from './rkCheck.vue'
import RkSelect from './rkSelect.vue'
import RkSwitch from './rkSwitch.vue'
import RkButton from './rkButton.vue'
import RkImgFile from './rkImgFile.vue'
import RkTable from './rkTable/index.vue'
import RkScrollbar from './rkScrollbar.vue'
import RkDateInput from './rkDateInput.vue'
import LabelSelector from './labelSelector.vue'
import RkTableCol from './rkTable/rkTableCol.vue'
import RkDateRangeInput from './rkDateRangeInput.vue'
export default {
  install(app: App) {
    app.component('RkPage', RkPage)
    app.component('RkInput', RkInput)
    app.component('RkFile', RkFile)
    app.component('RkImgFile', RkImgFile)
    app.component('RkSelect', RkSelect)
    app.component('RkButton', RkButton)
    app.component('SvgIcon', SvgIcon)
    app.component('RkScroll', RkScrollbar)
    app.component('RkTable', RkTable)
    app.component('RkTableCol', RkTableCol)
    app.component('RkDateInput', RkDateInput)
    app.component('RkCheck', RkCheck)
    app.component('RkTip', RkTip)
    app.component('RkDateRangeInput', RkDateRangeInput)
    app.component('LabelSelector', LabelSelector)
    app.component('RkTab', RkTab)
    app.component('RkSwitch', RkSwitch)
  },
}
