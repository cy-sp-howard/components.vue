/// <reference types="vite/client" />
import 'yup'
import RkTip from '@/components/rkTip.vue'
import RkTab from '@/components/rkTab.vue'
import RkFile from '@/components/rkFile.vue'
import RkPage from '@/components/rkPage.vue'
import SvgIcon from '@/components/svgIcon.vue'
import RkInput from '@/components/rkInput.vue'
import RkCheck from '@/components/rkCheck.vue'
import RkSwitch from '@/components/rkSwitch.vue'
import RkSelect from '@/components/rkSelect.vue'
import RkButton from '@/components/rkButton.vue'
import RkImgFile from '@/components/rkImgFile.vue'
import RkTable from '@/components/rkTable/index.vue'
import RkScrollbar from '@/components/rkScrollbar.vue'
import RkDateInput from '@/components/rkDateInput.vue'
import LabelSelector from '@/components/labelSelector.vue'
import RkTableCol from '@/components/rkTable/rkTableCol.vue'
import RkDateRangeInput from '@/components/rkDateRangeInput.vue'

declare module 'yup' {
  interface StringSchema {
    equal(ref: Ref): this
    mixAzDig6to10(): this
    azDig6to10(): this
    phone(): this
    future(): this
  }
  interface NumberSchema {
    emptyTrans(): this
  }
}

declare module 'vue' {
  interface ComponentInternalInstance {
    provides: Record<string | symbol, unknown>
  }
  export interface GlobalComponents {
    RkTab: typeof RkTab
    RkFile: typeof RkFile
    RkPage: typeof RkPage
    SvgIcon: typeof SvgIcon
    RkInput: typeof RkInput
    RkSelect: typeof RkSelect
    RkButton: typeof RkButton
    RkImgFile: typeof RkImgFile
    RkTable: typeof RkTable
    RkScroll: typeof RkScrollbar
    RkDateInput: typeof RkDateInput
    LabelSelector: typeof LabelSelector
    RkTableCol: typeof RkTableCol
    RkDateRangeInput: typeof RkDateRangeInput
    RkCheck: typeof RkCheck
    RkTip: typeof RkTip
    RkSwitch: typeof RkSwitch
  }
}
