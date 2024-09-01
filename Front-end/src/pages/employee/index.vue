<template>
  <div class="personnel-management">
    <div class="box-card pm-search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="userName" clearable placeholder="根据用户名查询" />
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="getUser"
          >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-plus"
            type="primary"
            @click="openAddUser"
          >人员添加</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="box-card pm-body-table">
      <el-table
        :data=" tableData.slice((Confirmpage - 1) * ConfirmpageSize,Confirmpage * ConfirmpageSize)"
        border
      >
        <el-table-column prop="name" label="用户名" />
        <el-table-column label="用户等级">
          <template slot-scope="scope">
            <label v-if="scope.row.power === 1">管理员</label>
            <label v-if="scope.row.power === 0">普通用户</label>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话号码" />
        <el-table-column prop="account" label="账号" />
        <el-table-column prop="password" label="密码" />
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.create_date.split("T")[0] }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="editPerson(scope.row)"
            >编辑</el-link>
            <el-link
              type="danger"
              style="margin-left: 10px"
              @click="deleteUser(scope.row)"
            >删除
            </el-link>
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

    <el-dialog
      :visible.sync="drawer"
      :title="dialogType === 'edit' ? 'Edit Role' : 'New Role'"
    >
      <el-form
        ref="addPerson"
        label-position="right"
        label-width="180px"
        width="60%"
        style="max-width: 600px;"
        :model="addPerson"
        :rules="personRules"
      >
        <el-form-item label="姓名：" prop="name">
          <el-input
            v-model="addPerson.name"
            clearable
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item label="账号：" prop="account">
          <el-input
            v-model="addPerson.account"
            :disabled="dialogType === 'edit'"
            clearable
            placeholder="请输入用户编号"
          />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            v-model="addPerson.password"
            type="password"
            clearable
            placeholder="请输入用户密码"
          />
        </el-form-item>
        <el-form-item label="联系电话：" prop="phone">
          <el-input
            v-model="addPerson.phone"
            clearable
            placeholder="请输入联系电话"
          />
        </el-form-item>
        <el-form-item label="操作权限：" prop="power">
          <el-select v-model="addPerson.power">
            <el-option label="管理员" :value="1">管理员</el-option>
            <el-option label="普通用户" :value="0">普通用户</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: right; margin: 10px 10px 0">
        <el-button @click="(drawer = false), getUser()">取消</el-button>
        <el-button
          icon="el-icon-finished"
          type="primary"
          @click="confirm"
        >提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addUserInfo,
  getUserinfoByName,
  updateUser,
  deleteUser
} from '@/api/employee'

export default {
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      userName: '',
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
      personRules: {
        name: [{ required: true, trigger: 'blur', message: '姓名不能为空' }],
        account: [{ required: true, trigger: 'blur', message: '账号不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        phone: [{ required: true, trigger: 'blur', validator: checkPhone }],
        power: [{ required: true, trigger: 'blur', message: '权限不能为空' }]
      },
      dialogType: '',
      dept: [],
      Confirmpage: 1,
      ConfirmpageSize: 10
    }
  },
  computed: {},
  mounted() {
    this.getUser()
  },
  methods: {
    editPerson(row) {
      this.dialogType = 'edit'
      this.drawer = true
      this.addPerson.name = row.name
      this.addPerson.account = row.account
      this.addPerson.password = row.password
      this.addPerson.phone = row.phone
      this.addPerson.power = row.power
    },
    getUser() {
      getUserinfoByName({
        name: this.userName
      }).then((res) => {
        if (res.code === 1) {
          console.log(res,78)
          this.tableData = res.data.list
        }
      })
    },
    confirm() {
      this.$refs.addPerson.validate(valid => {
        if (valid) {
          if (this.dialogType === 'add') {
            this.addUser()
          } else {
            this.updateUser()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    openAddUser() {
      this.dialogType = 'add'
      this.drawer = true
      this.addPerson.name = ''
      this.addPerson.account = ''
      this.addPerson.password = ''
      this.addPerson.phone = ''
      this.addPerson.power = 0
    },
    addUser() {
      addUserInfo(this.addPerson).then((res) => {
        if (res.code === 1) {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.getUser()
          this.drawer = false
        } else {
          this.$message({
            type: 'warning',
            message: res.msg
          })
        }
      })
    },
    updateUser() {
      updateUser(this.addPerson).then((res) => {
        if (res.code === 1) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.getUser()
          this.drawer = false
        } else {
          this.$message({
            type: 'warning',
            message: '修改失败'
          })
        }
      })
    },
    deleteUser(row) {
      if (row.account === this.$store.state.user.userInfo.account) {
        this.$message({
          type: 'warning',
          message: '不能删除自己'
        })
        return
      }
      this.$confirm('删除后不可恢复，是否确认删除？')
        .then((_) => {
          deleteUser({
            account: row.account
          }).then((res) => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: '已删除'
              })
              this.getUser()
            } else {
              this.$message({
                type: 'warning',
                message: '删除失败'
              })
            }
          })
        })
        .catch((_) => {})
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

.pm-body {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.pm-body-aside {
  width: 200px;
  padding: 20px;
  margin: 0 14px 14px 0;
}

.pm-body-table {
  overflow: auto;
  padding: 20px;
  min-width: 700px;
  margin-bottom: 14px;
  flex: 1;
}
</style>

