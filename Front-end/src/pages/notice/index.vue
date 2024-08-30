<template>
  <div class="container">

    <div class="head">
      <div>
        <el-input v-model="searchName" placeholder="按表名搜索" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" type="primary"></el-button>
        </el-input>
      </div>
      <el-button v-if="this.$store.state.user.userInfo.power === 1" size="small" type="primary" plain @click="addNoticeShow">发布公告</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      class="table"
      :data="filteredTables.slice((listQuery.page - 1) * listQuery.limit,listQuery.page * listQuery.limit)"
      fit
      highlight-current-row
    >
      <el-table-column fiexd label="发布时间" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ formatDate(scope.row.date) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="publisher" fiexd label="发布人" min-width="100" align="center"/>
      <el-table-column fiexd label="公告内容" min-width="200" align="left">
        <template slot-scope="scope">
          <span style="font-weight: 600;color: #999">{{ scope.row.details }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="$store.state.user.userInfo.power === 1"
        fixed="right"
        label="操作"
        width="240"
        align="center"
      >
        <template slot-scope="scope">
          <div class="operation">
            <el-link
              type="danger"
              icon="el-icon-delete"
              @click="deleteNotice(scope.row.id)"
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
      title="公告内容"
      :visible.sync="noticeManage.noticePublishShow"
      width="460px"
    >
      <el-input
        v-model="noticeManage.details"
        type="textarea"
        :rows="4"
        placeholder="请输入内容">
      </el-input>
      <div class="person-manage-btn">
        <el-button type="primary" @click="submitNotice">提交</el-button>
        <el-button @click="noticeManage.noticePublishShow = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import { getNoticeList, addNotice, deleteNotice } from '@/api/notice'

export default {
  name: 'Index',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination
  },
  data() {
    return {
      searchName: '',
      noticeManage: {
        editId: '',
        noticePublishShow: false,
        details: ''
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
        return table.details.toLowerCase().includes(this.searchName.toLowerCase())
      })
    }
  },
  methods: {
    handleCurrentChange(page) {
      this.listQuery.page = page
    },
    getData() {
      this.listLoading = true
      this.tableData = []
      getNoticeList().then(res => {
        if (res.code) {
          this.tableData = res.data.list
        }
        console.log(this.tableData)
        this.listLoading = false
      })
    },

    addNoticeShow() {
      this.noticeManage.noticePublishShow = true
    },
    submitNotice() {
      if (this.noticeManage.details === '') {
        this.$message({
          type: 'info',
          message: '内容不能为空'
        })
        return
      }
      const data = {
        publisher: this.$store.state.user.userInfo.name,
        publisher_account: this.$store.state.user.userInfo.account,
        details: this.noticeManage.details
      }
      addNotice(data).then(res => {
        if (res.code === 1) {
          this.getData()
          this.$message({
            type: 'success',
            message: '发布成功'
          })
        }
      })
      this.noticeManage.noticePublishShow = false
    },

    deleteNotice(id) {
      this.$confirm('此操作将永久删除该公告, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteNotice({ id }).then(res => {
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
    formatDate(date) {
      date = new Date(date)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0') // 月份是从0开始的
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}`
    }

  }
}
</script>

<style lang="scss" scoped>
  .person-manage-btn {
    display: flex;
    justify-content: space-around;
    padding: 0 50px;
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
