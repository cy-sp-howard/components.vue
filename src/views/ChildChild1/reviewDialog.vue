<script setup lang="ts">
import { type GetActivityAuditList, ReviewActivityAudit } from '@/api/ActivityMgt'
import { inject, reactive, ref, computed, onBeforeMount } from 'vue'
import type { ReqData, RespData } from '@/utils/request'
import { number, object, string, array } from 'yup'
import useHint from '@/utils/useHint'
import useLang from '@/utils/useLang'
import useMsg from '@/utils/useMsg'
import v from '@/utils/validate'
import _ from 'lodash'

const emit = defineEmits<(e: 'change') => void>()
const props = defineProps<{ items: RespData<typeof GetActivityAuditList> }>()
const close = inject<() => void>('close') || (() => {})
const { texts } = useLang('ChildChild1')
const { checkHint } = useHint()
const { addApiMsg } = useMsg()
const schema = object({
  IDList: array(number()).default(_.map(props.items, 'ID')),
  Status: number().default(3),
  Bonus: number().default(0),
  Note: string().trim().required().default(''),
  MailContent: string()
    .trim()
    .when(['Status'], ([status], s) => {
      if (status === 3) return s.required()
      return s
    })
    .default(''),
})

const loading = ref(false)
const postData = reactive<ReqData<typeof ReviewActivityAudit>>(schema.getDefault())
const bonusType = ref(0)

const disabled = computed(() => Boolean(props.items[0].ReviewDate))
const statusOpts = computed(() => {
  const _t = texts.value
  return [
    { label: _t['通过'], value: 2 },
    { label: _t['拒绝'], value: 3 },
  ]
})
const bonusOpts = computed(() => {
  const _t = texts.value
  return [
    { label: _t['依原金额'], value: 0 },
    { label: _t['自订金额'], value: 1 },
  ]
})
const sumBonus = computed(() => {
  return _.sumBy(props.items, i => i.Bonus).toLocaleString()
})

function submit() {
  if (postData.Status === 2) {
    postData.MailContent = ''
    if (bonusType.value === 0) {
      postData.Bonus = 0
    }
  } else {
    postData.Bonus = 0
  }
  v(schema, texts.value, postData).then(_postData => {
    const actionName = texts.value['提交']
    const hintText = texts.value[
      postData.Status === 2 ? '确定通过 {{x}} 笔奖金' : '确定不通过 {{x}} 笔奖金'
    ].replace('{{x}}', String(_postData.IDList.length))
    checkHint(hintText).then(() => {
      loading.value = true
      ReviewActivityAudit(_postData)
        .then(respData => {
          addApiMsg(actionName, respData)
          emit('change')
          close()
        })
        .catch(e => {
          addApiMsg(actionName, e)
        })
        .finally(() => {
          loading.value = false
        })
    })
  })
}

onBeforeMount(() => {
  if (!disabled.value) return
  const _i = props.items[0]
  postData.Status = _i.Status
  postData.Bonus = _i.RealBonus
})
</script>
<template lang="pug">
form#review-activity-audit-dialog(@submit.prevent="submit")
  rk-check(v-model="postData.Status" :label="texts['狀態']" :opts="statusOpts" required :disabled="disabled")
  template(v-if="postData.Status === 2 ")
    rk-check(v-if="!disabled" v-model="bonusType" :label="texts.Bonus" :opts="bonusOpts" required)
    rk-input(v-if="bonusType || disabled" v-model="postData.Bonus" label="" :disabled="disabled")
  rk-input(v-model="postData.Note" textarea :label="texts.Note" maxlength="30" :disabled="disabled")
  rk-input(v-if="postData.Status === 3" v-model="postData.MailContent" textarea :label="texts.MailContent" :disabled="disabled" maxlength="50")
  span(v-if="items.length > 1 && !disabled") *{{ texts['實際總金額'] }}：{{ sumBonus }}
  rk-button(v-if="!disabled" submit :loading="loading") {{ texts['提交'] }}
</template>
<style lang="sass" scoped>
#review-activity-audit-dialog
  > *
    --rk-form-item-width: 300px
  :deep(.label)
    width: 80px
  > span
    text-align: right
    color: red
</style>
