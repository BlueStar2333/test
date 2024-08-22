<template>
  <div class="container">
    <transition name="popup-show">
      <Popup
        v-if="popupShow"
        :edit-form="editForm"
        @onClose="onClose"
        @getData="getData"
      />
    </transition>

    <div class="head">
      <div>
        <el-input
          v-model="searchName"
          size="small"
          placeholder="按表名搜索"
          style="width: 200px; margin-right: 14px"
        />
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="getData(searchName)"
        >查询</el-button>
      </div>
      <el-button
        v-if="this.$store.state.user.userInfo.power === 1"
        size="small"
        type="primary"
        icon="el-icon-plus"
        plain
        @click="addDiyTable"
      >添加</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      class="table"
      :header-cell-style="{
        'background-color': '#f8f8f8',
        color: '#666',
        'text-align': 'center',
      }"
      :data="
        tableData.slice(
          (listQuery.page - 1) * listQuery.limit,
          listQuery.page * listQuery.limit
        )
      "
      fit
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column prop="diyName" fiexd label="表名" width="200" />
<!--      <el-table-column fiexd label="截止日期" width="200" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.diyEndDate.split("T")[0] }}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        prop="diyDescription"
        fiexd
        label="描述"
        width="390"
        align="center"
      />
      <el-table-column fiexd label="填报人数" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.COUNTID || "0" }}
        </template>
      </el-table-column>
      <el-table-column fiexd label="表单内容" align="center">
        <template slot-scope="scope">
          <i
            class="el-icon-document form-icon"
            @click="lookForm(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="260"
        align="center"
      >
        <template slot-scope="scope">
          <div class="operation">
            <el-link
              v-if="$store.state.user.userInfo.power === 1"
              type="primary"
              @click="editDiyTable(scope.row)"
            >编辑</el-link>
            <el-link
              v-if="$store.state.user.userInfo.power === 1"
              type="danger"
              @click="deleteDiyTable(scope.row.ID)"
            >删除</el-link>
            <el-link
              v-if="$store.state.user.userInfo.power === 1"
              type="success"
              @click="closeDiyTable(scope.row.ID)"
            >关闭</el-link>
            <el-link
              v-if="$store.state.user.userInfo.power === 0"
              type="primary"
              @click="toFillOut(scope.row.diyName)"
            >去填写此表</el-link>
          </div>
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
      title="表单内容"
      :visible.sync="previewShow"
      width="32%"
      center
    >
      <Preview v-if="previewShow" :preview-data="diyForm" />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import Popup from './components/popup'
import {
  getCustomTablebydiyName,
  deleteCustomTable
} from '@/api/custom-module'
import Preview from '@/pages/custom-module/components/preview'
import { deepCopy } from '@/utils'

export default {
  name: 'Index',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination,
    Popup,
    Preview
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      searchName: '',
      previewShow: false,
      editForm: null,
      diyForm: [],
      popupShow: false,
      searchModel: {
        startTime: '',
        endTime: ''
      },
      listLoading: true,
      total: 60,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      tableData: []
    }
  },
  created() {
    this.getData()
    this.$eventBus.$on('refresh', this.getData)
  },
  methods: {
    handleCurrentChange(page) {
      this.listQuery.page = page
    },
    getData(name) {
      this.listLoading = true
      getCustomTablebydiyName().then(res => {
        if (res.code) {
          this.tableData = res.data.list
        }
        // for (const key of this.tableData) {
        //   key.diyContent = JSON.parse(key.diyContent)
        // }
        this.listLoading = false
      })
    },
    lookForm(data) {
      // console.log(data, 456)
      this.diyForm = deepCopy(data)
      this.previewShow = true
    },

    addDiyTable() {
      this.editForm = null
      this.popupShow = true
    },

    editDiyTable(rowData) {
      // console.log(rowData, 546)
      this.editForm = deepCopy(rowData)
      this.popupShow = true
    },

    deleteDiyTable(ID) {
      this.$confirm('此操作将永久删除该表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    closeDiyTable(ID) {
      this.$confirm('关闭之后结束填写, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '已关闭'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    toFillOut(name) {
      this.$router.push({ path: '/formList/fill-out?name=' + name })
    },

    onClose() {
      this.popupShow = false
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
      this.getData()
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  background-color: #f1f2f3;
  .el-dialog__title {
    color: #999;
  }
}
.popup-show-enter-active {
  animation: out 0.2s linear;
}
.popup-show-leave-active {
  animation: out 0.2s reverse linear;
}
@keyframes out {
  0% {
    transform: translateY(-1000px);
  }
  50% {
    transform: translateY(-500px);
  }
  100% {
    transform: translateY(0);
  }
}

.container {
  background-color: #fff;
  padding: 30px 20px;
  min-height: 100vh;
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding: 20px 0 40px;
  }
}

.form-icon {
  color: #20a0ff;
  font-size: 22px;
  cursor: pointer;
}

.operation {
  display: flex;
  justify-content: space-around;
  padding: 0 50px;
}

.table {
  ::v-deep .el-table_1_column_1 .cell {
    text-align: left;
  }
}
</style>
