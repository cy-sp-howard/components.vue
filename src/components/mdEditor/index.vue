<script lang="ts" setup>
import _ from 'lodash'
import preview from './preview.vue'
import Dialog from '@/utils/dialog'
import useLang from '@/utils/useLang'
import LinkDialog from './linkDialog.vue'
import { computed, ref, nextTick } from 'vue'

const emit = defineEmits<{ (e: 'update:modelValue', val: string): void }>()
const props = defineProps<{ rows?: number; modelValue: string; disabled?: boolean }>()

let scrolling = -1
let scrollEndPid = -1
let tableHoverPid = -1
const LinkDialogApp = new Dialog(LinkDialog)
const { texts } = useLang('Web')

const active = ref(!props.modelValue && !props.disabled)
const tableHover = ref(false)
const fullScreen = ref(false)
const boardRef = ref<HTMLTextAreaElement | null>(null)
const wrapperRef = ref<HTMLDivElement | null>(null)

const value = computed({
  get() {
    return props.modelValue
  },
  set(val: string) {
    if (props.disabled) return
    emit('update:modelValue', val)
  },
})

const headList = computed(() => {
  return _.times(5, i => ({ value: `h${i + 1}` }))
})
const emojiList = computed(() => {
  return _.map(
    [
      '😂',
      '❤️',
      '😍',
      '🙏',
      '🤔',
      '🎉',
      '😊',
      '🎶',
      '👍',
      '🤣',
      '👏',
      '🙌',
      '😎',
      '🥰',
      '😜',
      '😅',
      '🥺',
      '🤗',
      '🎂',
      '🎁',
      '😘',
      '🤩',
      '😋',
      '🤤',
      '🤪',
      '🥳',
      '🤷‍♂️',
      '🤷‍♀️',
      '🙄',
      '😑',
      '😴',
      '😔',
      '😕',
      '🤨',
      '😩',
      '😢',
      '😭',
      '😷',
      '🤒',
      '🤕',
      '🤢',
      '🤮',
      '🤧',
      '🥴',
      '😵',
      '🤯',
      '🤬',
      '😤',
      '😠',
      '😇',
    ],
    i => ({ value: i }),
  )
})

async function insertText(type: string, addText = '') {
  const el = boardRef.value
  const val = value.value
  if (!el) return
  const { selectionStart, selectionEnd } = el

  if (['link', 'img'].includes(type)) {
    LinkDialogApp.dialogProps.title = texts.value[type === 'link' ? '插入链结' : '插入图片']
    const { url, desc } = await getLinkValue({
      desc: val.substring(selectionStart, selectionEnd),
    }).catch(() => {
      el.focus()
      return Promise.reject()
    })
    addText = `[${desc}](${url})`
    if (type === 'img') {
      addText = '!' + addText
    }
  }
  value.value = `${val.slice(0, selectionStart)}${addText}${val.slice(selectionEnd)}`
  nextTick(() => {
    el.setSelectionRange(selectionStart, selectionStart + addText.length)
    setTimeout(() => {
      el.focus()
    }, 0)
  })
}
function getLinkValue(link?: { url?: string; desc?: string }) {
  return new Promise<{ url: string; desc: string }>((resolve, reject) => {
    LinkDialogApp.dialogProps.onClosed = reject
    LinkDialogApp.open(_.assign({ resolve }, link))
  })
}
function surroundText(type: string) {
  const el = boardRef.value
  const val = value.value
  if (!el) return
  let { selectionStart, selectionEnd } = el
  let midText = val.substring(selectionStart, selectionEnd)
  const leftText = val.slice(0, selectionStart)
  const rightText = val.slice(selectionEnd)
  if (midText.match(/\n$/)) {
    selectionEnd -= 1
    midText.slice(0, midText.length - 1)
  } else if (!midText) {
    midText = type
    selectionEnd += type.length
  }
  let addText = ''
  switch (type) {
    case 'bold':
      addText = '**'
      break
    case 'italic':
      addText = '*'
      break
    case 'del':
      addText = '~~'
      break
    case 'code':
      addText = '`'
      break
    case 'block':
      addText = '\n```\n'
      break

    default:
      break
  }
  value.value = `${leftText}${addText}${midText}${addText}${rightText}`
  nextTick(() => {
    el.focus()
    el.setSelectionRange(selectionStart, selectionEnd + addText.length * 2)
  })
}
function rowText(type: string) {
  const el = boardRef.value
  if (!el) return
  const { selectionEnd } = el
  const {
    start: rowStartPos,
    end: rowEndPos,
    text: rowText,
    bottomText,
    topText,
  } = getRowPos(selectionEnd)
  const emptyRow = !rowText.match(/[^\n ]/)

  let addText = ''
  switch (type) {
    case 'h1':
      addText = '# '
      break
    case 'h2':
      addText = '## '
      break
    case 'h3':
      addText = '### '
      break
    case 'h4':
      addText = '#### '
      break
    case 'h5':
      addText = '##### '
      break
    case 'h6':
      addText = '###### '
      break
    case 'quote':
      addText = '> '
      break

    default:
      break
  }
  if (rowText.match(new RegExp(`^${addText}`))) {
    addText = ''
  } else if (emptyRow) {
    addText += 'write something'
  }
  value.value = `${topText}${addText}${rowText}${bottomText}`
  nextTick(() => {
    el.setSelectionRange(rowStartPos, rowEndPos + addText.length)
    setTimeout(() => {
      el.focus()
    }, 0)
  })
}
function wrapText(type: string, addText: string) {
  const el = boardRef.value
  if (!el) return
  const { selectionEnd } = el
  const { text, topText, bottomText } = getRowPos(selectionEnd)
  switch (type) {
    case 'ol':
      addText = '1. item-1\n2. item-2\n3. item-3'
      break
    case 'ul':
      addText = '- item-1\n- item-2\n- item-3'
      break
    case 'todo':
      addText = '- [ ] item-1\n- [x] item-2\n- [ ] item-3'
      break

    default:
      break
  }
  const _text = text.trim()
  const lastPos = topText.length + _text.length + (_text.length && 1)
  value.value = `${topText}${_text}${_text ? '\n' : ''}${addText}\n${bottomText}`
  nextTick(() => {
    el.focus()
    el.setSelectionRange(lastPos, lastPos + addText.length)
  })
}
function tabHandler(evt: KeyboardEvent) {
  evt.preventDefault()
  const el = boardRef.value
  if (!el) return
  const { selectionEnd } = el
  const { text, topText, bottomText } = getRowPos(selectionEnd)

  value.value = `${topText}  ${text}${bottomText}`
  nextTick(() => {
    el.setSelectionRange(selectionEnd + 2, selectionEnd + 2)
  })
}
function enterHandler(evt: KeyboardEvent) {
  evt.preventDefault()
  const el = boardRef.value
  if (!el) return
  const { selectionStart, selectionEnd } = el
  value.value = value.value.slice(0, selectionStart) + value.value.slice(selectionEnd)
  const { start, text } = getRowPos(selectionStart)
  let repeatText = text.match(/^ *((> ?)+|\d\. |- \[( |x)\] |- )?/)?.[0] || ''
  const tailText = text.slice(repeatText.length)
  if (!tailText.trim()) {
    repeatText = ''
  }
  const numMatched = repeatText.match(/\d+/)
  if (numMatched) {
    repeatText = `${repeatText.slice(0, numMatched.index)}${
      Number(numMatched[0]) + 1
    }.${repeatText.slice((numMatched.index || 0) + repeatText.length - 1)}`
  }
  if (selectionStart === start) {
    repeatText = ''
  }
  value.value = `${value.value.slice(0, selectionStart)}\n${repeatText}${value.value.slice(
    selectionStart,
  )}`
  nextTick(() => {
    const pos = selectionStart + 1 + repeatText.length
    el.setSelectionRange(pos, pos)
  })
}
function getRowPos(pos: number) {
  const val = value.value
  const currentPosLeft = val.slice(0, pos)
  const currentPosRight = val.slice(pos)
  const rowStartPos = (currentPosLeft.match(/\n(?!.*\n)/)?.index ?? -1) + 1
  const rowEndPos = pos + (currentPosRight.match(/\n/)?.index ?? val.length - pos)
  return {
    start: rowStartPos,
    end: rowEndPos,
    text: val.substring(rowStartPos, rowEndPos),
    topText: val.slice(0, rowStartPos),
    bottomText: val.slice(rowEndPos),
  }
}
function getTable(nth: number) {
  nth = 25 - nth
  const row = _.floor(nth / 6)
  const col = nth % 6 || 6
  const genRow = (_t: string) =>
    `|${_.chain(col)
      .times(() => ` ${_t} |`)
      .join('')
      .value()}\n`
  wrapText(
    'table',
    `${genRow('head')}${genRow(':-:')}${_.chain(row)
      .times(() => genRow('content'))
      .join('')
      .value()}`.replace(/\n$/, ''),
  )
  setTableHover(false, 0)
}
function activeEditor() {
  if (props.disabled || active.value) return
  active.value = true

  const el = boardRef.value
  if (!el) return
  el.focus()
}
function setTableHover(show: boolean, timeout?: number) {
  clearTimeout(tableHoverPid)
  tableHoverPid = setTimeout(() => {
    tableHover.value = show
  }, timeout ?? (show ? 0 : 500))
}
function syncScroll(type: 0 | 1) {
  const _b = boardRef.value
  const _p = wrapperRef.value
  if ((~scrolling && scrolling !== type) || !_b || !_p) return
  scrolling = type
  const bFull = _b.scrollHeight - _b.offsetHeight
  const pFull = _p.scrollHeight - _p.offsetHeight
  if (type) {
    const pPer = _.floor(_p.scrollTop / pFull, 2)
    _b.scrollTop = _.floor(pPer * bFull, 2)
  } else {
    const bPer = _.floor(_b.scrollTop / bFull, 2)
    _p.scrollTop = _.floor(bPer * pFull, 2)
  }
  clearTimeout(scrollEndPid)
  scrollEndPid = setTimeout(() => {
    scrolling = -1
  }, 50)
}
</script>
<template lang="pug">
.md-editor(:class="{active,disabled,'full-screen':fullScreen}" @keydown.esc="fullScreen = false")
  .toolbar
    .left
      span(@click="surroundText('bold')")
        svg-icon(icon="bold")
      span(@click="surroundText('italic')")
        svg-icon(icon="italic")
      span(@click="surroundText('del')")
        svg-icon(icon="del")
      rk-select(:opts="headList" @update:model-value="e=>rowText(e)")
        span
          svg-icon(icon="head")
      span(@click="rowText('quote')")
        svg-icon(icon="quote")
      span(@click="wrapText('ol')")
        svg-icon(icon="ol")
      span(@click="wrapText('ul')")
        svg-icon(icon="ul")
      span(@click="wrapText('todo')")
        svg-icon(icon="todo")
      span.small(@click="surroundText('code')")
        svg-icon(icon="code")
      span(@click="surroundText('block')")
        svg-icon(icon="block")
      span.mini(@click="insertText('link')")
        svg-icon(icon="link")
      span.small(@click="insertText('img')")
        svg-icon(icon="image")
      rk-select(:opts="emojiList" menu-class="emoji-menu" @update:model-value="e=>insertText('',e)")
        span.small
          svg-icon(icon="emoji")
      span.small(@mouseenter="setTableHover(true)" @mouseleave="setTableHover(false)")
        svg-icon(icon="table")
    .right
      span.small(@click="fullScreen = !fullScreen")
        svg-icon(:icon="fullScreen?'exitFullScreen':'fullScreen'")
  textarea(ref="boardRef" v-model="value" :rows="rows" @keydown.enter="enterHandler" @keydown.tab="tabHandler" @scroll="syncScroll(0)")
  .preview-container(v-if="fullScreen || !active")
    .wrapper(ref="wrapperRef" @click="activeEditor" @scroll="syncScroll(1)")
      preview(:value="value")
    rk-scroll(:get-target="()=>$refs.wrapperRef" :mutation-opt="{childList: true}")
    rk-scroll(:get-target="()=>$refs.wrapperRef" horizontal :mutation-opt="{childList: true}")
  b.table-icon-hover(v-if="tableHover" @mouseenter="setTableHover(true)"  @mouseleave="setTableHover(false)")
    i(v-for="i in 24" :key="i" @click="getTable(i)")
</template>
<style lang="sass" scoped>
.md-editor
  border: 1px solid var(--border-color)
  position: relative
  display: grid
  min-width: 800px
  height: 500px
  width: 100%
  // align-content: start
  grid-template: 'tool tool' auto 'area render' 1fr / 1fr 1fr
  &.disabled > .preview-container
    cursor: revert
  &.active:not(.disabled) > .preview-container
    grid-area: render
    cursor: revert
  &.full-screen
    z-index: var(--z-dialog)
    position: fixed
    left: 0
    top: 0
    width: 100vw
    height: 100vh
    background: var(--bg)
    > textarea
      grid-column-end: area
    > .preview-container
      max-height: unset
  > .toolbar
    grid-area: tool
    display: grid
    grid-auto-flow: column
    line-height: 30px
    justify-content: space-between
    border-bottom: 1px solid var(--border-color)
    span
      font-size: 20px
      text-align: center
      position: relative
      cursor: pointer
      display: flex
      align-items: center
      justify-content: center
      &:hover
        opacity: 0.7
      &.small
        font-size: 14px
      &.mini
        font-size: 12px
    > .left,> .right
      display: grid
      grid-auto-flow: column
      grid-auto-columns: 30px
    > .left > *:not(:last-child)
      border-right: 1px solid var(--border-color)
  > textarea
    grid-area: area
    grid-column-end: render
    width: 100%
    padding: 20px
    color: var(--font-color)
    resize: none
  > .preview-container
    grid-area: render
    grid-column-start: area
    grid-row-start: tool
    cursor: pointer
    border-left: 1px solid var(--border-color)
    position: relative
    height: 100%
    overflow: hidden
    > .wrapper
      background: #fff
      width: 100%
      height: 100%
      overflow: auto
      > .preview
        padding: 20px
        width: 1200px

  .table-icon-hover
    position: absolute
    display: grid
    grid-template-columns: repeat(6, 16px)
    grid-template-rows: repeat(4, 16px)
    padding: 2px
    border: 1px solid var(--border-color)
    background: var(--bg)
    border-radius: 5px
    top: 35px
    left: 360px
    transform: rotate(180deg)
    > i
      padding: 1px
      cursor: pointer
      --bg: #ccc
      &::before
        content: ''
        display: block
        width: 100%
        height: 100%
        border-radius: 3px
        background: var(--bg)
      &:nth-last-of-type(6n)
        &:hover,&:hover ~ i
          --bg: #aaa
      &:nth-last-of-type(6n-5)
        &:hover,&:hover ~ i:not(:nth-of-type(6n-1)):not(:nth-of-type(6n-2)):not(:nth-of-type(6n-3)):not(:nth-of-type(6n-4)):not(:nth-of-type(6n-5))
          --bg: #aaa
      &:nth-last-of-type(6n-4)
        &:hover,&:hover ~ i:not(:nth-of-type(6n-2)):not(:nth-of-type(6n-3)):not(:nth-of-type(6n-4)):not(:nth-of-type(6n-5))
          --bg: #aaa
      &:nth-last-of-type(6n-3)
        &:hover,&:hover ~ i:not(:nth-of-type(6n-3)):not(:nth-of-type(6n-4)):not(:nth-of-type(6n-5))
          --bg: #aaa
      &:nth-last-of-type(6n-2)
        &:hover,&:hover ~ i:not(:nth-of-type(6n-4)):not(:nth-of-type(6n-5))
          --bg: #aaa
      &:nth-last-of-type(6n-1)
        &:hover,&:hover ~ i:not(:nth-of-type(6n-5))
          --bg: #aaa
</style>
<style lang="sass">
.emoji-menu.menu
  line-height: 2
  > ul
    display: grid
    padding-right: 10px
    grid-template-columns: repeat(5,auto)
    > li
      padding: 0 5px
</style>
