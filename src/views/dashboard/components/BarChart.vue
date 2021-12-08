<template>
  <div
    ref="main"
    :class="className"
    :style="{ width: width, height: height }"
  ></div>
</template>
<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'
export default {
  mixins: {resize},
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    xAxisData: { //x轴显示的数据
      type: Array,
      default: () => ['2022-01', '2022-04', '2022-02', '2022-08', '2022-03', '2022-06']
    },
    seriesData: { //饼状图的接受的数据
      type: Array,
      default: () => [10, 52, 200, 334, 390, 330, 220]
    }
  },

  data () {
    return {
      chart: null
    }
  },

  mounted () {
    //当加载dom后，会调用this.initChart() 来进行初始化echarts实例
    this.$nextTick(() => {
      this.initChart()
    })
  },
  //当组件销毁之前会调用此钩子
  beforeDestroy () {
    if (!this.chart) {
      return
    } else {
      //注销实例
      this.chart.dispose()
      this.chart = null
    }
  },

  methods: {
    initChart () {
      this.chart = echarts.init(this.$refs.main, 'macarons')
      this.chart.setOption({
        title: {
          text: '近六个月发布的文章数',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.xAxisData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.seriesData
          }
        ]
      })
    }
  }
}
</script>