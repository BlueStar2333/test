<template>
  <div class="personnel-management">
    <div class="box-card pm-search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-date-picker
            v-model="searchDate"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            style="margin: 0 10px 0 0"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-input v-model="userName" clearable placeholder="用户名" />
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="getLogs"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="box-card pm-body-table">
      <el-table
        :data="tableData.slice((Confirmpage - 1) * ConfirmpageSize,Confirmpage * ConfirmpageSize)"
        border
      >
        <el-table-column prop="user" align="center" label="用户名" />
        <el-table-column prop="controls" align="center" label="操作类型" />
        <el-table-column align="center" label="操作时间">
          <template slot-scope="scope">
            {{ formatDate(scope.row.controls_date) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :current-page="Confirmpage"
          :page-size="ConfirmpageSize"
          layout="prev, pager, next, jumper"
          :total="tableData.length"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getLogByData } from '@/api/employee'

export default {
  name: 'Log',
  data() {
    return {
      userName: '',
      searchDate: '',
      user: {
        name: this.$store.state.user.userInfo.name,
        power: this.$store.state.user.userInfo.power
      },
      tableData: [],
      deptName: '',
      edit: false,
      drawer: false,
      isAdmin: false,
      addPerson: {
        name: '',
        account: '',
        password: '',
        phone: '',
        power: ''
      },
      dialogType: '',
      dept: [],
      Confirmpage: 1,
      ConfirmpageSize: 10
    }
  },
  computed: {},
  mounted() {
    this.getLogs()
  },
  methods: {
    getLogs() {
      const data = {
        user: this.userName,
        startDate: '',
        endDate: ''
      }
      if (this.searchDate) {
        data.startDate = new Date(this.searchDate[0])
        data.endDate = new Date(this.searchDate[1])
      }
      getLogByData(data).then((res) => {
        if (res.code === 1) {
          console.log(res, 99963)
          this.tableData = res.data
        }
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
    },
    handleCurrentChange(Confirmpage) {
      this.Confirmpage = Confirmpage
    }
  }
}
</script>

<style scoped>
  .personnel-management {
    padding: 20px;
  }

  .box-card {
    background-color: #fff;
    border-radius: 4px;
  }

  .pm-search {
    padding: 20px 20px 0;
    margin-bottom: 14px;
  }

  .pm-body-table {
    overflow: auto;
    padding: 20px;
    min-width: 700px;
    margin-bottom: 14px;
    flex: 1;
  }
</style>

