<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import moment from '@/utils/utcMoment'
import useLang from '@/utils/useLang'
import useMsg from '@/utils/useMsg'
import _ from 'lodash'

defineOptions({ name: 'ChildChild1' })
const { texts } = useLang('ChildChild1')
const { addApiMsg } = useMsg()

const loading = ref(0)
const checkedRows = ref<number[]>([])

const postData = reactive({
  input: '',
  check: 1,
  select: -1,
  DateType: 1,
  StartDate: moment().add(-1, 'M').startOf('d').toJSON(),
  EndDate: moment().add(1, 'd').startOf('d').toJSON(),
  Pagination: {
    PageIndex: 1,
    PageSize: 20,
    TotalCount: 50,
  },
})

const checkableLen = computed(() => {
  return _.chain(respRender.value)
    .filter(i => i.Status === 1)
    .size()
    .value()
})
const checkedAllRows = computed({
  get() {
    return Boolean(checkableLen.value && checkedRows.value.length === checkableLen.value)
  },
  set(val: boolean) {
    checkedRows.value = val
      ? _.chain(respRender.value)
          .filter(i => i.Status === 1)
          .map('ID')
          .value()
      : []
  },
})
const respRender = computed(() => {
  const remainder = postData.Pagination.TotalCount % postData.Pagination.PageSize
  const fullPageLastIndex = _.floor(postData.Pagination.TotalCount / postData.Pagination.PageSize)

  const lastPage = postData.Pagination.PageIndex > fullPageLastIndex
  return _.times(remainder && lastPage ? remainder : postData.Pagination.PageSize, () => ({
    ID: _.random(0, 9999999),
    Status: 1,
    statusStr: texts.value['正常'],
    bonusStr: _.random(0, 10777700.22).toLocaleString(),
    realBonusStr: _.random(0, 1044400.55).toLocaleString(),
    createDateStr: moment().format('YYYY/MM/DD HH:mm:SS'),
    OperationAccount: 'Admin',
  }))
})
const opts = computed(() => {
  const _texts = texts.value
  const allOpt = { label: _texts['全部'], value: -1 }
  return {
    dateType: [
      { label: _texts['申請時間'], value: 1 },
      { label: _texts['審核時間'], value: 2 },
    ],
    select: [
      allOpt,
      { label: _texts['待處理'], value: 1 },
      { label: _texts['通過'], value: 2 },
      { label: _texts['失敗'], value: 3 },
    ],
    check: [
      { label: _texts['A'], value: 1 },
      { label: _texts['B'], value: 2 },
      { label: _texts['C'], value: 3 },
    ],
  }
})

function submit() {
  loading.value += 1
  checkedRows.value = []
  setTimeout(() => {
    addApiMsg(texts.value['查詢'], { Code: 0 })
    loading.value -= 1
  }, 1000)
}
function reset() {
  postData.Pagination.PageIndex = 1
}
</script>
<template lang="pug">
#child-child-1
  form(@submit.prevent="reset(), submit()")
    rk-input(v-model="postData.input" :label="texts['名稱']")
    rk-date-range-input(v-model:start="postData.StartDate" v-model:end="postData.EndDate" display-format="YYYY/MM/DD")
      template(#label)
        label-selector(v-model="postData.DateType" :opts="opts.dateType")
    rk-select(v-model="postData.select" :label="texts['狀態']" :opts="opts.select")
    rk-check(v-model="postData.check" :label="texts['款式']" :opts="opts.check")
    rk-button(submit :loading="loading" color="success") {{ texts["查詢"] }}
  rk-table(:data="respRender" :loading="loading")
    rk-table-col(:w="50")
      template(v-if="checkableLen" #th)
        rk-check(v-model="checkedAllRows" :default-value="false" :opts="[{value:true,label:''}]")
      template(#default="row")
        rk-check(v-if="row.Status === 1" v-model="checkedRows" :opts="[{value:row.ID,label:''}]" multiple)
    rk-table-col(:title="texts['試算得分']" prop="bonusStr" :w="150")
    rk-table-col(:title="texts['實際得分']" prop="realBonusStr" :w="150")
    rk-table-col(:title="texts['申請時間']" prop="createDateStr" :min-w="180")
    rk-table-col.green(:title="texts['狀態']" prop="statusStr" :w="90")
    rk-table-col(:title="texts['操作者']" prop="OperationAccount" :w="150")
  rk-page(v-model="postData.Pagination.PageIndex" v-model:size="postData.Pagination.PageSize" :total="postData.Pagination.TotalCount" @change="submit")

</template>
<style lang="sass" scoped>
#child-child-1
  // display: grid
  // gap: 20px
  // --rk-form-item-width: 100%
  // .rk-date-range-input
  //   --rk-form-item-width: 100%
  .green:not(th)
    color: var(--color-2)
  :deep(.label)
    width: 130px
  :deep(.rk-table) .rk-check
    --rk-form-item-width: fit-content
</style>
