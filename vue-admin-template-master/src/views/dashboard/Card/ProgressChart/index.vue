<template>
  <div class="chart" ref="chart"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "ProgressChart",
  mounted() {
    // 初始化echarts实例
    let lineChart = echarts.init(this.$refs.chart);
    // 配置数据
    lineChart.setOption({
      // x轴
      xAxis: {
        // 隐藏x轴
        show: false,
        // 最大值与最小值
        min:0,
        max:100
      },
      // y轴
      yAxis: {
        show: false,
        // 均分
        type: "category",
      },
      // 系列
      series: [
        {
          type:'bar',
          data:[78],
          // 柱状图的宽度
          barWidth:10,
          color:'yellowgreen',
          // 柱状图背景颜色的设置
          showBackground:true,
          backgroundStyle:{
            color:'#eee'
          },
          // 文本
          label:{
            show:true,
            // 改变文本内容
            formatter:'|',
            // 文本标签位置的调试
            position:'right'
          }
        }
      ],
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style>
.chart {
  width: 100%;
  height: 100%;
}
</style>