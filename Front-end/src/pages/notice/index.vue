<template>
  <div class="container">

    <div class="head">
      <div>
        <el-input v-model="searchName" placeholder="按表名搜索" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" type="primary"></el-button>
        </el-input>
      </div>
      <el-button v-if="this.$store.state.user.userInfo.power === 1" size="small" type="primary" icon="el-icon-document-add" plain @click="addDiyTable">发布公告</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      class="table"
      :data="filteredTables.slice((listQuery.page - 1) * listQuery.limit,listQuery.page * listQuery.limit)"
      fit
      highlight-current-row
    >
      <el-table-column prop="table_name" fiexd label="表名" min-width="200" align="left">
        <template slot-scope="scope">
          <span style="font-weight: 600">{{ scope.row.table_name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" fiexd label="描述" min-width="360" align="left"/>
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
              type="danger"
              icon="el-icon-delete"
              @click="deleteDiyTable(scope.row.id)"
            >删除</el-link>
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import { getUserinfoByName } from '@/api/employee'

export default {
  name: 'Index',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination
  },
  data() {
    return {
      searchName: '',
      personManage: {
        editId: '',
        personManageShow: false,
        permissions: [],
        selectOption: []
      },
      listLoading: false,
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
      // this.listLoading = true
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

    addDiyTable() {
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

  }
}
</script>

<style lang="scss" scoped>
  .person-manage-btn {
    display: flex;
    justify-content: right;
    margin-top: 40px;
  }
::v-deep .el-dialog__body {
  margin-bottom: 50px;
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
