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
        label="是否有工作人员出现流感症状"
      />
      <el-table-column min-width="120px" align="center" label="感染人数">
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
      <el-table-column min-width="120px" align="center" label="感染人员详情">
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
        border
      >
        <el-table-column align="center" prop="name" label="姓名" />
        <el-table-column align="center" prop="age" label="年龄" />
        <el-table-column align="telephone" prop="telephone" width="120" label="电话" />
        <el-table-column align="center" prop="brandNumber" label="胸牌号" />
        <el-table-column align="center" prop="nursingUnit" label="护理单元" />
        <el-table-column align="center" label="感染人员职业" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.personnel === '其他'">{{
              scope.row.personnelOccupation
            }}</span>
            <span
              v-else-if="
                scope.row.personnel === '医生' ||
                scope.row.personnel === '护士' ||
                scope.row.personnel === '技师'
              "
            >
              {{ scope.row.personnelPosition }} - {{ scope.row.personnel }}
            </span>
            <span v-else>{{ scope.row.personnel }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="症状">
          <template slot-scope="scope">
            <span>
              {{ scope.row.symptoms.join() }}
              <span v-if="scope.row.symptoms.includes('其他')"
                >-{{ scope.row.otherSymptoms }}</span
              >
              <span v-if="scope.row.symptoms.includes('发热')"
                >--{{ scope.row.bodyTemperature }}℃</span
              >
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="seeDoctor" label="是否就诊" />
        <el-table-column align="center" label="疾病诊断结果" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.seeDoctor === '否'" style="color: #999">
              未就诊
            </span>
            <span v-else-if="scope.row.illnessType === '其他'">
              {{ scope.row.otherIllnessType }}
            </span>
            <span v-else>
              {{
                scope.row.illnessType === "流行病感冒"
                  ? "流行病感冒-" + scope.row.influenzaType
                  : scope.row.illnessType
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          min-width="140px"
          label="怀疑感染的来源为"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.source.includes('其他')">
              {{
                otherReplace(scope.row.source, scope.row.otherSource).toString()
              }}
            </span>
            <span v-else>
              {{ scope.row.source.toString() }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
           width="220"
          label="是如何确定自己感染了新冠病毒"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.howInfect.includes('其他')">
              {{
                otherReplace(
                  scope.row.howInfect,
                  scope.row.otherHowInfect
                ).toString()
              }}
            </span>
            <span v-else>
              {{ scope.row.howInfect.toString() }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-table
      hidden
      class="tableData"
      v-loading="listLoading"
      :header-cell-style="{ 'background-color': '#fefefe', color: '#959595' }"
      :data="tableData2"
      style="width: 100%"
      border
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
          {{ scope.row.cTime.split("T")[0] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>
            {{ scope.row.pName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="年龄">
        <template slot-scope="scope">
          <span>
            {{ scope.row.age }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="telephone" label="电话">
        <template slot-scope="scope">
          <span>
            {{ scope.row.telephone }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="胸牌号">
        <template slot-scope="scope">
          <span>
            {{ scope.row.brandNumber }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="护理单元">
        <template slot-scope="scope">
          <span>
            {{ scope.row.nursingUnit }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="感染人员职业">
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
            >
              {{ scope.row.personnelPosition }} - {{ scope.row.personnel }}
            </span>
            <span v-else>{{ scope.row.personnel }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="症状">
        <template slot-scope="scope">
          <span>
            <span>
              {{ scope.row.symptoms.join() }}
              <span v-if="scope.row.symptoms.includes('其他')"
                >-{{ scope.row.otherSymptoms }}</span
              >
              <span v-if="scope.row.symptoms.includes('发热')"
                >--{{ scope.row.bodyTemperature }}℃</span
              >
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否就诊">
        <template slot-scope="scope">
          <span>
            {{ scope.row.seeDoctor }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="疾病诊断结果">
        <template slot-scope="scope">
          <span>
            <span v-if="scope.row.seeDoctor === '否'" style="color: #999">
              未就诊
            </span>
            <span v-else-if="scope.row.illnessType === '其他'">
              {{ scope.row.otherIllnessType }}
            </span>
            <span v-else>
              {{
                scope.row.illnessType === "流行病感冒"
                  ? "流行病感冒-" + scope.row.influenzaType
                  : scope.row.illnessType
              }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        min-width="140px"
        label="怀疑感染的来源为"
      >
        <template slot-scope="scope">
          <span>
            <span v-if="scope.row.source">
              <span v-if="scope.row.source.includes('其他')">
                {{
                  otherReplace(
                    scope.row.source,
                    scope.row.otherSource
                  ).toString()
                }}
              </span>
              <span v-else>
                {{ scope.row.source.toString() }}
              </span>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        min-width="140px"
        label="是如何确定自己感染了新冠病毒"
      >
        <template slot-scope="scope">
          <span>
            <span v-if="scope.row.howInfect">
              <span v-if="scope.row.howInfect.includes('其他')">
                {{
                  otherReplace(
                    scope.row.howInfect,
                    scope.row.otherHowInfect
                  ).toString()
                }}
              </span>
              <span v-else>
                {{ scope.row.howInfect.toString() }}
              </span>
            </span>
          </span>
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
import { getStaffContentTable } from "@/api/influenza";

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
      getStaffContentTable(this.searchModel).then((res) => {
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
            "流感相关调查表.xlsx"
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
</style>
