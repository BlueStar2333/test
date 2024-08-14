<template>
  <div class="container" style="padding: 40px 30px">
    <DataBlock />
    <el-row style="background: #fff; padding: 16px 10px 0; margin-bottom: 32px">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <!--    <el-row :gutter="32">-->
    <!--      <el-col :xs="24" :sm="24" :lg="8">-->
    <!--        <div class="chart-wrapper">-->
    <!--          <raddar-chart />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--      <el-col :xs="24" :sm="24" :lg="8">-->
    <!--        <div class="chart-wrapper">-->
    <!--          <pie-chart />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--      <el-col :xs="24" :sm="24" :lg="8">-->
    <!--        <div class="chart-wrapper">-->
    <!--          <bar-chart />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
  </div>
</template>

<script>
import DataBlock from "@/pages/home/components/data-block";
import LineChart from "./components/LineChart";
import RaddarChart from "./components/RaddarChart";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import { getLineChartData } from "@/api/home";

const lineChartData = {
  newVisitis: {
    fluidExposure: [100, 120, 161, 134, 105, 160, 165],
    sharpsInjury: [120, 82, 91, 154, 162, 140, 145],
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130],
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130],
  },
};
export default {
  components: {
    DataBlock,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
  },
  data() {
    return {
      lineChartData: {
        fluidExposure: [100, 120, 161, 134, 105, 160, 165],
        sharpsInjury: [120, 82, 91, 154, 162, 140, 145],
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const dates = this.getPastSevenDays();
      // console.log(dates, 4457)
      dates.hospitalCode = this.$store.state.user.userInfo.hospitalCode;
      getLineChartData(dates).then((res) => {
        res = JSON.parse(res.d);
        // console.log(res,321)
        this.lineChartData.fluidExposure = res.slice(0, 7);
        this.lineChartData.fluidExposure.forEach((item, index) => {
          this.lineChartData.fluidExposure[index] = item.allData;
        });
        this.lineChartData.sharpsInjury = res.slice(7);
        this.lineChartData.sharpsInjury.forEach((item, index) => {
          this.lineChartData.sharpsInjury[index] = item.allData;
        });
        // console.log(res,this.lineChartData,321)
      });
      this.lineChartData = lineChartData.newVisitis;
    },
    getPastSevenDays() {
      const dates = {};
      const sevenArr = ["seven", "six", "five", "four", "three", "two", "one"];
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        let month = "" + (d.getMonth() + 1);
        let day = "" + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) {
          month = "0" + month;
        }
        if (day.length < 2) {
          day = "0" + day;
        }

        dates[sevenArr[i]] = [year, month, day].join("-");
      }
      return dates;
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
