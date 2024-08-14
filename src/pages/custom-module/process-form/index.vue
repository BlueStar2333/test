<template>
  <div class="container">
    <transition name="popup-show">
      <Popup
        v-if="popupShow"
        @onClose="onClose"
        :editForm="editForm"
        @getData="getData"
      />
    </transition>

    <div class="head">
      <div>
        <el-input
          size="small"
          v-model="searchName"
          placeholder="按表名搜索"
          style="width: 200px; margin-right: 14px"
        />
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="getData(searchName)"
          >查询</el-button
        >
      </div>
      <el-button
        size="small"
        v-if="
          this.$store.state.user.userInfo.Power == 2 ||
          this.$store.state.user.userInfo.Power == 3
        "
        plain
        icon="el-icon-plus"
        @click="openAdd"
        type="primary"
        >添加</el-button
      >
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
      <el-table-column fiexd label="起始日期" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.diyStartDate.split("T")[0] }}
        </template>
      </el-table-column>
      <el-table-column fiexd label="截止日期" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.diyEndDate.split("T")[0] }}
        </template>
      </el-table-column>
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
          ></i>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
        align="center"
        v-if="
          this.$store.state.user.userInfo.Power == 2 ||
          this.$store.state.user.userInfo.Power == 3
        "
      >
        <template slot-scope="scope">
          <div class="operation">
            <el-link type="primary" @click="editDiyTable(scope.row)"
              >编辑</el-link
            >
            <el-link type="danger" @click="deleteDiyTable(scope.row.ID)"
              >删除</el-link
            >
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
import Pagination from "@/components/Pagination";
import Popup from "./components/popup";
import {
  deleteZCustomerTableData,
  getZCustomerTableData,
} from "@/api/custom-module";
import Preview from "./components/preview";
import { deepCopy } from "@/utils";

export default {
  name: "Index",
  components: {
    Pagination,
    Popup,
    Preview,
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      searchName: "",
      previewShow: false,
      diyForm: [],
      editForm: null,
      popupShow: false,
      searchModel: {
        startTime: "",
        endTime: "",
      },
      listLoading: true,
      total: 60,
      listQuery: {
        page: 1,
        limit: 10,
        sort: "+id",
      },
      tableData: [],
    };
  },
  created() {
    this.getData("");
  },
  methods: {
    handleCurrentChange(page) {
      this.listQuery.page = page;
    },
    getData(name) {
      this.listLoading = true;
      const requestData = {
        diyName: name,
        hospitalcode: this.$store.state.user.userInfo.hospitalCode,
      };
      getZCustomerTableData(requestData).then((res) => {
        // console.log(JSON.parse(res.d), 224)
        this.tableData = JSON.parse(res.d);
        this.listLoading = false;
      });
    },
    lookForm(data) {
      // console.log(data, 456);
      this.diyForm = deepCopy(data);
      if (typeof this.diyForm.diyContent === "string") {
        const newArr = [];
        newArr.push({
          title: "表单",
          name: "1",
          content: JSON.parse(this.diyForm.diyContent),
        });
        const names = JSON.parse(this.diyForm.diyFlowName);
        const contents = JSON.parse(this.diyForm.diyFlowContent);
        names.forEach((item, index) => {
          newArr.push({
            title: item,
            name: index === names.length - 1 ? "2" : index + 3 + "", // name:'2'是完成的tab
            content: contents[index],
          });
        });
        this.diyForm.diyContent = newArr;
      }
      this.previewShow = true;
    },

    openAdd() {
      this.popupShow = true;
      this.editForm = null;
    },

    editDiyTable(rowData) {
      // console.log(rowData, 546)
      this.editForm = rowData;
      this.popupShow = true;
    },

    deleteDiyTable(id) {
      this.$confirm("此操作将永久删除该表, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteZCustomerTableData({ id }).then((res) => {
            if (res.d === "Success") {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getData("");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    onClose() {
      this.popupShow = false;
    },

    sortChange(data) {
      const { prop, order } = data;
      this.tableData.reverse();
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getData();
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
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
