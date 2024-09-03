<template>
  <div class="container">
    <transition name="popup-show">
      <Popup v-if="popupShow" :edit-form="editForm" :page-status="pageStatus" @onClose="onClose" @getData="getData"/>
    </transition>

    <div class="head">
      <div>
        <el-input v-model="searchName" placeholder="按表名搜索" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" type="primary"></el-button>
        </el-input>
      </div>
      <el-button v-if="this.$store.state.user.userInfo.power === 1" size="small" type="primary" icon="el-icon-document-add" plain @click="addDiyTable">新增表单</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      class="table"
      :header-cell-style="{ 'background-color': '#f8f8f8', color: '#666',}"
      :data="filteredTables.slice((listQuery.page - 1) * listQuery.limit,listQuery.page * listQuery.limit)"
      fit
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column prop="table_name" fiexd label="表名" min-width="200" align="left">
        <template slot-scope="scope">
          <span style="font-weight: 600">{{ scope.row.table_name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" fiexd label="描述" min-width="360" align="left"/>
      <el-table-column fiexd label="创建人" min-width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.creator }}
        </template>
      </el-table-column>
      <el-table-column fiexd label="创建时间" min-width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.creat_date.split('T')[0] }}
        </template>
      </el-table-column>
      <el-table-column fiexd label="状态" min-width="100" align="center">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.state" placement="left-start" width="210" trigger="hover" content="开放状态，可正常填写">
            <el-tag slot="reference">已开放</el-tag>
            <div v-if="$store.state.user.userInfo.power === 1" class="el-popover-text">
              <span>点此关闭该表单填写，</span>
              <el-link v-if="scope.row.state" type="warning" @click="closeDiyTable(scope.row.id, 0)">关闭</el-link>
            </div>
          </el-popover>
          <el-popover v-else placement="left-start" width="210" trigger="hover" content="关闭状态，不可填写">
            <el-tag slot="reference" type="info">已关闭</el-tag>
            <div v-if="$store.state.user.userInfo.power === 1" class="el-popover-text">
              <span>点此开放该表单填写，</span>
              <el-link v-if="!scope.row.state" type="success" @click="closeDiyTable(scope.row.id, 1)">开放</el-link>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column v-if="$store.state.user.userInfo.power === 1" fiexd label="填写人员管理" min-width="120" align="center">
        <template slot-scope="scope">
          <svg-icon icon-class="persons" class="persons-icon" @click="managePerson(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column fiexd label="表单内容" align="center">
        <template slot-scope="scope">
          <i class="el-icon-document form-icon" @click="lookForm(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="240"
        align="center"
      >
        <template slot-scope="scope">
          <div class="operation">
            <el-link
              v-if="$store.state.user.userInfo.power === 1"
              type="primary"
              icon="el-icon-edit"
              @click="editDiyTable(scope.row)"
            >编辑</el-link>
            <el-link
              v-if="$store.state.user.userInfo.power === 1"
              type="danger"
              icon="el-icon-delete"
              @click="deleteDiyTable(scope.row.id)"
            >删除</el-link>
            <el-link
              v-if="$store.state.user.userInfo.power === 0"
              type="primary"
              @click="toFillOut(scope.row)"
            >去填写此表<i class="el-icon-d-arrow-right el-icon--right"></i></el-link>
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
      title="选择可编辑人员"
      :visible.sync="personManage.personManageShow"
      width="460px"
    >
      <el-select v-model="personManage.permissions" multiple placeholder="暂无，请选择">
        <el-option
          v-for="item in personManage.selectOption"
          :key="item.account"
          :label="item.name"
          :value="item.account">
        </el-option>
      </el-select>
      <div class="person-manage-btn">
        <el-button @click="personManage.personManageShow = false">取消</el-button>
        <el-button @click="editDiyPerson" type="primary">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :modal-append-to-body="false"
      title="表单内容"
      :visible.sync="previewShow"
      width="32%"
      class="form-content"
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
  getCustomTable,
  changeCustomTable,
  deleteCustomTable, changePermissions
} from '@/api/custom-module'
import { getUserinfoByName } from '@/api/employee'
import Preview from './components/preview'
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
      personManage: {
        editId: '',
        personManageShow: false,
        permissions: [],
        selectOption: []
      },
      pageStatus: 'add',
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
  computed: {
    // 使用计算属性来过滤数据
    filteredTables() {
      return this.tableData.filter(table => {
        return table.table_name.toLowerCase().includes(this.searchName.toLowerCase())
      })
    }
  },
  methods: {
    handleCurrentChange(page) {
      this.listQuery.page = page
    },
    getData(name) {
      this.listLoading = true
      this.tableData = []
      let account = ''
      if (this.$store.state.user.userInfo.power === 1) {
        getUserinfoByName({
          name: '',
          getPower: 0
        }).then((res) => {
          if (res.code === 1) {
            this.personManage.selectOption = res.data.list
          }
        })
      } else {
        account = this.$store.state.user.userInfo.account
      }
      getCustomTable({ account }).then(res => {
        if (res.code) {
          this.tableData = res.data.list
        }
        this.listLoading = false
      })
    },
    lookForm(data) {
      console.log(data, 456)
      this.diyForm = deepCopy(data)
      this.previewShow = true
    },

    addDiyTable() {
      this.editForm = null
      this.pageStatus = 'add'
      this.popupShow = true
    },

    editDiyTable(rowData) {
      console.log(rowData, !rowData.filled,546)
      if (rowData.filled) {
        this.$message({
          type: 'info',
          message: '表开放过填写，不能再编辑'
        })
        return
      }
      this.editForm = deepCopy(rowData)
      this.pageStatus = 'edit'
      this.popupShow = true
    },

    deleteDiyTable(id) {
      this.$confirm('此操作将永久删除该表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteCustomTable({ id }).then(res => {
            if (res.code === 1) {
              this.getData()
              this.$message({
                type: 'success',
                message: res.msg
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    closeDiyTable(id, state) {
      const title = state ? '开放填写?' : '关闭之后结束填写, 是否继续?'
      const message = state ? '已开放' : '已关闭'
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          changeCustomTable({ id, state }).then(res => {
            if (res.code === 1) {
              this.getData()
              this.$message({
                type: 'success',
                message: message
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    managePerson(row) {
      console.log(row)
      this.personManage.editId = row.id
      this.personManage.permissions = row.permissions ? row.permissions.split(',') : ''
      this.personManage.personManageShow = true
    },
    editDiyPerson() {
      const data = {
        id: this.personManage.editId,
        permissions: this.personManage.permissions.toString()
      }
      changePermissions(data).then(res => {
        if (res.code === 1) {
          this.getData()
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }
      })
      this.personManage.personManageShow = false
    },
    toFillOut(params) {
      // this.$router.push({ path: '/formList/fill-out?name=' + name })
      this.$router.push({ name: '表单填写', params })
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
  .person-manage-btn {
    display: flex;
    justify-content: right;
    margin-top: 40px;
  }
  .form-content {
    min-height: 80vh;
    ::v-deep .el-dialog__header {
      background-color: #f1f2f3;
      .el-dialog__title {
        color: #999;
      }
    }
  }
::v-deep .el-dialog__body {
  margin-bottom: 50px;
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
  opacity: .6;
  font-size: 22px;
  cursor: pointer;
}
.persons-icon {
  font-size: 22px;
  cursor: pointer;
  color: #20a0ff;
  opacity: .6;
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
.el-popover-text {
  display: flex;
  align-content: center
}
</style>
