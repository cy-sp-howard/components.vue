import * as echarts from 'echarts/core'
import { BarChart, type BarSeriesOption, LineChart, type LineSeriesOption } from 'echarts/charts'
import {
  TooltipComponent,
  type TooltipComponentOption,
  GridComponent,
  type GridComponentOption,
  LegendComponent,
  type LegendComponentOption,
  DataZoomComponent,
  type DataZoomComponentOption,
  VisualMapComponent,
  type VisualMapComponentOption,
} from 'echarts/components'
import { MapChart, type MapSeriesOption } from 'echarts/charts'
import dark from '@/assets/json/chartDarkTheme.json'
import { SVGRenderer } from 'echarts/renderers'
import { onBeforeUnmount, watch } from 'vue'
import { useWebStore } from '@/stores/web'
import _ from 'lodash'

type ECOption = echarts.ComposeOption<
  | TooltipComponentOption
  | BarSeriesOption
  | LineSeriesOption
  | LegendComponentOption
  | GridComponentOption
  | DataZoomComponentOption
  | MapSeriesOption
  | VisualMapComponentOption
>
echarts.use([
  LineChart,
  TooltipComponent,
  GridComponent,
  BarChart,
  LegendComponent,
  SVGRenderer,
  DataZoomComponent,
  MapChart,
  VisualMapComponent,
])
echarts.registerTheme('dark', dark)

export default function () {
  const charts: ChartWrapper[] = []
  const webStore = useWebStore()

  watch(
    () => webStore.size,
    () => {
      _.each(charts, i => i.chart?.resize())
    },
    { deep: true },
  )
  watch(
    () => webStore.theme,
    (ni, oi) => {
      if (ni !== oi) {
        _.each(charts, i => {
          i.remount()
        })
      }
    },
  )

  function initChart() {
    const chart = new ChartWrapper()
    charts.push(chart)
    return chart
  }

  onBeforeUnmount(() => {
    _.each(charts, i => i.chart?.dispose())
  })
  return { initChart }
}

class ChartWrapper {
  private _chart?: ReturnType<typeof echarts.init>
  private lastOpts?: ECOption
  private el?: HTMLElement

  get chart() {
    return this._chart
  }
  remount() {
    if (!this.el || !this._chart) return
    this._chart.dispose()
    this._chart = undefined
    this.mount(this.el)
    if (!this.lastOpts) return
    this.update(this.lastOpts)
  }
  mount(el: HTMLElement) {
    if (this._chart) return
    const webStore = useWebStore()
    this.el = el
    this._chart = echarts.init(el, webStore.theme ? undefined : 'dark')
  }
  update(opts: ECOption) {
    if (!this._chart) return
    this.lastOpts = opts
    this._chart.setOption(opts)
  }
}
