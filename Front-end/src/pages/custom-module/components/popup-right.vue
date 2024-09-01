<template>
  <div class="right">
    <el-tabs v-model="activeName">
      <el-tab-pane label="组件设置" name="first">
        <p v-if="!componentData" class="prompt-text">请选择</p>
        <el-form v-else ref="form" label-width="80px" size="mini" label-position="left">
          <el-form-item label="表单类型">
            <el-input v-model="componentData.uniqueName" :placeholder="typeMap[componentData.type]" disabled />
          </el-form-item>
          <el-form-item label="标签">
            <el-input v-model="componentData.label" />
          </el-form-item>
          <el-form-item v-if="inputShow" label="正则规则">
            <el-input v-model="componentData.regularRule" placeholder="请输入正则匹配规则" />
          </el-form-item>
          <el-form-item v-if="inputShow" label="错误提示">
            <el-input v-model="componentData.regularTips" placeholder="正则验证错误时给出提示" />
          </el-form-item>
          <el-form-item v-if="suggestionShow" label="建议内容">
            <el-input v-model="componentData.suggestion" placeholder="每条建议,隔开" />
          </el-form-item>
          <el-form-item v-if="!radioShow && !dateShow && !tableShow" label="预置内容">
            <div class="forms">
              <el-autocomplete v-if="suggestionShow" v-model="componentData.content" class="inline-input" :fetch-suggestions="querySearch" placeholder="请输入内容" />
              <el-input v-else-if="inputShow" v-model="componentData.content" :class="{ 'verify-error': componentData.regularError }" @input="validateInput(componentData.regularRule, componentData.content)" placeholder="可验证正则规则是否正确"/>
              <el-input v-else v-model="componentData.content" placeholder="请输入内容"/>
              <span v-if="componentData.regularError" class="regular-tips">{{ componentData.regularTips }}</span>
            </div>
          </el-form-item>
          <el-form-item v-if="dateShow" label="时间选择">
            <el-date-picker v-model="componentData.content" :type="componentData.dateType" placeholder="选择日期" style="width: 100%" />
          </el-form-item>
          <el-form-item v-if="numShow || sliderShow" label="最小范围">
            <el-input-number v-model="componentData.min" :min="0" :max="10000" size="small" label="描述文字" />
          </el-form-item>
          <el-form-item v-if="!radioShow && !dateShow && !suggestionShow && !tableShow" label="最大范围">
            <el-input-number v-model="componentData.max" :min="componentData.min" :max="10000" size="small" label="描述文字" />
          </el-form-item>
          <el-form-item v-if="dateShow" label="时间类型">
            <el-switch v-model="componentData.dateType" active-text="datetime型" inactive-text="date型" active-value="datetime" inactive-value="date" inactive-color="#67C23A"></el-switch>
          </el-form-item>
          <el-form-item v-if="!tableShow && !sliderShow" label="必填项">
            <el-switch v-model="componentData.isNecessary" />
          </el-form-item>
          <el-form-item v-if="!tableShow" label="校验值">
            <el-switch v-model="componentData.checkValue" @change="changeSwitch" />
          </el-form-item>
          <div v-show="radioShow" class="setting">
            <el-divider>选项设置</el-divider>
            <div v-for="(item,index) in componentData.select" :key="index" class="setting-main">
              <el-radio v-show="componentData.type === 2" v-model="componentData.content" :label="item" />
              <el-checkbox v-show="componentData.type === 3" v-model="componentData.content" :label="item" />
              <el-input v-model="componentData.select[index]" size="mini" placeholder="请输入内容" style="width: 140px" />
              <img :src="dragIcon" width="22" height="22" style="" alt="拖拽">
              <img v-show="false" :src="dragBlueIcon" width="22" height="22" style="" alt="拖拽">
              <a class="setting-delete-btn" @click="deleteRadio(index)">-</a>
            </div>
            <div class="setting-link">
              <el-link :underline="false" type="primary" @click="componentData.select.push(`选项${componentData.select.length + 1}`)">增加选项</el-link>
              <el-link :underline="false" type="primary" @click="componentData.content = []">重设选中项</el-link>
            </div>
          </div>
          <div v-show="tableShow" class="setting">
            <el-divider>自增表设置</el-divider>
            <div v-for="(item,index) in componentData.header" :key="index" class="setting-main">
              <span class="setting-main-span">列{{ index+1 }}：</span>
              <el-input v-model="componentData.header[index]" size="mini" placeholder="请输入内容" style="width: 130px" />
              <el-link class="setting-setting-btn" icon="el-icon-setting" @click="tableSetting(index)"/>
              <a class="setting-delete-btn" @click="decreaseTableColumn(index)">-</a>
            </div>
            <div class="setting-link">
              <el-link :underline="false" type="primary" @click="addTableColumn()">增加列</el-link>
            </div>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="表单设置" name="second">
        <el-form ref="form" class="form-setting" label-width="80px" size="mini">
          <el-form-item label="表名">
            <el-input v-model="diyForm.table_name" placeholder="请输入表名" />
          </el-form-item>
          <el-form-item label="表说明">
            <el-input v-model="diyForm.description" type="textarea" :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入此表的描述,目的等" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      :title="'第' + (columnIdx + 1) + '列'"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      append-to-body="true"
    >
      <ColumnForm v-if="dialogVisible" ref="ColumnForm" :component-data="componentData" :column-idx="columnIdx"/>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureColumn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ColumnForm from './column-form.vue'
export default {
  name: 'PopupRight',
  components: { ColumnForm },
  props: {
    editForm: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: false,
      activeName: 'first',
      dragIcon: require('../../../assets/icons/drag.svg'),
      dragBlueIcon: require('../../../assets/icons/drag-blue.svg'),
      diyForm: {
        table_name: '',
        description: '',
        check_number: 1 // 初始值为1（人员id）
      },
      typeMap: {
        0: '单行文本',
        1: '多行文本',
        2: '单选框',
        3: '多选框',
        4: '日期选择',
        5: '数量选择',
        6: '滑动条',
        7: '带建议输入',
        20: '自增表格'
      },
      componentData: null,
      columnIdx: 0
    }
  },
  computed: {
    inputShow() {
      return this.componentData.type === 0 || this.componentData.type === 1
    },
    radioShow() {
      return this.componentData.type === 2 || this.componentData.type === 3
    },
    tableShow() {
      return this.componentData.type === 20
    },
    dateShow() {
      return this.componentData.type === 4
    },
    numShow() {
      return this.componentData.type === 5
    },
    sliderShow() {
      return this.componentData.type === 6
    },
    suggestionShow() {
      return this.componentData.type === 7
    }
  },
  mounted() {
    this.$eventBus.$on('selectInput', this.selectInput)
    this.$eventBus.$on('getDiyData', this.getDiyData)
    this.$eventBus.$on('changeTab', this.changeTab)
    this.$eventBus.$on('changeNum', this.changeNum)
    if (this.editForm) {
      this.diyForm = {
        table_name: this.editForm.table_name,
        description: this.editForm.description,
        check_number: this.editForm.check_number
      }
    }
  },
  methods: {
    init(data) {
    },
    validateInput(rule, txt) {
      console.log(this.componentData)
      const regex = new RegExp(rule)
      if (!regex.test(txt)) {
        this.componentData['regularError'] = true
        console.log(11111)
      } else {
        this.componentData['regularError'] = false
        console.log('正确')
      }
    },
    changeSwitch(bool) {
      if (bool) {
        this.diyForm.check_number++
      } else {
        this.diyForm.check_number--
      }
      console.log(this.diyForm.check_number)
    },
    changeTab(tab) {
      this.activeName = tab
    },
    changeNum(num) {
      this.diyForm.check_number = num
    },
    selectInput(data) {
      this.changeTab('first')
      this.componentData = data
      // console.log(this.componentData)
    },
    getDiyData(cb) {
      cb(this.diyForm)
    },
    tableSetting(index) {
      this.columnIdx = index
      this.dialogVisible = true
    },
    sureColumn() {
      const aColumnForm = this.$refs.ColumnForm.formData
      console.log(this.componentData.bodyForm[this.columnIdx], this.$refs.ColumnForm.formData, 996)
      this.componentData.bodyForm[this.columnIdx].type = aColumnForm.type
      this.componentData.bodyForm[this.columnIdx].label = this.typeMap[aColumnForm.type]
      this.componentData.bodyForm[this.columnIdx].max = aColumnForm.max
      this.componentData.bodyForm[this.columnIdx].min = aColumnForm.min
      this.componentData.bodyForm[this.columnIdx].dateType = aColumnForm.dateType
      this.componentData.bodyForm[this.columnIdx].regularRule = aColumnForm.regularRule
      this.componentData.bodyForm[this.columnIdx].regularTips = aColumnForm.regularTips
      this.componentData.bodyForm[this.columnIdx].suggestion = aColumnForm.suggestion
      this.dialogVisible = false
    },
    addTableColumn() {
      const IDX = this.componentData.header.length + 1
      this.componentData.header.push('列' + IDX)
      this.componentData.content[0].push('')
      this.componentData.regularError[0].push(false)
      this.componentData.bodyForm.push({
        type: 0,
        uniqueName: '',
        label: '单行输入框',
        max: 10,
        min: 0,
        regularRule: '', // 正则校验规则
        regularTips: '', // 正则校验提示
        dateType: 'date',
        suggestion: '',
        content: ''
      })
    },
    decreaseTableColumn(index) {
      if (this.componentData.header.length === 1) {
        this.$message({
          message: '至少保留一个选项',
          type: 'warning'
        })
        return
      }
      this.componentData.header.splice(index, 1)
      this.componentData.bodyForm.splice(index, 1)
      this.componentData.content[0].splice(index, 1)
      this.componentData.regularError[0].splice(index, 1)
    },
    querySearch(queryString, cb) {
      const oData = this.componentData.suggestion.split(',')
      const restaurants = []
      oData.forEach(item => {
        restaurants.push({ 'value': item, 'address': item })
      })
      const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
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
    },
    handleClose(done) {
      done()
    }
  }
}
</script>

<style lang="scss" scoped>
  .forms {
    position: relative;
    margin-bottom: 8px;
  }
  .verify-error {
    ::v-deep * {
      border-color: red !important;
    }
  }
  .regular-tips {
    color: #ff4949;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
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
  .setting-main-span {
    color: #999;
    font-size: 14px;
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
  .setting-setting-btn {
    margin: 0 6px;
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
