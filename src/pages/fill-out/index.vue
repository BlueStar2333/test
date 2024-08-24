<template>
  <div class="app-container">
    <el-form class="search" label-width="100px" size="small">
      <el-date-picker
        v-model="searchDate"
        type="datetimerange"
        format="yyyy-MM-dd HH:mm"
        style="margin-right: 20px"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button
        icon="el-icon-search"
        type="primary"
        @click="searchByDate"
      >查询</el-button>
      <el-dropdown class="dropdown" @command="handleCommand">
        <span class="el-dropdown-link">
          {{ tableName || '请选择表单' }}<i v-if="!tableName" class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) in formList" :key="index" :command="item">{{ item.table_name }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-form>
    <div style="background: #ceeaf3; height: 40px; line-height: 40px">
      <el-row>
        <el-col :span="23" />
        <el-col :span="1">
          <el-tooltip class="item" effect="dark" content="新增" placement="top">
            <i class="el-icon-plus add-icon" @click="editFillIn(diyTable, '新增')" />
          </el-tooltip>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="tableLoading"
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
      <el-table-column min-width="120px" fiexd align="center" prop="written_by" label="填报人" />
      <el-table-column min-width="120px" align="center" label="填报时间">
        <template slot-scope="scope">
          {{ formatDate(scope.row.date) }}
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" label="填写详情">
        <template slot-scope="scope">
          <svg-icon
            icon-class="person"
            class="person-icon"
            @click="editFillIn(scope.row, '查看')"
          />
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" label="校验状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 2" type="success">正确</el-tag>
          <el-tag v-if="scope.row.state === 1" type="warning">待校验</el-tag>
          <el-tag v-if="scope.row.state === 3" type="danger">错误</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="editFillIn(scope.row, '编辑')"
          >编辑</el-link>
          <el-link
            type="danger"
            style="margin-left: 10px"
            @click="deleteFillIn(scope.row)"
          >删除
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :modal-append-to-body="false"
      :title="'☆' + fillInForm.redactState"
      :visible.sync="fillInShow"
      :close-on-click-modal="false"
      width="60%"
    >
      <Preview v-if="fillInShow" :preview-data="fillInForm" @close="searchByDate"/>
    </el-dialog>










    <el-pagination
      :current-page="listQuery.page"
      :page-size="listQuery.limit"
      layout="prev, pager, next, jumper"
      :total="tableData.length"
      @current-change="handleCurrentChange"
    />
    <el-dialog :visible.sync="drawer" title="填写内容" width="70%">
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
              <span
                v-if="scope.row.symptoms.includes('其他')"
              >-{{ scope.row.otherSymptoms }}</span>
              <span
                v-if="scope.row.symptoms.includes('发热')"
              >--{{ scope.row.bodyTemperature }}℃</span>
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
      v-loading="listLoading"
      hidden
      class="tableData"
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
              <span
                v-if="scope.row.symptoms.includes('其他')"
              >-{{ scope.row.otherSymptoms }}</span>
              <span
                v-if="scope.row.symptoms.includes('发热')"
              >--{{ scope.row.bodyTemperature }}℃</span>
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
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { getStaffContentTable, deleteContentTable } from '@/api/fillout'
import Preview from './components/preview'
import { getCustomTable } from '@/api/custom-module'
import {deleteUser} from "@/api/employee";

export default {
  name: 'HealthEducation',
  components: {
    Preview,
    Pagination
  },
  data() {
    return {
      tableName: '',
      tableLoading: false,
      formList: [],
      searchDate: '',
      tableData: [],
      fillInShow: false,
      fillInForm: '',
      diyTable: '',



      tableData2: [],
      searchModel: {
        startTime: '',
        endTime: '',
        hospitalCode: this.$store.state.user.userInfo.hospitalCode
      },
      listLoading: true,
      total: 60,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      drawer: false,
      selectTable: []
    }
  },
  created() {
    if (Object.keys(this.$route.params).length > 0) {
      this.tableName = this.$route.params.table_name
      this.diyTable = this.$route.params
    } else {
      console.log('没有 params 参数')
    }
    this.getData()
    this.searchByDate()
  },
  methods: {
    getData() {
      this.tableData = []
      this.listLoading = true
      getCustomTable().then(res => {
        if (res.code) {
          this.formList = res.data.list
          console.log(this.formList, 789)
        }
        this.listLoading = false
      })
    },
    searchByDate() {
      this.fillInShow = false
      this.listLoading = true
      const data = {
        form_id: this.diyTable.id || '',
        written_account: this.$store.state.user.userInfo.account,
        startDate: '',
        endDate: '',
        power: this.$store.state.user.userInfo.power
      }
      if (this.searchDate) {
        data.startDate = new Date(this.searchDate[0])
        data.endDate = new Date(this.searchDate[1])
      }
      getStaffContentTable(data).then(res => {
        if (res.code === 1) {
          console.log(res,'111')
          this.tableData = res.data
        }
        this.listLoading = false
      })
    },
    deleteFillIn(row) {
      this.$confirm('删除后不可恢复，是否确认删除？').then((_) => {
        deleteContentTable({ id: row.id }).then(res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '已删除'
            })
            this.searchByDate()
          } else {
            this.$message({
              type: 'warning',
              message: '删除失败'
            })
          }
        })
      }).catch((_) => {})
    },
    editFillIn(row, redactState) {
      console.log(this.diyTable,89)
      if (this.diyTable) {
        this.fillInForm = {
          id: row.id,
          content: row.content,
          table_name: this.diyTable.table_name,
          description: this.diyTable.description,
          redactState: redactState
        }
        this.fillInShow = true
      } else {
        this.$message({
          type: 'info',
          message: '请先选择表单'
        })
      }
    },
    handleCommand(command) {
      this.tableName = command.table_name
      this.diyTable = command
      this.searchByDate()
    },
    formatDate(date) {
      date = new Date(date)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0') // 月份是从0开始的
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}`
    },









    handleAdd() {
      if (this.tableName) {
        this.$message('跳转到填表')
      } else {
        this.$message('请先选择表单')
      }
    },

    handleCurrentChange(page) {
      this.listQuery.page = page
    },
    personDetails(person) {
      this.selectTable = person
      // console.log(this.selectTable, 2245)
      this.drawer = true
    },
    otherReplace(arr, item) {
      const newArr = arr
      newArr.pop()
      newArr.push(item)
      return newArr
    },

    handleDownload() {
      this.$nextTick(function() {
        var wb = XLSX.utils.table_to_book(document.querySelector('.tableData'))
        /* 获取二进制字符串作为输出 */
        var wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array'
        })
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            '流感相关调查表.xlsx'
          )
        } catch (e) {}
        return wbout
      })
    },
    formatJson(filterVal) {
      return this.tableData.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },

    sortChange(data) {
      const { prop, order } = data
      this.tableData.reverse()
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style lang="scss" scoped>
  .dropdown {
    float: right;
    margin-top: 20px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    font-size: 22px;
    font-style: oblique;
    font-weight: 600;
    opacity: .6;
  }
  .el-icon-arrow-down {
    font-size: 18px;
  }

  ::v-deep .el-dialog__header {
    background-color: #f1f2f3;
    .el-dialog__title {
      color: #999;
    }
  }
.app-container {
  background-color: #fff;
  ::v-deep .el-dialog__header {
    background-image: repeating-linear-gradient(135deg, hsla(264,0%,88%,0.03) 0px, hsla(264,0%,88%,0.03) 1px,transparent 1px, transparent 12px),repeating-linear-gradient(45deg, hsla(264,0%,88%,0.03) 0px, hsla(264,0%,88%,0.03) 1px,transparent 1px, transparent 12px),repeating-linear-gradient(67.5deg, hsla(264,0%,88%,0.03) 0px, hsla(264,0%,88%,0.03) 1px,transparent 1px, transparent 12px),repeating-linear-gradient(135deg, hsla(264,0%,88%,0.03) 0px, hsla(264,0%,88%,0.03) 1px,transparent 1px, transparent 12px),repeating-linear-gradient(45deg, hsla(264,0%,88%,0.03) 0px, hsla(264,0%,88%,0.03) 1px,transparent 1px, transparent 12px),repeating-linear-gradient(112.5deg, hsla(264,0%,88%,0.03) 0px, hsla(264,0%,88%,0.03) 1px,transparent 1px, transparent 12px),repeating-linear-gradient(112.5deg, hsla(264,0%,88%,0.03) 0px, hsla(264,0%,88%,0.03) 1px,transparent 1px, transparent 12px),repeating-linear-gradient(45deg, hsla(264,0%,88%,0.03) 0px, hsla(264,0%,88%,0.03) 1px,transparent 1px, transparent 12px),repeating-linear-gradient(22.5deg, hsla(264,0%,88%,0.03) 0px, hsla(264,0%,88%,0.03) 1px,transparent 1px, transparent 12px),repeating-linear-gradient(45deg, hsla(264,0%,88%,0.03) 0px, hsla(264,0%,88%,0.03) 1px,transparent 1px, transparent 12px),repeating-linear-gradient(22.5deg, hsla(264,0%,88%,0.03) 0px, hsla(264,0%,88%,0.03) 1px,transparent 1px, transparent 12px),repeating-linear-gradient(135deg, hsla(264,0%,88%,0.03) 0px, hsla(264,0%,88%,0.03) 1px,transparent 1px, transparent 12px),repeating-linear-gradient(157.5deg, hsla(264,0%,88%,0.03) 0px, hsla(264,0%,88%,0.03) 1px,transparent 1px, transparent 12px),repeating-linear-gradient(67.5deg, hsla(264,0%,88%,0.03) 0px, hsla(264,0%,88%,0.03) 1px,transparent 1px, transparent 12px),repeating-linear-gradient(67.5deg, hsla(264,0%,88%,0.03) 0px, hsla(264,0%,88%,0.03) 1px,transparent 1px, transparent 12px),linear-gradient(90deg, rgba(151,26,210, 0),rgba(57,199,205, 0));
    .el-dialog__title {
      color: #c6c6c6;
    }
  }
  ::v-deep .el-dialog__body {
    margin-bottom: 50px;
  }
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

.add-icon {
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 12px;
  padding: 2px;
  border: 1px solid #bebebe;
  font-size: 12px;
  color: #969696;
  border-radius: 2px;
}

.person-icon {
  font-size: 22px;
  cursor: pointer;
  fill: #99cd80;
}
</style>
