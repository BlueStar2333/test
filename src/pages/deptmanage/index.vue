<template>
  <div class="personnel-management">
    <div class="box-card pm-search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="deptName"
            clearable
            placeholder="根据科室名称查询"
          />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getDept"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-plus"
            type="primary"
            @click="(dialogType = 'add'), (drawer = true)"
            >科室添加</el-button
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
        <el-table-column prop="Name" label="科室名称" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="
                (dialogType = 'edit'), (drawer = true), (dept = scope.row)
              "
              >编辑</el-link
            >
            <el-link
              type="danger"
              style="margin-left: 10px"
              @click="deleteDept(scope.row)"
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
        :model="dept"
      >
        <el-form-item label="科室名称">
          <el-input
            v-model="dept.Name"
            clearable
            placeholder="请输入科室名称"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: right; margin: 10px 10px 0">
        <el-button @click="(drawer = false), getDept()">取消</el-button>
        <el-button icon="el-icon-finished" type="primary" @click="confirm"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
import { getDeptByName, AddDept, UpdateDept, DeleteDept } from "@/api/dept";

export default {
  data() {
    return {
      deptName: "",
      tableData: [],
      drawer: false,
      dept: {},
      dialogType: "",
      Confirmpage: 1,
      ConfirmpageSize: 10,
    };
  },
  computed: {},
  mounted() {
    this.getDept();
  },
  methods: {
    getDept() {
      getDeptByName({
        hospitalCode: this.$store.state.user.userInfo.hospitalCode,
        Name: this.deptName,
      }).then((res) => {
        this.tableData = JSON.parse(res.d);
      });
    },
    confirm() {
      if (this.dialogType == "add") {
        this.addDept();
      } else {
        this.editDept();
      }
    },
    addDept() {
      AddDept({
        hospitalCode: this.$store.state.user.userInfo.hospitalCode,
        Name: this.dept.Name,
      }).then((res) => {
        if (res.d == "Success") {
          this.$message({
            type: "success",
            message: "添加成功",
          });
          this.getDept();
          this.drawer = false;
        } else {
          this.$message({
            type: "warning",
            message: "添加失败",
          });
        }
      });
    },
    editDept() {
      UpdateDept({ ID: this.dept.ID, Name: this.dept.Name }).then((res) => {
        if (res.d == "Success") {
          this.$message({
            type: "success",
            message: "修改成功",
          });
          this.getDept();
          this.drawer = false;
        } else {
          this.$message({
            type: "warning",
            message: "修改失败",
          });
        }
      });
    },
    deleteDept(row) {
      this.$confirm("删除后不可恢复，是否确定")
        .then((_) => {
          DeleteDept({ ID: row.ID }).then((res) => {
            if (res.d == "Success") {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.getDept();
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
  
  