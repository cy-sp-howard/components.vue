<script lang="ts" setup></script>
<template lang="pug">
rk-select.label-selector(tag="span")
  template(#default="{label}")
    span {{ label }}
    svg-icon(icon='down')
</template>
<style lang="sass" scoped>
.label-selector
  &:hover
    color: var(--color-1)
  > span
    grid-area: 1 / 1 / span 1 / span 1
    justify-self: flex-end
    position: relative
    padding-right: 20px
    &::before
      content: ''
      position: absolute
      bottom: 0
      left: 0
      width: 100%
      height: 1px
      background: currentColor
  > svg
    grid-area: 1 / 1 / span 1 / span 1
    align-self: center
    justify-self: flex-end
</style>
