<template>
  <div class="middle">
    <div class="head">
      <el-link class="head-link" :underline="false" type="primary" @click="deleteInput(0, formData.length)" icon="el-icon-delete">清空</el-link>
      <el-link class="head-link" :underline="false" type="primary" @click="previewTable" icon="el-icon-view">预览</el-link>
      <el-link v-if="editForm" class="head-link" :underline="false" type="primary" @click="edit" icon="el-icon-document-checked">确认修改</el-link>
      <el-link v-else class="head-link" :underline="false" type="primary" @click="save" icon="el-icon-document-add">保存上传</el-link>
    </div>
    <div v-show="formData.length === 0" class="description">
      <p>请从左侧列表中选择一个组件,</p>
      <p>然后用鼠标拖动组件放置于此处.</p>
    </div>
    <div class="body" @drop="drop($event)" @dragover="allowDrop($event)">
      <div v-for="(itemA,index) in formData" :key="index" class="body-input" @click="selectInput(index,formData[index])">
        <h5 :class="{'body-input-label':true,'required':itemA.isNecessary}">{{ index+1 + '.' + itemA.label }}</h5>
        <el-input v-if="itemA.type === 0" v-model="formData[index].content" class="body-input-content" size="small" placeholder="请输入内容" />
        <el-input v-if="itemA.type === 1" v-model="formData[index].content" class="body-input-content" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" />
        <div v-if="itemA.type === 2" class="body-input-select">
          <el-radio v-for="(itemB, idx) in itemA.content" :key="idx" v-model="itemA.select" :label="itemB">{{ itemB }}</el-radio>
        </div>
        <el-checkbox-group v-if="itemA.type === 3" v-model="itemA.select" class="body-input-select">
          <el-checkbox v-for="(itemB, idx) in itemA.content" :key="idx" :label="itemB">{{ itemB }}</el-checkbox>
        </el-checkbox-group>
        <el-date-picker v-if="itemA.type === 4" v-model="formData[index].content" class="body-input-content" type="date" size="small" placeholder="选择日期" />
        <el-input-number v-if="itemA.type === 5" v-model="formData[index].content" :min="1" :max="10000" label="数"></el-input-number>
        <div v-if="itemA.type === 20" class="body-input-content select-department">请选择</div>
        <!--    选中框    -->
        <div v-show="selectIndex === index" class="body-input-nav">
          <span class="nav-name"><i class="el-icon-rank" /> {{ typeMap[itemA.type] }}</span>
          <div class="nav-menu">
            <a><i class="el-icon-back nav-menu-back" @click.stop="selectIndex = -1"/></a>
            <a><i class="el-icon-bottom nav-menu-bottom" @click.stop="switchPlaces(index, index+1)"/></a>
            <a><i class="el-icon-top nav-menu-top" @click.stop="switchPlaces(index, index-1)"/></a>
            <a><i class="el-icon-delete" @click="deleteInput(index, 1)"/></a>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      :modal-append-to-body="false"
      title="预览"
      :visible.sync="previewShow"
      width="32%"
      center>
      <Preview v-if="previewShow" :preview-data="diyForm"/>
    </el-dialog>
  </div>
</template>

<script>
import inputData from '@/config/input-data'
import { deepClone } from '@/utils'
import { addCustomTable, editCustomTable } from '@/api/custom-module'
import Preview from './preview'

// 必填内容未填提示映射表
const warningMap = {
  'diyName': '请填写表名',
  'diyDescription': '请填写表说明',
  'diyStartDate': '请选择起始时间',
  'diyEndDate': '请选择截止时间'
}
export default {
  name: 'PopupMiddle',
  components: {
    Preview
  },
  inheritAttrs: false,
  props: {
    editForm: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      previewShow: false,
      selectIndex: -1,
      formData: [],
      typeMap: ['单行文本', '多行文本', '单选框', '多选框', '日期选择'],
      diyForm: null
    }
  },
  mounted() {
    if (this.editForm) {
      this.formData = this.editForm.diyContent
    }
  },
  methods: {
    drop(e) {
      const inputType = e.dataTransfer.getData('type')
      const newInputData = deepClone(inputData[inputType])
      this.formData.push(newInputData)
      // console.log(inputType)
    },
    allowDrop(e) {
      e.preventDefault()
      // console.log(inputData, e, e.offsetX, e.offsetY, 10)
    },
    selectInput(index, input) {
      this.selectIndex = index
      // console.log(input, 456)
      this.$eventBus.$emit('selectInput', input)
    },
    // 两表单交换位置
    switchPlaces(oldIndex, newIndex) {
      if (newIndex === -1) {
        this.$message('已经移动到最上面')
        return
      }
      if (newIndex === this.formData.length) {
        this.$message('已经移动到最下面')
        return
      }
      const oldValue = this.formData[oldIndex]
      const newValue = this.formData[newIndex]
      this.formData.splice(oldIndex, 1, newValue)
      this.formData.splice(newIndex, 1, oldValue)
      this.selectIndex = newIndex
      // console.log(oldValue.type,this.formData[oldIndex].type)
      // this.formData[oldIndex] = newValue
      // this.formData[newIndex] = oldValue
      // console.log(oldValue.type,this.formData[oldIndex].type)
    },
    deleteInput(index, num) {
      this.$eventBus.$emit('selectInput', null)
      this.formData.splice(index, num)
    },
    previewTable() {
      const self = this
      this.$eventBus.$emit('getDiyData', function(form) {
        self.diyForm = form
      })
      this.diyForm.diyContent = this.formData
      this.previewShow = true
    },
    checkForm() {
      let ret = false
      for (const key in warningMap) {
        if (this.diyForm[key] === '') {
          this.$eventBus.$emit('changeTab', 'second')
          this.$message({
            message: warningMap[key],
            type: 'warning'
          })
          ret = true
          break
        }
        ret = false
      }
      return ret
    },
    save() {
      const self = this
      this.$eventBus.$emit('getDiyData', function(form) {
        self.diyForm = form
      })
      // console.log(this.$store.state.user.userInfo,456)
      if (this.checkForm()) {
        return
      }
      this.diyForm.diyContent = JSON.stringify(this.formData)
      this.diyForm.diyUser = this.$store.state.user.userInfo.Name
      this.diyForm.hospitalcode = this.$store.state.user.userInfo.HospitalName
      addCustomTable(this.diyForm).then(res => {
        if (res.d === 'Success') {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$emit('getData', '')
          this.$emit('onClose')
          this.$eventBus.$emit('refresh')
        }
      })
    },
    edit() {
      const self = this
      this.$eventBus.$emit('getDiyData', function(form) {
        self.diyForm = form
      })
      if (this.checkForm()) {
        return
      }
      this.diyForm.diyContent = JSON.stringify(this.formData)
      this.diyForm.diyUser = this.$store.state.user.userInfo.Name
      this.diyForm.hospitalcode = this.$store.state.user.userInfo.HospitalName
      this.diyForm.createtime = this.editForm.createtime
      this.diyForm.ID = this.editForm.ID
      editCustomTable(this.diyForm).then(res => {
        if (res.d === 'Success') {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$emit('onClose')
          this.$eventBus.$emit('refresh')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.middle {
  position: relative;
  flex: 1;
  min-width: 430px;
  background-color: #f1f2f3;
  overflow: auto;
}
::v-deep .el-dialog__header {
  background-color: #f1f2f3;
  .el-dialog__title {
    color: #999;
  }
}
.head {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: right;
  padding: 0 30px;
  background-color: #FEFEFE;
  .head-link {
    margin: 0 6px;
  }
}
.description {
  position: absolute;
  top: 360px;
  width: 100%;
  text-align: center;
  color: #999;
}
.body {
  width: 420px;
  min-height: 720px;
  background-color: #fff;
  margin: 10px auto;
  padding: 10px 12px 22px;
  border: 10px solid #4A4F5F;
  border-radius: 20px;
}
.body-input {
  position: relative;
  .required:before {
    content: '*';
    color: red;
    margin: 0 2px;
  }
  .body-input-label {
    font-weight: 500;
    margin: 14px 0 8px;
    color: #868686;
  }
  ::v-deep {
    .el-textarea__inner,.el-input__inner,.el-checkbox__label,.el-radio__label {
      color: #666;
    }
  }
  .body-input-select {
    padding: 6px;
    background-color: #fdfdfd;
    border-radius: 4px;
  }
  .select-department {
    background-color: #fefefe;
    border: 1px solid #d3d3d3;
    border-radius: 4px;
    text-align: center;
    line-height: 40px;
    height: 40px;
    color: #d2d2d2;
    cursor: not-allowed;
  }
}

.body-input-nav {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid #409eff;
  .nav-name {
    position: absolute;
    top: 0;
    font-size: 14px;
    color: #fff;
    padding: 4px 10px 4px 4px;
    background-color: rgba(64,158,255,.8);
    cursor: move;
  }
  .nav-menu {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: #409eff;
    padding: 6px 0 4px 6px;
    color: #fff;
    a {
      margin-right: 6px;
    }
    .nav-menu-back {
      font-size: 14px;
    }
    .nav-menu-bottom {
      font-size: 14px;
    }
    .nav-menu-top {
      position: relative;
      top: 2px;
    }
  }
}
</style>
