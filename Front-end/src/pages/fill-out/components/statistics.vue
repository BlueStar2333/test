<template>
  <div>
    <el-form class="search" label-width="100px" size="small">
      <el-date-picker
        v-model="searchForm.date"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      />
      <el-select v-model="searchForm.fields" multiple collapse-tags style="margin: 0 20px;width: 180px" placeholder="聚合查询字段" clearable>
        <el-option v-for="(item, index) in fieldsOption" :key="item" :label="item" :value="index" />
      </el-select>
      <el-button
        icon="el-icon-search"
        type="primary"
        plain
        @click="searchStatisticsDate(false)"
      >查询</el-button>
      <el-link
        icon="el-icon-refresh"
        type="primary"
        plain
        style="float: right"
        @click="showPie = !showPie, showDis = !showDis"
      >切换图表</el-link>
      <el-button v-if="this.$store.state.user.userInfo.power === 0" size="small" type="primary" style="float: right" icon="el-icon-document" plain @click="editFillIn(diyTable, '新增')">添加</el-button>
    </el-form>

    <div class="table-pie" style="height: calc(100vh - 180px)">
      <el-table
        :data="drawerData"
        height="100%"
        style="width: 40%;margin-right: 1%;overflow: auto"
      >
        <el-table-column label="姓名">
          <template slot-scope="scope">
            {{ scope.row.written_by.slice(2) }}
          </template>
        </el-table-column>
        <el-table-column :label="tableName + '填报总数:' + tableLength">
          <el-table-column prop="await_count" label="待校验" />
          <el-table-column prop="correct_count" label="正确" />
          <el-table-column prop="mistake_count" label="错误" />
          <el-table-column prop="uncompleted_count" label="未校验" />
          <el-table-column prop="total" label="总计" />
        </el-table-column>
      </el-table>
      <div style="width: 56%;position: relative">
        <transition name="scale">
          <div v-show="showPie" id="main" style="width: 100%;height: calc(100vh - 180px);position: absolute" />
        </transition>
        <transition name="scale">
          <div v-show="showDis" id="discounting" style="width: 100%;height: calc(100vh - 180px);position: absolute" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import { getDrawerNumData, getGraphicData, getBrokenLineData, sysTest } from '@/api/fillout'
import * as echarts from 'echarts'
import { getTestData } from './test'
import { getTestData2 } from './test2'

export default {
  name: 'Statistics',
  props: ['tableName', 'tableLength', 'fieldsOption'],
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近三天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      searchForm: {
        date: '',
        fields: []
      },
      showPie: true,
      showDis: true,
      drawerData: [],
      chartDom: '',
      myChart: '',
      option: {},
      chartDomD: '',
      myChartD: '',
      optionD: {},
      form_id: ''
    }
  },
  mounted() {
    this.chartDom = document.getElementById('main')
    this.myChart = echarts.init(this.chartDom)

    this.chartDomD = document.getElementById('discounting')
    this.myChartD = echarts.init(this.chartDomD)
  },
  methods: {
    getData(data) {
      // 进入页面初始执行
      this.form_id = data.form_id
      this.showPie = true
      this.showDis = true
      this.searchStatisticsDate(true)
    },
    searchStatisticsDate(first) {
      const data = {
        form_id: this.form_id,
        startDate: '',
        endDate: '',
        fields: this.searchForm.fields
      }
      if (this.searchForm.date) {
        data.startDate = new Date(this.searchForm.date[0])
        data.endDate = new Date(this.searchForm.date[1])
      }
      if (this.searchForm.fields.length === 0) {
        this.fieldsOption.forEach((item, index) => {
          data.fields.push(index)
        })
      }
      getGraphicData(data).then(res => {
        if (res.code === 1) {
          // 表格和饼图折线图数据
          this.drawerData = res.data
          this.getEcharts()
          getBrokenLineData(data).then(res => {
            if (res.code === 1) {
              this.getEchartsD(res.data)
              // 初次渲染完成后隐藏
              if (first) {
                this.showDis = false
              }
            }
          })
        }
      })
    },
    getEcharts() {
      const _self = this
      const sourceData = [['product', '待校验', '正确', '错误', '未校验', '总计']]
      const seriesData = []
      this.drawerData.forEach(item => {
        sourceData.push([item.written_by.slice(2), item.await_count, item.correct_count, item.mistake_count, item.uncompleted_count, item.total])
        seriesData.push({
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row',
          emphasis: { focus: 'series' }
        })
      })

      setTimeout(function() {
        _self.option = {
          legend: {},
          tooltip: {
            trigger: 'axis',
            showContent: false
          },
          dataset: {
            // source: [
            //   ['product', '待校验', '正确', '错误', '未校验', '总计', '2017'],
            //   ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
            //   ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
            //   ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
            //   ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
            // ]
            source: sourceData
          },
          xAxis: { type: 'category' },
          yAxis: { gridIndex: 0 },
          grid: { top: '55%' },
          series: [
            ...seriesData,
            {
              type: 'pie',
              id: 'pie',
              radius: '32%',
              center: ['50%', '30%'],
              emphasis: {
                focus: 'self'
              },
              label: {
                formatter: '{b}: {@总计} ({d}%)'
              },
              encode: {
                itemName: 'product',
                value: '总计',
                tooltip: '总计'
              }
            }
          ]
        }
        _self.myChart.on('updateAxisPointer', function(event) {
          const xAxisInfo = event.axesInfo[0]
          if (xAxisInfo) {
            const dimension = xAxisInfo.value + 1
            _self.myChart.setOption({
              series: {
                id: 'pie',
                label: {
                  formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                },
                encode: {
                  value: dimension,
                  tooltip: dimension
                }
              }
            })
          }
        })
        _self.myChart.setOption(_self.option, true)
      }, 0)

      _self.option && _self.myChart.setOption(_self.option, true)
    },
    getEchartsD(resData) {
      const _self = this
      // const data = getTestData2()
      const data = [['Income', 'Life Expectancy', 'Population', 'Country', 'Year']].concat(resData.resultArray)
      if (resData.resultArray.length > 1) {
        run(data)
      } else {
        return
      }

      function run(_rawData) {
        // var countries = ['Australia', 'Canada', 'China', 'Cuba', 'Finland', 'France', 'Germany', 'Iceland', 'India', 'Japan', 'North Korea', 'South Korea', 'New Zealand', 'Norway', 'Poland', 'Russia', 'Turkey', 'United Kingdom', 'United States'];
        // const countries = ['Finland', 'France', 'Germany', 'Iceland', 'Norway', 'Poland', 'Russia', 'United Kingdom']
        const countries = resData.peoples
        const datasetWithFilters = []
        const seriesList = []
        echarts.util.each(countries, function(country) {
          var datasetId = 'dataset_' + country
          datasetWithFilters.push({
            id: datasetId,
            fromDatasetId: 'dataset_raw',
            transform: {
              type: 'filter',
              config: {
                and: [
                  // { dimension: 'Year', gte: _rawData[1][4] },
                  { dimension: 'Year', gte: 15 },
                  { dimension: 'Country', '=': country }
                ]
              }
            }
          })
          seriesList.push({
            type: 'line',
            datasetId: datasetId,
            showSymbol: false,
            name: country,
            endLabel: {
              show: true,
              formatter: function(params) {
                return params.value[3] + ': ' + params.value[0]
              }
            },
            labelLayout: {
              moveOverlap: 'shiftY'
            },
            emphasis: {
              focus: 'series'
            },
            encode: {
              x: 'Year',
              y: 'Income',
              label: ['Country', 'Income'],
              itemName: 'Year',
              tooltip: ['Income']
            }
          })
        })
        _self.optionD = {
          animationDuration: 10000,
          dataset: [
            {
              id: 'dataset_raw',
              source: _rawData
            },
            ...datasetWithFilters
          ],
          title: {
            text: 'Number of forms entered in a single day'
          },
          tooltip: {
            order: 'valueDesc',
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            nameLocation: 'middle'
          },
          yAxis: {
            name: 'Forms'
          },
          grid: {
            right: 140
          },
          series: seriesList
        }
        setTimeout(function() {
          _self.myChartD.setOption(_self.optionD, true)
        }, 0)
      }

      _self.optionD && _self.myChartD.setOption(_self.optionD, true)
    }
  }
}
</script>

<style scoped>

  .search {
    padding: 20px 0;
    margin: 8px;
  }
  .table-pie {
    display: flex;
    justify-content: space-around;
    margin-left: 8px;
  }
  /* 定义过渡类 */
  .scale-enter-active, .scale-leave-active {
    transition: transform 1s, opacity 1s;
    transform-origin: center; /* 从中心缩放 */
  }

  .scale-enter, .scale-leave-to /* .scale-leave-active 在 Vue 2.1.8+ 中 */ {
    transform: scale(0); /* 缩小到 0 */
    opacity: 0; /* 完全透明 */
  }

  .scale-enter-to, .scale-leave {
    transform: scale(1); /* 放大到 1 */
    opacity: 1; /* 完全不透明 */
  }
</style>
