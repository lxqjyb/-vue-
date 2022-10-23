<template>
  <div class="chart" ref="chart"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "BarChart",
  mounted() {
    // 初始化echarts实例
    let lineChart = echarts.init(this.$refs.chart);
    // 配置数据
    lineChart.setOption({
      // x轴
      xAxis: {
        // 隐藏x轴
        show: false,
        // 均分
        type: "category",
      },
      // y轴
      yAxis: {
        show: false,
      },
      // 系列
      series: [
        {
          type:'bar',
          data:[33,22,55,77,66,10,5,32,88,44,33,22]
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