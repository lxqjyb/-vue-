<template>
  <div>
    <el-row>
      <el-col :span="6">
        <Detail title="总销售额" count="￥126560">
            <template slot="charts">
                <span>周同比 56.67%</span>
                <svg t="1665149551556" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4370" width="18" height="18"><path d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z" fill="#d81e06" p-id="4371"></path></svg>
                <span>日同比 19.16%</span>
               <svg t="1665149511139" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2885" width="18" height="18"><path d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z" fill="#595BB3" p-id="2886"></path></svg>
            </template>
            <template slot="footer">
                <span>日销售额 ￥12423</span>
            </template>
        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="访问量" count="88460">
            <template slot="charts">
              <LineChart></LineChart>
            </template>
            <template slot="footer">
                <span>日访问量 1234</span>
            </template>
        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="支付笔数" count="56749">
              <template slot="charts">
                <BarChart></BarChart>
            </template>
            <template slot="footer">
                <span>转化率65%</span>
            </template>
        </Detail>
      </el-col>
      <el-col :span="6">
        <Detail title="运营活动效果" count="78%">
            <template slot="charts">
                <ProgressChart></ProgressChart>
            </template>
            <template slot="footer">
                <span>周同比 12%</span>
                <svg t="1665149551556" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4370" width="18" height="18"><path d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z" fill="#d81e06" p-id="4371"></path></svg>
                <span>日同比 11%</span>
               <svg t="1665149511139" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2885" width="18" height="18"><path d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z" fill="#595BB3" p-id="2886"></path></svg>
            </template>
        </Detail>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import LineChart from './LineChart';
import BarChart from './BarChart';
import ProgressChart from './ProgressChart';
export default {
  name: "Card",
  components: {
    Detail,
    LineChart,
    BarChart,
    ProgressChart
  },
};
</script>

<style>
</style>