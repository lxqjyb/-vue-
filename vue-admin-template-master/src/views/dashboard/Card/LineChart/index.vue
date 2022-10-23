<template>
  <div class="chart" ref="chart"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "LineChart",
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
          type: "line",
          data: [20, 10, 5, 32, 8],
          // 拐点的样式设置
          itemStyle: {
            opacity: 0,
          },
          // 线条的颜色
          lineStyle: {
            color: "purple",
          },
          // 填充颜色的设置
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        //   拐点的弧度
          smooth:true,
        },
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