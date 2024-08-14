<template>
  <div class="personnel-management">
    <div class="box-card pm-search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="fileName"
            clearable
            placeholder="根据文件名称查询"
          />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getData"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-folder-add"
            type="primary"
            @click="uploadFile = true"
            >上传文件</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="上传文件"
      :before-close="handleClose"
      :visible.sync="uploadFile"
      width="25%"
    >
      <el-select
        v-model="addData.fileType"
        clearable
        filterable
        placeholder="请选择文件类型"
        style="width: 60%"
      >
        <el-option
          label="职业暴露处理流程"
          value="职业暴露处理流程"
        ></el-option>
        <el-option label="培训内容" value="培训内容"></el-option>
        <el-option
          label="职业暴露案例展示"
          value="职业暴露案例展示"
        ></el-option>
      </el-select>
      <el-upload
        multiple
        :action="
          url +
          'UploadFile?hospitalCode=' +
          user.hospitalCode +
          '&fileType=' +
          addData.fileType
        "
        class="upload-demo"
        ref="upload"
        :file-list="fileList"
        :on-error="uploadFileError"
        :on-success="uploadFileSuccess"
        :before-upload="filesBeforeUpload"
        :auto-upload="false"
        style="margin-top: 20px"
      >
        <el-button
          slot="trigger"
          icon="el-icon-zoom-in"
          size="small"
          type="primary"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px"
          icon="el-icon-upload"
          size="small"
          type="success"
          @click="submitUpload"
          >上传到服务器</el-button
        >
      </el-upload>
    </el-dialog>

    <div class="box-card pm-body-table">
      <el-table
        :data="tableData.slice((page - 1) * pageSize, page * pageSize)"
        border
      >
        <el-table-column prop="fileName" label="文件名称" />
        <el-table-column prop="fileType" label="文件类型" />
        <el-table-column prop="inUser" label="创建人" />
        <el-table-column label="创建日期">
          <template slot-scope="scope">
            {{ scope.row.inDate.split("T")[0] }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link
              type="success"
              style="margin-left: 10px"
              @click="downFile(scope.row)"
              >下载
            </el-link>
            <el-link
              type="danger"
              style="margin-left: 10px"
              @click="delFile(scope.row)"
              >删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="tableData.length"
          @current-change="currentPage"
        />
      </div>
    </div>
  </div>
</template>
  
<script>
import { addFileData, getFileData, deleteFileData } from "@/api/uploadFile";

export default {
  data() {
    return {
      uploadFile: false,
      uploadFlag: false,
      fileName: "",
      tableData: [],
      page: 1,
      pageSize: 10,
      fileList: [],
      url: "",
      user: {},
      addData: {
        hospitalCode: "",
        fileType: "",
        fileName: "",
        inUser: "",
      },
    };
  },
  mounted() {
    this.user = this.$store.state.user.userInfo; //hospitalCode,Name
    this.url = sessionStorage.getItem("url");
    this.addData.hospitalCode = this.user.hospitalCode;
    this.addData.inUser = this.user.Name;
    this.getData();
  },
  methods: {
    getData() {
      getFileData({
        hospitalCode: this.addData.hospitalCode,
        fileName: this.fileName,
      }).then((res) => {
        this.tableData = JSON.parse(res.d);
      });
    },
    downFile(row) {
      let baseUrl =
        this.url.split("XgqkdcService")[0] +
        "/LearningFile/" +
        row.hospitalCode +
        "/" +
        row.fileType +
        "/" +
        row.fileName;
      if (row.fileName.includes("txt")) {
        fetch(baseUrl)
          .then((response) => response.text())
          .then((text) => {
            const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            window.open(url);
          });
      } else {
        window.open(baseUrl);
      }
    },
    delFile(row) {
      this.$confirm("删除后不可恢复，是否确定")
        .then((_) => {
          deleteFileData({ id: row.ID }).then((res) => {
            if (res.d == "Success") {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.getData();
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
    submitUpload() {
      if (this.addData.fileType.length > 0) {
        this.uploadFlag = true;
        this.$refs.upload.submit();
      } else {
        this.$message({
          message: "请选择文件类型",
          type: "warning",
        });
        return false;
      }
    },
    //文件上传失败
    uploadFileError() {
      this.$message({
        message: "文件上传失败",
        type: "error",
      });
    },
    //文件上传之前
    filesBeforeUpload(file) {
      if (!file) {
        this.$message({
          message: "上传文件不能为空",
          type: "warning",
        });
        return false;
      } else {
        this.addData.fileName = file.name;
      }
    },
    //文件上传成功后提交数据
    uploadFileSuccess() {
      if (this.uploadFlag) {
        this.addFileData();
      }
    },
    addFileData() {
      addFileData(this.addData).then((res) => {
        if (res.d == "Success") {
          this.$message({
            type: "success",
            message: "上传成功",
          });
          this.getData();
          this.uploadFile = false;
        } else {
          this.$message({
            type: "warning",
            message: "上传失败",
          });
        }
      });
    },
    currentPage(page) {
      this.page = page;
    },
    handleClose(done) {
      this.fileList = [];
      this.addData.fileType = "";
      done();
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
  
  