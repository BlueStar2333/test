<template>
  <div class="personnel-management">
    <div class="box-card pm-search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="userName" clearable placeholder="根据用户名查询" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getUser"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-plus" type="primary" @click="openAddUser"
            >人员添加</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="box-card pm-body-table">
      <el-table
        :data="
          tableData.slice(
            (Confirmpage - 1) * ConfirmpageSize,
            Confirmpage * ConfirmpageSize
          )
        "
        border
      >
        <el-table-column prop="Name" label="用户名" />
        <el-table-column prop="Number" label="用户编号" />
        <!-- <el-table-column prop="PWD" label="密码" /> -->
        <el-table-column prop="Department" label="科室" />
        <el-table-column prop="Iphone" label="联系电话" />
        <el-table-column label="是否管理员">
          <template slot-scope="scope">
            <label v-if="scope.row.Power == 3">全院管理</label>
            <label v-else-if="scope.row.Power == 2">科室管理</label>
            <label v-else-if="scope.row.Power == 1">追踪处理</label>
            <label v-else-if="scope.row.Power == 0">录入</label>
            <label v-else-if="scope.row.Power == -1">个人</label>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.CreateDate.split("T")[0] }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-link
              v-if="user.power >= scope.row.Power"
              type="primary"
              @click="editPerson(scope.row)"
              >编辑</el-link
            >
            <el-link
              type="danger"
              style="margin-left: 10px"
              v-if="user.power > scope.row.Power"
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
        label-position="right"
        label-width="100px"
        width="40%"
        style="max-width: 400px; margin-left: 5%"
        :model="addPerson"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="addPerson.name"
            clearable
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item label="用户编号">
          <el-input
            v-model="addPerson.number"
            :disabled="dialogType === 'edit' && addPerson.name != user.name"
            clearable
            placeholder="请输入用户编号"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="addPerson.password"
            type="password"
            :disabled="dialogType == 'edit' && addPerson.name != user.name"
            clearable
            placeholder="请输入用户密码"
          />
        </el-form-item>
        <el-form-item label="科室">
          <el-select
            v-model="addPerson.department"
            clearable
            filterable
            placeholder="请选择所属科室"
          >
            <el-option
              v-for="item in dept"
              :key="item.ID"
              :label="item.Name"
              :value="item.Name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input
            v-model="addPerson.phone"
            clearable
            placeholder="请输入联系电话"
          />
        </el-form-item>
        <el-form-item label="设置为管理员">
          <el-select v-model="addPerson.power">
            <el-option label="全院管理" :value="3">全院管理</el-option>
            <el-option label="科室管理" :value="2">科室管理</el-option>
            <el-option label="追踪处理" :value="1">追踪处理</el-option>
            <el-option label="录入" :value="0">录入</el-option>
            <el-option label="个人" :value="-1">个人</el-option>
          </el-select>
          <!-- <el-switch
            v-model="addPerson.Power"
            :disabled="user.power < 2"
            :active-value="2"
            :inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
          /> -->
        </el-form-item>
      </el-form>
      <div style="text-align: right; margin: 10px 10px 0">
        <el-button @click="(drawer = false), getUser()">取消</el-button>
        <el-button icon="el-icon-finished" type="primary" @click="confirm"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addUserInfo,
  getUserinfoByName,
  updateUser,
  deleteUser,
} from "@/api/employee";
import { getDept } from "@/api/dept";

export default {
  data() {
    return {
      userName: "",
      user: {
        name: this.$store.state.user.userInfo.Name,
        power: this.$store.state.user.userInfo.Power,
      },
      tableData: [],
      deptName: "",
      edit: false,
      drawer: false,
      isAdmin: false,
      addPerson: {
        department: "",
        phone: "",
        name: "",
        number: "",
        power: "",
        password: "",
        hospitalCode: this.$store.state.user.userInfo.hospitalCode,
        hospitalName: this.$store.state.user.userInfo.HospitalName,
      },
      dialogType: "",
      dept: [],
      Confirmpage: 1,
      ConfirmpageSize: 10,
    };
  },
  computed: {},
  mounted() {
    this.getUser();
    this.getDept();
  },
  methods: {
    editPerson(row) {
      this.dialogType = "edit";
      this.drawer = true;
      this.addPerson.power = row.Power;
      this.addPerson.department = row.Department;
      this.addPerson.phone = row.Iphone;
      this.addPerson.name = row.Name;
      this.addPerson.number = row.Number;
      this.addPerson.password = row.Password;
    },
    getDept() {
      getDept({
        hospitalCode: this.$store.state.user.userInfo.hospitalCode,
      }).then((res) => {
        this.dept = JSON.parse(res.d);
      });
    },
    getUser() {
      getUserinfoByName({
        Name: this.userName,
        hospitalCode: this.$store.state.user.userInfo.hospitalCode,
        power: this.$store.state.user.userInfo.Power,
        dept: this.$store.state.user.userInfo.Department,
      }).then((res) => {
        this.tableData = JSON.parse(res.d);
      });
    },
    confirm() {
      // if (this.addPerson.Power == "全院管理") {
      //   this.addPerson.Power = 3;
      // } else if (this.addPerson.Power == "科室管理") {
      //   this.addPerson.Power = 2;
      // } else if (this.addPerson.Power == "追踪处理") {
      //   this.addPerson.Power = 1;
      // } else if (this.addPerson.Power == "录入") {
      //   this.addPerson.Power = 0;
      // } else if (this.addPerson.Power == "个人") {
      //   this.addPerson.Power = -1;
      // }
      if (this.dialogType === "add") {
        this.addUser();
      } else {
        this.updateUser();
      }
    },
    openAddUser() {
      this.dialogType = "add";
      this.drawer = true;
      this.addPerson = {
        department: "",
        phone: "",
        name: "",
        number: "",
        power: "",
        password: "",
        hospitalCode: this.$store.state.user.userInfo.hospitalCode,
        hospitalName: this.$store.state.user.userInfo.HospitalName,
      };

      if (this.$store.state.user.userInfo.Power == 2) {
        this.addPerson.department = this.$store.state.user.userInfo.Department;
      }
    },
    addUser() {
      addUserInfo(this.addPerson).then((res) => {
        if (res.d === "Success") {
          this.$message({
            type: "success",
            message: "添加成功",
          });
          this.getUser();
          this.drawer = false;
        } else {
          this.$message({
            type: "warning",
            message: res.d,
          });
        }
      });
    },
    updateUser() {
      updateUser(this.addPerson).then((res) => {
        if (res.d == "Success") {
          this.$message({
            type: "success",
            message: "修改成功",
          });
          this.getUser();
          this.drawer = false;
        } else {
          this.$message({
            type: "warning",
            message: "修改失败",
          });
        }
      });
    },
    deleteUser(row) {
      this.$confirm("删除后不可恢复，是否确认删除？")
        .then((_) => {
          deleteUser({
            ID: row.ID,
          }).then((res) => {
            if (res.d == "Success") {
              this.$message({
                type: "success",
                message: "已删除",
              });
              this.getUser();
            } else {
              this.$message({
                type: "warning",
                message: "删除失败",
              });
            }
          });
        })
        .catch((_) => {});
    },

    handleCurrentChange(Confirmpage) {
      this.Confirmpage = Confirmpage;
    },
  },
};
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

