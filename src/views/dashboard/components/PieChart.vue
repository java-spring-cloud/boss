<template>
  <div
    ref="main"
    :class="className"
    :style="{ height: height, width: width }"
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
    legendData: {
      type: Array,
      default: () => ['前端', 'Java', '移动端', '大数据']
    },
    seriesData: { //饼状图的接受的数据
      type: Array,
      default: () => [
        { value: 100, name: '前端' },
        { value: 200, name: 'Java' },
        { value: 500, name: '移动端' },
        { value: 300, name: '大数据' },
      ]
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
    //关于图标的初始化配置
    initChart () {
      this.chart = echarts.init(this.$refs.main)
      this.chart.setOption({
        title: {
          text: '各技术频道文章统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.legendData
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            data: this.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  }
}
</script>