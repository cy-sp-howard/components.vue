<script lang="ts">
import _ from 'lodash'
import { useWebStore } from '@/stores/web'
import useAnchorObserver from '@/utils/useAnchorObserver'
import { type VNode, h, onMounted, nextTick, Teleport, Transition, ref, reactive } from 'vue'

export default {
  props: {
    class: {
      default: undefined,
      validator() {
        return true
      },
    },
    text: {
      required: true,
      type: String,
    },
    anchorY: {
      default: 'top',
      type: String,
    },
    anchorX: {
      default: 'right',
      type: String,
    },
    to: {
      default: 'body',
      type: String,
    },
    z: {
      default: 1,
      type: Number,
    },
  },
  setup(props, ctx) {
    const { triggerAnchor } = useAnchorObserver(
      () => {
        return slotNode?.el
      },
      setPos,
      () => show.value,
      () => {
        closeText()
        selfClose()
      },
    )

    let slotNode: VNode | null = null
    const defaultStyle = {
      top: 'unset',
      left: 'unset',
      bottom: 'unset',
      right: 'unset',
      height: 'unset',
      width: 'unset',
    }

    let mouseInTip = false
    let gotCloseEvent = false
    const webStore = useWebStore()
    const show = ref(false)
    const tipStyle = reactive(_.clone(defaultStyle))
    const overflowState = reactive({
      left: false,
      top: false,
      right: false,
      bottom: false,
    })

    function setPos(rect: DOMRectReadOnly) {
      _.assign(tipStyle, defaultStyle)
      const { left, right, top, height } = rect
      if (props.anchorX === 'left' && !overflowState.left) {
        tipStyle.left = left + 'px'
      } else {
        const rightRange = webStore.size.vw - right
        tipStyle.right = rightRange + 'px'
      }
      if (props.anchorY === 'bottom' && !overflowState.bottom) {
        tipStyle.top = top + height + 'px'
      } else {
        const bottomRange = webStore.size.vh - top
        tipStyle.bottom = bottomRange + 'px'
      }
    }
    function showText() {
      mouseInTip = false
      gotCloseEvent = false
      show.value = true
      triggerAnchor()
      nextTick(() => {
        if (checkOverflow()) triggerAnchor()
      })
    }
    function checkOverflow() {
      const el = slotNode?.el
      if (!(el instanceof HTMLElement)) return
      const { left, right, top, bottom } = el.getBoundingClientRect()
      overflowState.left = left < 0
      overflowState.top = top < 0
      overflowState.bottom = bottom > webStore.size.vh
      overflowState.right = right > webStore.size.vw
      return overflowState.left || overflowState.top || overflowState.bottom || overflowState.right
    }
    function selfClose() {
      mouseInTip = false
      if (gotCloseEvent === true) {
        show.value = false
      }
    }
    function closeText() {
      setTimeout(() => {
        if (mouseInTip) {
          gotCloseEvent = true
        } else {
          show.value = false
          overflowState.left = false
          overflowState.top = false
          overflowState.bottom = false
          overflowState.right = false
        }
      }, 100)
    }

    onMounted(() => {
      nextTick(triggerAnchor)
    })
    return () => {
      const vnodes = []
      if (ctx.slots.default) {
        const slots = ctx.slots.default({ showText, closeText })
        if (slots.length) {
          slotNode = slots[0]
          vnodes.push(slotNode)
        }

        const ary: VNode[] = []
        if (show.value) {
          ary.push(
            h(
              'pre',
              {
                class: [props.class, 'rk-tip'],
                style: tipStyle,
                onMouseenter() {
                  mouseInTip = true
                },
                onMouseleave: selfClose,
              },
              props.text,
            ),
          )
        }

        const tip = h(
          Teleport,
          { to: props.to },
          h(
            Transition,
            { name: 'fade', appear: true },
            {
              default() {
                return ary
              },
            },
          ),
        )

        vnodes.push(tip)
      }
      return vnodes
    }
  },
}
</script>
<style lang="sass" scoped>
.rk-tip
  position: absolute
  background: var(--bg)
  border-radius: 3px
  margin: 0
  padding: 5px 20px
  box-shadow: 0 0 0 1px var(--border-color)
  font-size: 14px
  max-width: 50vw
  max-height: 50vw
  z-index: v-bind(z)
  white-space: pre-wrap
</style>
