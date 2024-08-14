<template>
  <div class="middle">
    <div class="head">
      <el-link class="head-link" :underline="false" type="primary" icon="el-icon-delete" @click="clearData">清空</el-link>
      <el-link class="head-link" :underline="false" type="primary" icon="el-icon-view" @click="previewTable">预览</el-link>
      <el-link v-if="editForm" class="head-link" :underline="false" type="primary" icon="el-icon-document-checked" @click="edit">确认修改</el-link>
      <el-link v-else class="head-link" :underline="false" type="primary" icon="el-icon-document-add" @click="save">保存上传</el-link>
    </div>
    <div class="body">
      <el-tabs v-model="editableTabsValue" class="body-tabs" type="card" editable @edit="handleTabsEdit">
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <div class="tab-pane" @drop="drop($event,index)" @dragover="allowDrop($event)">
            <div v-show="item.content.length === 0" class="description">
              <div v-if="index === editableTabs.length - 1">
                <p>完成流程为最后一个流程，不可添加表单！</p>
              </div>
              <div v-else>
                <p>请从左侧列表中选择一个组件,</p>
                <p>然后用鼠标拖动组件放置于此处.</p>
              </div>
            </div>
            <div v-for="(itemA,idx) in item.content" :key="idx" class="body-input" @click="selectInput([index,idx],itemA)">
              <h5 :class="{'body-input-label':true,'required':itemA.isNecessary}">{{ idx+1 + '.' + itemA.label }}</h5>
              <el-input v-if="itemA.type === 0" v-model="itemA.content" class="body-input-content" size="small" placeholder="请输入内容" />
              <el-input v-if="itemA.type === 1" v-model="itemA.content" class="body-input-content" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" />
              <div v-if="itemA.type === 2" class="body-input-select">
                <el-radio v-for="(itemB, idx) in itemA.content" :key="idx" v-model="itemA.select" :label="itemB">{{ itemB }}</el-radio>
              </div>
              <el-checkbox-group v-if="itemA.type === 3" v-model="itemA.select" class="body-input-select">
                <el-checkbox v-for="(itemB, idx) in itemA.content" :key="idx" :label="itemB">{{ itemB }}</el-checkbox>
              </el-checkbox-group>
              <el-date-picker v-if="itemA.type === 4" v-model="itemA.content" class="body-input-content" type="date" size="small" placeholder="选择日期" />
              <el-input-number v-if="itemA.type === 5" v-model="itemA.content" :min="1" :max="10000" label="数" />
              <div v-if="itemA.type === 20" class="body-input-content select-department">请选择</div>
              <!--    选中框    -->
              <div v-show="selectIndex[0] === index && selectIndex[1] === idx" class="body-input-nav">
                <span class="nav-name"><i class="el-icon-rank" /> {{ typeMap[itemA.type] }}</span>
                <div class="nav-menu">
                  <a><i class="el-icon-back nav-menu-back" @click.stop="selectIndex = [-1,-1]" /></a>
                  <a><i class="el-icon-bottom nav-menu-bottom" @click.stop="switchPlaces(idx, idx+1)" /></a>
                  <a><i class="el-icon-top nav-menu-top" @click.stop="switchPlaces(idx, idx-1)" /></a>
                  <a><i class="el-icon-delete" @click="deleteInput(item.content, idx)" /></a>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog
      :modal-append-to-body="false"
      title="预览"
      :visible.sync="previewShow"
      width="32%"
      center
    >
      <Preview v-if="previewShow" :preview-data="diyForm" />
    </el-dialog>
  </div>
</template>

<script>
import inputData from '@/config/input-data'
import { deepClone } from '@/utils'
import { addZCustomerTableData, updateZCustomerTableData } from '@/api/custom-module'
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
      selectIndex: [],
      typeMap: ['单行文本', '多行文本', '单选框', '多选框', '日期选择'],
      diyForm: null,
      editableTabsValue: '1',
      editableTabs: [{
        title: '表单',
        name: '1',
        content: []
      }, {
        title: '完成',
        name: '2',
        content: []
      }],
      tabIndex: 2
    }
  },
  mounted() {
    // console.log(this.editForm, 25636)
    if (this.editForm) {
      this.editableTabs = []
      this.editableTabs.push({
        title: '表单',
        name: '1',
        content: JSON.parse(this.editForm.diyContent)
      })
      const names = JSON.parse(this.editForm.diyFlowName)
      const contents = JSON.parse(this.editForm.diyFlowContent)
      names.forEach((item, index) => {
        this.editableTabs.push({
          title: item,
          name: index === names.length - 1 ? '2' : index + 3 + '', // name:'2'是完成的tab
          content: contents[index]
        })
      })
    }
  },
  methods: {
    // 拖拽释放后向对应tab添加表单
    drop(e, index) {
      if (index === this.editableTabs.length - 1) {
        return
      }
      const inputType = e.dataTransfer.getData('type')
      const newInputData = deepClone(inputData[inputType])
      this.editableTabs[index].content.push(newInputData)
    },
    allowDrop(e) {
      e.preventDefault()
      // console.log(inputData, e, e.offsetX, e.offsetY, 10)
    },
    selectInput(indexArr, input) {
      this.selectIndex = indexArr
      const inputData = this.editableTabs[indexArr[0]].content[indexArr[1]]
      // console.log(input, 456)
      this.$eventBus.$emit('selectInput', inputData)
    },
    // 两表单交换位置
    switchPlaces(oldIndex, newIndex) {
      const tabIndex = this.selectIndex[0]
      if (newIndex === -1) {
        this.$message('已经移动到最上面')
        return
      }
      if (newIndex === this.editableTabs[tabIndex].content.length) {
        this.$message('已经移动到最下面')
        return
      }
      const oldValue = this.editableTabs[tabIndex].content[oldIndex]
      const newValue = this.editableTabs[tabIndex].content[newIndex]
      this.editableTabs[tabIndex].content.splice(oldIndex, 1, newValue)
      this.editableTabs[tabIndex].content.splice(newIndex, 1, oldValue)
      this.selectIndex = [tabIndex, newIndex]
    },
    deleteInput(data, index) {
      this.$eventBus.$emit('selectInput', null)
      data.splice(index, 1)
    },
    clearData() {
      this.$eventBus.$emit('selectInput', null)
      this.editableTabs.forEach(item => {
        item.content = []
      })
    },
    previewTable() {
      const self = this
      this.$eventBus.$emit('getDiyData', function(form) {
        self.diyForm = form
      })
      this.diyForm.diyContent = this.editableTabs
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
      this.diyForm.diyUser = this.$store.state.user.userInfo.Name
      this.diyForm.hospitalcode = this.$store.state.user.userInfo.hospitalCode
      this.diyForm.diyContent = ''
      const diyFlowName = []
      const diyFlowContent = []
      this.editableTabs.forEach((item, index) => {
        if (index === 0) {
          this.diyForm.diyContent = JSON.stringify(item.content)
        } else {
          diyFlowName.push(item.title)
          diyFlowContent.push(item.content)
        }
      })
      this.diyForm.diyFlowName = JSON.stringify(diyFlowName)
      this.diyForm.diyFlowContent = JSON.stringify(diyFlowContent)
      addZCustomerTableData(this.diyForm).then(res => {
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
      this.diyForm.ID = this.editForm.ID
      this.diyForm.diyContent = ''
      const diyFlowName = []
      const diyFlowContent = []
      this.editableTabs.forEach((item, index) => {
        if (index === 0) {
          this.diyForm.diyContent = JSON.stringify(item.content)
        } else {
          diyFlowName.push(item.title)
          diyFlowContent.push(item.content)
        }
      })
      this.diyForm.diyFlowName = JSON.stringify(diyFlowName)
      this.diyForm.diyFlowContent = JSON.stringify(diyFlowContent)
      updateZCustomerTableData(this.diyForm).then(res => {
        if (res.d === 'Success') {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$emit('getData', '')
          this.$emit('onClose')
          this.$eventBus.$emit('refresh')
        }
      })
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        this.$prompt('', '请输入要添加的流程名', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          const newTabName = ++this.tabIndex + ''
          this.editableTabs.splice(-1, 0, {
            title: value,
            name: newTabName,
            content: []
          })
          this.editableTabsValue = newTabName
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消添加'
          })
        })
      }
      if (action === 'remove') {
        const tabs = this.editableTabs
        let activeName = this.editableTabsValue
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }

        this.editableTabsValue = activeName
        this.editableTabs = tabs.filter(tab => tab.name !== targetName)
      }
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
  top: 280px;
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
  margin: 4px;
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

.body-tabs {
  ::v-deep #tab-1,::v-deep #tab-2 {
    .el-icon-close {
      display: none;
    }
  }
  ::v-deep #tab-1 {
    font-size: 16px;
    font-weight: 600;
    background-color: #f5f5f5;
  }
  ::v-deep .el-tabs__item {
    font-size: 10px;
  }
}

.tab-pane {
  min-height: 600px;
}
</style>
