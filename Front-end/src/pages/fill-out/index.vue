<template>
  <div class="app-container">

    <el-dropdown class="dropdown" @command="handleCommand" placement="bottom">
      <span class="el-dropdown-link">
        表名：{{ tableName || '请选择表单' }}<i v-if="!tableName" class="el-icon-arrow-down el-icon--right" />{{ diyTable.state === 0 ? '（关闭填写）' : '' }}
      </span>
      <el-dropdown-menu slot="dropdown" style="min-width: 300px">
        <el-dropdown-item v-for="(item,index) in formList" :key="index" :command="item">
          <span :class="{'c99': !item.state}">{{ item.table_name }}</span>
          <span class="c99" style="float: right">{{ item.state === 0 ? '（已关闭）' : '' }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-form class="search" label-width="100px" size="small">
      <el-date-picker v-model="searchDate" type="datetimerange" format="yyyy-MM-dd HH:mm" style="margin-right: 20px" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"/>
      <el-select v-model="searchState" placeholder="请选择校验状态" style="margin-right: 20px;width: 150px" clearable>
        <el-option label="待校验" value="1"></el-option>
        <el-option label="校验正确" value="2"></el-option>
        <el-option label="校验错误" value="3"></el-option>
        <el-option label="未校验" value="4"></el-option>
      </el-select>
      <el-select v-model="searchId" placeholder="请选择人员id" style="margin-right: 20px;width: 150px" clearable>
        <el-option v-for="(item,index) in searchIds" :key="index" :label="item.user_id" :value="item.user_id"></el-option>
      </el-select>
      <el-button
        icon="el-icon-search"
        type="primary"
        @click="searchByDate"
      >查询</el-button>
      <el-button v-if="this.$store.state.user.userInfo.power === 0" size="small" type="primary" style="float: right" icon="el-icon-document" plain @click="editFillIn(diyTable, '新增')">添加</el-button>
    </el-form>
    <div class="table-row">
      <span class="table-row-num">总计：{{ tableData.length }}</span>
      <el-tooltip v-if="this.$store.state.user.userInfo.power === 1" class="item" effect="dark" content="导出" placement="top">
        <el-button class="add-button" size="mini" type="primary" icon="el-icon-folder-opened" plain @click="exportExcel" />
      </el-tooltip>
      <el-tooltip v-if="this.$store.state.user.userInfo.power === 1" class="item" effect="dark" content="统计" placement="top">
        <el-button class="add-button statistics-button" size="mini" type="primary" icon="el-icon-coin" plain @click="openStatistics" />
      </el-tooltip>
    </div>

    <el-table
      v-loading="tableLoading"
      :header-cell-style="{ 'background-color': '#fefefe', color: '#959595' }"
      border
      class="tableData"
      :data="tableData.slice((listQuery.page - 1) * listQuery.limit,listQuery.page * listQuery.limit)"
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column min-width="120px" fiexd align="center" prop="written_by" label="填报人" />
      <el-table-column min-width="60px" fiexd align="center" prop="user_id" label="人员ID" />
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
          <el-tag v-if="scope.row.state === 4" type="danger">表关闭未校验</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="$store.state.user.userInfo.power !== 1" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="editFillIn(scope.row, '编辑')"
            :disabled="!diyTable.state"
          >编辑</el-link>
          <el-link
            type="danger"
            style="margin-left: 10px"
            @click="deleteFillIn(scope.row)"
            :disabled="!diyTable.state"
          >删除
          </el-link>
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

    <el-dialog
      :modal-append-to-body="false"
      :title="'☆' + fillInForm.redactState"
      :visible.sync="fillInShow"
      :close-on-click-modal="false"
      width="70%"
    >
      <Preview v-if="fillInShow" :preview-data="fillInForm" @close="searchByDate" />
    </el-dialog>

    <el-drawer
      title="填报数量统计"
      :visible.sync="drawer"
      direction="rtl">
      <el-table
        :data="drawerData"
        style="width: 100%">
        <el-table-column prop="written_by" label="姓名"></el-table-column>
        <el-table-column :label="tableName + '填报总数:' + tableData.length">
          <el-table-column prop="await_count" label="待校验"></el-table-column>
          <el-table-column prop="correct_count" label="正确"></el-table-column>
          <el-table-column prop="mistake_count" label="错误"></el-table-column>
          <el-table-column prop="uncompleted_count" label="未校验"></el-table-column>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
  import { deepClone, parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { getStaffContentTable, deleteContentTable, getDrawerNumData } from '@/api/fillout'
import Preview from './components/preview'
import { getCustomTable } from '@/api/custom-module'

export default {
  name: 'HealthEducation',
  components: {
    Preview, Pagination
  },
  data() {
    return {
      tableName: '',
      tableLoading: false,
      drawer: false,
      formList: [],
      searchDate: '',
      searchState: '',
      searchId: '',
      searchIds: [],
      tableData: [],
      drawerData: [],
      fillInShow: false,
      fillInForm: '',
      diyTable: '',
      total: 60,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      }
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
      this.tableLoading = true
      const account = this.$store.state.user.userInfo.power ? '' : this.$store.state.user.userInfo.account
      getCustomTable({ account }).then(res => {
        if (res.code) {
          this.formList = res.data.resultD
          console.log(this.formList, 789)
        }
        setTimeout(() => {
          self.tableLoading = false
        }, 600)
      })
    },
    openStatistics() {
      if (!this.diyTable.id) {
        this.$message({
          type: 'info',
          message: '请先选择表单'
        })
        return
      }
      const data = {
        form_id: this.diyTable.id
      }
      getDrawerNumData(data).then(res => {
        if (res.code === 1) {
          this.drawerData = res.data.result
          this.drawer = true
        }
      })
    },
    searchByDate() {
      const self = this
      self.fillInShow = false
      self.tableLoading = true
      const data = {
        form_id: self.diyTable.id || '',
        written_account: self.$store.state.user.userInfo.account,
        startDate: '',
        endDate: '',
        state: self.searchState,
        user_id: self.searchId,
        power: self.$store.state.user.userInfo.power
      }
      if (self.searchDate) {
        data.startDate = new Date(self.searchDate[0])
        data.endDate = new Date(self.searchDate[1])
      }
      getStaffContentTable(data).then(res => {
        console.log(res,56)
        if (res.code === 1) {
          self.tableData = res.data.result
          self.searchIds = res.data.resultIds
        }
        setTimeout(() => {
          self.tableLoading = false
        }, 600)
      })
    },
    deleteFillIn(row) {
      this.$confirm('删除后不可恢复，是否确认删除？').then((_) => {
        const data = {
          id: row.id,
          verify: row.verify
        }
        deleteContentTable(data).then(res => {
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
      console.log(this.diyTable, 89)
      if (this.diyTable) {
        if (!this.diyTable.state) {
          this.$message({
            type: 'info',
            message: '该表已关闭填写'
          })
          return
        }
        this.fillInForm = {
          id: row.id,
          content: row.content,
          verify: row.verify,
          verify_correct: row.verify_correct,
          state: row.state,
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

    exportExcel() {
      if (!this.tableName) {
        this.$message({
          type: 'info',
          message: '请先选择表单'
        })
        return
      }
      const headers = ['表名','填写时间','填报人','填报人账号','校验值', '校验状态(1：待校验  2：校验正确  3：错误  4: 未校验)','每项校验结果（false为未匹配上）','填写内容']
      const fields = ['form_name','date','written_by','written_account','verify', 'state','verify_correct','content']
      let data = new Array()

      data = this.tableData.map((obj) => {
        return fields.map((field) => {
          return obj[field]
        })
      })
      if (headers.length > 0) {
        data.splice(0, 0, headers)
      } else {
        // 将headers设置为英文字段表头
        data.splice(0, 0, fields)
      }
      const ws = XLSX.utils.aoa_to_sheet(data) // 创建工作表
      const wb = XLSX.utils.book_new() // 创建工作簿

      // 隐藏表头
      // let wsrows = [{ hidden: true }]
      // ws['!rows'] = wsrows // ws - worksheet

      XLSX.utils.book_append_sheet(wb, ws) // 将工作表添加到工作簿中
      XLSX.writeFile(wb, this.tableName + '填写情况.xlsx') // 导出文件
    },

    handleCurrentChange(page) {
      this.listQuery.page = page
    }
  }
}
</script>

<style lang="scss" scoped>
  .dropdown {
    display: flex;
    justify-content: center;
    margin: 16px 0 20px;
    padding-bottom: 16px;
    border-bottom: solid 1px #f5f5f5;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    font-size: 22px;
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
  right: 15px;
  top: 6px;
  border: 1px solid #bebebe;
  font-size: 12px;
  color: #969696;
}
.statistics-button {
  right: 76px;
}

.person-icon {
  font-size: 22px;
  cursor: pointer;
  fill: #99cd80;
}

  .c99 {
    color: #c9c9c9;
  }

  .table-row {
    background: #ceeaf3;
    height: 40px;
    line-height: 40px;
    position: relative;
    .table-row-num {
      font-size: 14px;
      margin-left: 20px;
      font-weight: 600;
      color: #999;
      opacity: .4;
      font-style: oblique;
    }
  }
</style>
