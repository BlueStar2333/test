<template>
  <div class="app-container">
    <el-form class="search" label-width="100px" size="small">
      <el-date-picker
        v-model="searchModel.startTime"
        class="date-component"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="选择起始日期"
      />
      <span>-</span>
      <el-date-picker
        v-model="searchModel.endTime"
        class="date-component"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="选择截止日期"
      />
      <el-button icon="el-icon-search" type="primary" @click="getData"
        >查询</el-button
      >
    </el-form>
    <div style="background: #ceeaf3; height: 40px; line-height: 40px">
      <el-row>
        <el-col :span="23" />
        <el-col :span="1">
          <el-tooltip class="item" effect="dark" content="导出" placement="top">
            <i class="el-icon-folder-opened out-icon" @click="handleDownload" />
          </el-tooltip>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="listLoading"
      :header-cell-style="{ 'background-color': '#fefefe', color: '#959595' }"
      border
      :data="
        tableData.slice(
          (listQuery.page - 1) * listQuery.limit,
          listQuery.page * listQuery.limit
        )
      "
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        min-width="120px"
        fiexd
        align="center"
        prop="name"
        label="填报人"
      />
      <el-table-column min-width="120px" align="center" label="填报时间">
        <template slot-scope="scope">
          {{ scope.row.createTime.split("T")[0] }}
        </template>
      </el-table-column>
      <el-table-column
        min-width="220px"
        align="center"
        prop="result.hasInfect"
        label="是否有工作人员出现腹泻症状"
      />
      <el-table-column min-width="120px" align="center" label="腹泻人数">
        <template slot-scope="scope">
          <span
            v-if="scope.row.result.hasInfect === '是'"
            style="color: #f66a6e; font-weight: 600"
          >
            {{ scope.row.result.person.length }}
          </span>
          <span v-else style="color: #666"> 0 </span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" label="腹泻人员详情">
        <template slot-scope="scope">
          <svg-icon
            v-if="scope.row.result.hasInfect === '是'"
            icon-class="person"
            class="person-icon"
            @click="personDetails(scope.row.result.person)"
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="listQuery.page"
      :page-size="listQuery.limit"
      layout="prev, pager, next, jumper"
      :total="tableData.length"
      @current-change="handleCurrentChange"
    />
    <el-dialog :visible.sync="drawer" title="感染人员表" width="70%">
      <el-table
        v-loading="listLoading"
        :header-cell-style="{ 'background-color': '#fefefe', color: '#959595' }"
        :data="selectTable"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="岗位类别：">
                <span v-if="props.row.personnel === '其他'">{{
                  props.row.personnelOccupation
                }}</span>
                <span
                  v-else-if="
                    props.row.personnel === '医生' ||
                    props.row.personnel === '护士' ||
                    props.row.personnel === '技师'
                  "
                  >{{
                    props.row.personnelOccupation +
                    "-" +
                    props.row.personnelPosition
                  }}</span
                >
                <span v-else>{{ props.row.personnel }}</span>
              </el-form-item>
              <el-form-item label="最早出现症状的时间：">
                <span>{{ props.row.appearDate }}</span>
              </el-form-item>
              <el-form-item label="是否腹泻：">
                <span>{{ props.row.isDiarrhea }}</span>
                <span v-if="props.row.isDiarrhea === '有'"
                  >-{{ props.row.diarrheaNumber }}次</span
                >
              </el-form-item>
              <el-form-item
                label="腹泻方式："
                v-if="props.row.isDiarrhea === '有'"
              >
                <span>{{ props.row.diarrhealMode }}</span>
              </el-form-item>
              <el-form-item
                label="粪便量："
                v-if="props.row.isDiarrhea === '有'"
              >
                <span>{{ props.row.fecalVolume }}</span>
              </el-form-item>
              <el-form-item
                label="粪便气味："
                v-if="props.row.isDiarrhea === '有'"
              >
                <span>{{ props.row.fecalSmell }}</span>
              </el-form-item>
              <el-form-item label="是否呕吐：">
                <span>{{ props.row.isVomit }}</span>
              </el-form-item>
              <el-form-item
                label="呕吐方式："
                v-if="props.row.isVomit === '有'"
              >
                <span>{{
                  props.row.vomitingMode === "其他"
                    ? props.row.otherVomitingMode
                    : props.row.vomitingMode
                }}</span>
              </el-form-item>
              <el-form-item label="有以下哪些症状：">
                <span>{{ props.row.symptoms.join() }}</span>
                <span v-if="props.row.symptoms.includes('其他症状')"
                  >-{{ props.row.otherSymptoms }}</span
                >
                <span v-if="props.row.symptoms.includes('发热')"
                  >--{{ props.row.bodyTemperature }}</span
                >
              </el-form-item>
              <el-form-item label="是否送大便常规：">
                <span>{{ props.row.isInspect }}</span>
              </el-form-item>
              <el-form-item
                label="大便常规标本采样时间："
                v-if="props.row.isInspect === '是'"
              >
                <span>{{ props.row.samplingDate }}</span>
              </el-form-item>
              <el-form-item
                label="大便常规检验结果："
                v-if="props.row.isInspect === '是'"
              >
                <span>{{ props.row.testResult }}</span>
              </el-form-item>
              <el-form-item label="是否送大便培养：">
                <span>{{ props.row.isCultivate }}</span>
              </el-form-item>
              <el-form-item
                label="送大便培养前一周是否接受抗生素治疗："
                v-if="props.row.isCultivate === '是'"
              >
                <span>{{
                  props.row.isReceiveAntibioticsT === "是"
                    ? props.row.isReceiveAntibioticsT +
                      "-" +
                      props.row.antibioticsT
                    : "否"
                }}</span>
              </el-form-item>
              <el-form-item
                label="大便培养标本采样时间："
                v-if="props.row.isCultivate === '是'"
              >
                <span>{{ props.row.samplingDateT }}</span>
              </el-form-item>
              <el-form-item
                label="大便常规检验结果："
                v-if="props.row.isCultivate === '是'"
              >
                <span>{{ props.row.testResultT }}</span>
              </el-form-item>
              <el-form-item label="是否送血常规：">
                <span>{{ props.row.isBloodRoutineExamination }}</span>
              </el-form-item>
              <el-form-item
                label="血常规采样时间："
                v-if="props.row.isBloodRoutineExamination === '是'"
              >
                <span>{{ props.row.BloodRoutineExaminationDate }}</span>
              </el-form-item>
              <el-form-item
                label="大便常规检验结果："
                v-if="props.row.isBloodRoutineExamination === '是'"
              >
                <span>{{ props.row.BREResult }}</span>
              </el-form-item>
              <el-form-item label="本次腹泻是否怀疑与进食高风险食物有关：">
                <span>{{
                  props.row.isHighRiskFood === "是"
                    ? props.row.isHighRiskFood + "-" + props.row.whatFood
                    : "否"
                }}</span>
              </el-form-item>
              <el-form-item
                label="高风险食物制作地点："
                v-if="props.row.isHighRiskFood === '是'"
              >
                <span>{{ props.row.productionLocation }}</span>
              </el-form-item>
              <el-form-item
                label="出现症状前三天至今的共同进食者是否有相同症状："
              >
                <span>{{
                  props.row.communalFeeding === "有"
                    ? props.row.communalFeeding +
                      "-" +
                      props.row.communalFeedingNumber +
                      "人"
                    : props.row.communalFeeding
                }}</span>
              </el-form-item>
              <el-form-item label="接触的非共同进餐者是否有相同的症状：">
                <span>{{
                  props.row.identicalSymptom === "有"
                    ? "有-" + props.row.identicalSymptomNumber + "人"
                    : "无"
                }}</span>
              </el-form-item>
              <el-form-item label="目前症状是否已消失或好转：">
                <span>{{ props.row.isDone }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name"> </el-table-column>
        <el-table-column label="护理单元" prop="nursingUnit"> </el-table-column>
        <el-table-column label="年龄" prop="age"> </el-table-column>
        <el-table-column label="电话" prop="telephone"> </el-table-column>
        <el-table-column label="胸牌号" prop="brandNumber"> </el-table-column>
      </el-table>
    </el-dialog>
    <el-table
      hidden
      class="tableData"
      v-loading="listLoading"
      :header-cell-style="{ 'background-color': '#fefefe', color: '#959595' }"
      :data="tableData2"
      style="width: 100%"
    >
      <el-table-column prop="pName" label="填报人" />
      <el-table-column label="填报时间">
        <template slot-scope="scope">
          {{ scope.row.cTime.split("T")[0] }}
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span>
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="护理单元">
        <template slot-scope="scope">
          <span>
            {{ scope.row.nursingUnit }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="年龄">
        <template slot-scope="scope">
          <span>
            {{ scope.row.age }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="电话">
        <template slot-scope="scope">
          <span>
            {{ scope.row.telephone }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="胸牌号">
        <template slot-scope="scope">
          <span>
            {{ scope.row.brandNumber }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="岗位类别">
        <template slot-scope="scope">
          <span>
            <span v-if="scope.row.personnel === '其他'">{{
              scope.row.personnelOccupation
            }}</span>
            <span
              v-else-if="
                scope.row.personnel === '医生' ||
                scope.row.personnel === '护士' ||
                scope.row.personnel === '技师'
              "
              >{{
                scope.row.personnelOccupation +
                "-" +
                scope.row.personnelPosition
              }}</span
            >
            <span v-else>{{ scope.row.personnel }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="最早出现症状的时间">
        <template slot-scope="scope">
          <span>{{ scope.row.appearDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否腹泻">
        <template slot-scope="scope">
          <span>{{ scope.row.isDiarrhea }}</span>
          <span v-if="scope.row.isDiarrhea === '有'"
            >-{{ scope.row.diarrheaNumber }}次</span
          >
        </template>
      </el-table-column>
      <el-table-column label="腹泻方式">
        <template slot-scope="scope">
          <span>{{ scope.row.diarrhealMode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="粪便量">
        <template slot-scope="scope">
          <span>{{ scope.row.fecalVolume }}</span>
        </template>
      </el-table-column>
      <el-table-column label="粪便气味">
        <template slot-scope="scope">
          <span>{{ scope.row.fecalSmell }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否呕吐">
        <template slot-scope="scope">
          <span>{{ scope.row.isVomit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="呕吐方式">
        <template slot-scope="scope">
          <span>{{
            scope.row.vomitingMode === "其他"
              ? scope.row.otherVomitingMode
              : scope.row.vomitingMode
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有以下哪些症状">
        <template slot-scope="scope">
          <span>{{ scope.row.symptoms.join() }}</span>
          <span v-if="scope.row.symptoms.includes('其他症状')"
            >-{{ scope.row.otherSymptoms }}</span
          >
          <span v-if="scope.row.symptoms.includes('发热')"
            >--{{ scope.row.bodyTemperature }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="是否送大便常规">
        <template slot-scope="scope">
          <span>{{ scope.row.isInspect }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大便常规标本采样时间">
        <template slot-scope="scope">
          <span>{{ scope.row.samplingDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大便常规检验结果">
        <template slot-scope="scope">
          <span>{{ scope.row.testResult }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否送大便培养">
        <template slot-scope="scope">
          <span>{{ scope.row.isCultivate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="送大便培养前一周是否接受抗生素治疗">
        <template slot-scope="scope">
          <span>{{
            scope.row.isReceiveAntibioticsT === "是"
              ? scope.row.isReceiveAntibioticsT + "-" + scope.row.antibioticsT
              : "否"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大便培养标本采样时间">
        <template slot-scope="scope">
          <span>{{ scope.row.samplingDateT }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大便常规检验结果">
        <template slot-scope="scope">
          <span>{{ scope.row.testResultT }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否送血常规">
        <template slot-scope="scope">
          <span>{{ scope.row.isBloodRoutineExamination }}</span>
        </template>
      </el-table-column>
      <el-table-column label="血常规采样时间">
        <template slot-scope="scope">
          <span>{{ scope.row.BloodRoutineExaminationDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大便常规检验结果">
        <template slot-scope="scope">
          <span>{{ scope.row.BREResult }}</span>
        </template>
      </el-table-column>
      <el-table-column label="本次腹泻是否怀疑与进食高风险食物有关">
        <template slot-scope="scope">
          <span>{{
            scope.row.isHighRiskFood === "是"
              ? scope.row.isHighRiskFood + "-" + scope.row.whatFood
              : "否"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="高风险食物制作地点">
        <template slot-scope="scope">
          <span>{{ scope.row.productionLocation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出现症状前三天至今的共同进食者是否有相同症状">
        <template slot-scope="scope">
          <span>{{
            scope.row.communalFeeding === "有"
              ? scope.row.communalFeeding +
                "-" +
                scope.row.communalFeedingNumber +
                "人"
              : scope.row.communalFeeding
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接触的非共同进餐者是否有相同的症状">
        <template slot-scope="scope">
          <span>{{
            scope.row.identicalSymptom === "有"
              ? "有-" + scope.row.identicalSymptomNumber + "人"
              : "无"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目前症状是否已消失或好转">
        <template slot-scope="scope">
          <span>{{ scope.row.isDone }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { getDiarrheaSurveyData } from "@/api/diarrhea";

export default {
  name: "HealthEducation",
  components: {
    Pagination,
  },
  data() {
    return {
      tableData2: [],
      searchModel: {
        startTime: "",
        endTime: "",
        hospitalCode: this.$store.state.user.userInfo.hospitalCode,
      },
      listLoading: true,
      total: 60,
      listQuery: {
        page: 1,
        limit: 10,
        sort: "+id",
      },
      tableData: [],
      drawer: false,
      selectTable: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    handleCurrentChange(page) {
      this.listQuery.page = page;
    },
    getData() {
      this.tableData = [];
      getDiarrheaSurveyData(this.searchModel).then((res) => {
        switch (this.$store.state.user.userInfo.Power) {
          case 3:
            this.tableData = JSON.parse(res.d);
            break;
          default:
            JSON.parse(res.d).forEach((v) => {
              if (
                JSON.parse(v.result).person[0].administrativeOffice ===
                this.$store.state.user.userInfo.Department
              ) {
                this.tableData.push(v);
              }
            });
            break;
        }
        this.tableData.forEach((item, index) => {
          item.result = JSON.parse(item.result);
        });
        const table = [];
        for (let i = 0; i < this.tableData.length; i++) {
          for (let j = 0; j < this.tableData[i].result.person.length; j++) {
            this.tableData[i].result.person[j].cTime =
              this.tableData[i].createTime;
            this.tableData[i].result.person[j].pName = this.tableData[i].name;
            table[table.length] = this.tableData[i].result.person[j];
          }
        }
        this.tableData2 = table;
      });
      this.listLoading = false;
    },
    personDetails(person) {
      this.selectTable = person;
      // console.log(this.selectTable, 2245)
      this.drawer = true;
    },
    otherReplace(arr, item) {
      const newArr = arr;
      newArr.pop();
      newArr.push(item);
      return newArr;
    },

    handleDownload() {
      this.$nextTick(function () {
        var wb = XLSX.utils.table_to_book(document.querySelector(".tableData"));
        /* 获取二进制字符串作为输出 */
        var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array",
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            "腹泻调查表.xlsx"
          );
        } catch (e) {}
        return wbout;
      });
    },
    formatJson(filterVal) {
      return this.tableData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },

    sortChange(data) {
      const { prop, order } = data;
      this.tableData.reverse();
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  background-color: #fff;
}

.search {
  padding: 20px 0;

  .date-component {
    margin: 10px;
  }
}

.add-button {
  position: absolute;
  left: 10px;
  z-index: 2;
}

.out-icon {
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 12px;
}

.person-icon {
  font-size: 22px;
  cursor: pointer;
  fill: #5799fb;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
