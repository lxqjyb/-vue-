<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!--  @tab-click="handleClick" -->
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visit"></el-tab-pane>
        </el-tabs>
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <!--  v-model="value1" -->
          <el-date-picker
            v-model="date"
            class="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-row>
          <el-col :span="18">
            <div class="chart" ref="chart"></div>
          </el-col>
          <el-col :span="6">
            <h3>门店{{title}}排名</h3>
            <ul>
              <li>
                <span class="rindex">1</span>
                <span class="rcenter">肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex">2</span>
                <span class="rcenter">麦当劳</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex">3</span>
                <span class="rcenter">肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex1">4</span>
                <span class="rcenter">肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex1">5</span>
                <span class="rcenter">肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex1">6</span>
                <span class="rcenter">肯德基</span>
                <span class="rvalue">123456</span>
              </li>
              <li>
                <span class="rindex1">7</span>
                <span class="rcenter">肯德基</span>
                <span class="rvalue">123456</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      echart:null,
      date:[]
    };
  },
  computed:{
    title(){
      return this.activeName==="sale"?'销售额':'访问量';
    }
  },
  watch:{
    title(){
      this.echart.setOption({
        title:{
          text:`${this.title}趋势`
        }
      })
    }
  },
  mounted() {
    this.echart = echarts.init(this.$refs.chart);
    this.echart.setOption({
      title:{
        text:'销售额趋势'
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月","8月","9月","10月","11月","12月"],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220,66,99,77,88,100],
        },
      ],
    });
  },
  methods:{
    setDay(){
      const day = dayjs().format('YYYY-MM-DD');
      this.date=[day,day];
    },
    setWeek(){
      const start = dayjs().day(1).format('YYYY-MM-DD');
      const end = dayjs().day(7).format('YYYY-MM-DD');
      this.date=[start,end];
    },
    setMonth(){
      const start = dayjs().startOf('month').format('YYYY-MM-DD');
      const end = dayjs().endOf('month').format('YYYY-MM-DD');
      this.date=[start,end];
    },
    setYear(){
      const start = dayjs().startOf('year').format('YYYY-MM-DD');
      const end = dayjs().endOf('year').format('YYYY-MM-DD');
      this.date=[start,end];
    }
  }
};
</script>

<style scoped>
  .clearfix {
    display: flex;
    justify-content: space-between;
    position: relative;
  }
  .tab {
    width: 100%;
  }
  .right {
    position: absolute;
    right: 0;
  }
  .date {
    width: 230px;
    margin: 0 20px;
  }
  .right span {
    margin: 0 10px;
  }
  .chart {
    width: 100%;
    height: 300px;
  }
  ul{
    list-style: none;
    width: 100%;
    padding: 0;
    /* height: 300px; */
  }
  ul li{
    height: 8%;
    margin: 15px 0;
  }
  .rindex{
    float: left;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: black;
    color: white;
    text-align: center;
  }
  .rindex1{
    padding:5px;
  }
  .rcenter{
    margin-left:25px;
  }
  .rvalue{
    float: right;
  }
</style>
