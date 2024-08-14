<template>
  <div class="right">
    <el-tabs v-model="activeName">
      <el-tab-pane label="组件设置" name="first">
        <p v-if="!componentData" class="prompt-text">请选择</p>
        <el-form v-else ref="form" label-width="80px" size="mini" label-position="left">
          <el-form-item label="唯一名称">
            <el-input v-model="componentData.uniqueName" />
          </el-form-item>
          <el-form-item label="标签">
            <el-input v-model="componentData.label" />
          </el-form-item>
          <el-form-item v-if="!radioShow && !dateShow" label="预置内容">
            <el-input v-model="componentData.content" />
          </el-form-item>
          <el-form-item v-if="dateShow" label="时间选择">
            <el-date-picker v-model="componentData.content" type="date" placeholder="选择日期" style="width: 100%" />
          </el-form-item>
          <el-form-item label="必填内容">
            <el-switch v-model="componentData.isNecessary" />
          </el-form-item>
          <div v-show="radioShow" class="setting">
            <el-divider>选项设置</el-divider>
            <div v-for="(item,index) in componentData.content" :key="index" class="setting-main">
              <el-radio v-show="componentData.type === 2" v-model="componentData.select" :label="item" />
              <el-checkbox v-show="componentData.type === 3" v-model="componentData.select" :label="item" />
              <el-input v-model="componentData.content[index]" size="mini" placeholder="请输入内容" style="width: 140px" />
              <img :src="dragIcon" width="22" height="22" style="" alt="拖拽">
              <img v-show="false" :src="dragBlueIcon" width="22" height="22" style="" alt="拖拽">
              <a class="setting-delete-btn" @click="deleteRadio(index)">-</a>
            </div>
            <div class="setting-link">
              <el-link :underline="false" type="primary" @click="componentData.content.push(`选项${componentData.content.length + 1}`)">增加选项</el-link>
              <el-link :underline="false" type="primary" @click="componentData.select = []">重设选中项</el-link>
            </div>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="表单设置" name="second">
        <el-form ref="form" class="form-setting" label-width="80px" size="mini">
          <el-form-item label="表名">
            <el-input v-model="diyForm.diyName" placeholder="请输入表名" />
          </el-form-item>
          <el-form-item label="表说明">
            <el-input v-model="diyForm.diyDescription" type="textarea" autosize placeholder="请输入此表的描述,目的等" />
          </el-form-item>
          <el-form-item label="起始日期">
            <el-date-picker v-model="diyForm.diyStartDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="截止日期">
            <el-date-picker v-model="diyForm.diyEndDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%;" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'PopupRight',
  props: {
    editForm: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      activeName: 'first',
      dragIcon: require('../../../assets/icons/drag.svg'),
      dragBlueIcon: require('../../../assets/icons/drag-blue.svg'),
      diyForm: {
        diyName: '',
        diyDescription: '',
        diyStartDate: '',
        diyEndDate: ''
      },
      componentData: null
    }
  },
  computed: {
    radioShow() {
      return this.componentData.type === 2 || this.componentData.type === 3
    },
    dateShow() {
      return this.componentData.type === 4
    }
  },
  mounted() {
    this.$eventBus.$on('selectInput', this.selectInput)
    this.$eventBus.$on('getDiyData', this.getDiyData)
    this.$eventBus.$on('changeTab', this.changeTab)
    if (this.editForm) {
      this.diyForm = {
        diyName: this.editForm.diyName,
        diyDescription: this.editForm.diyDescription,
        diyStartDate: this.editForm.diyStartDate,
        diyEndDate: this.editForm.diyEndDate
      }
    }
  },
  methods: {
    init(data) {
    },
    changeTab(tab) {
      this.activeName = tab
    },
    selectInput(data) {
      this.changeTab('first')
      this.componentData = data
      // console.log(this.componentData)
    },
    getDiyData(cb) {
      cb(this.diyForm)
    },
    deleteRadio(index) {
      if (this.componentData.content.length === 1) {
        this.$message({
          message: '至少保留一个选项',
          type: 'warning'
        })
        return
      }
      this.componentData.content.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.right {
  flex: 0 0 300px;
  border-left: 1px dotted #999;
  padding: 0 6px;
}
.prompt-text {
  font-size: 30px;
  color: #cecece;
  margin-top: 200px;
  text-align: center;
}
.setting {
  max-height: 500px;
  overflow: auto;
}
.setting-main {
  padding: 4px 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  ::v-deep .el-radio__label,::v-deep .el-checkbox__label {
    display: none;
  }
  ::v-deep .el-radio,::v-deep .el-checkbox__input {
    margin-right: 10px;
  }
  .setting-delete-btn {
    color: #f56c6c;
    background: #fef0f0;
    border-color: #fbc4c4;
    width: 28px;
    height: 28px;
    display: inline-block;
    text-align: center;
    line-height: 24px;
    font-size: 28px;
    border-radius: 50%;
    &:hover {
      background-color: #F66A6E;
      color: #fff;
    }
  }
}
.setting-link {
  opacity: .7;
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}

.form-setting {
  ::v-deep .el-form-item__label {
    text-align: center;
  }
}
</style>
