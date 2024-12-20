<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="名称">
        <el-select v-model="formData.type" placeholder="活动区域" @change="formData.content = ''">
          <el-option label="单行输入框" :value="0"></el-option>
          <el-option label="多行输入框" :value="1"></el-option>
          <el-option label="日期选择" :value="4"></el-option>
          <el-option label="数量选择" :value="5"></el-option>
          <el-option label="滑动条" :value="6"></el-option>
          <el-option label="带建议框" :value="7"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.type === 0 || formData.type === 1" label="正则规则">
        <el-input v-model="formData.regularRule" placeholder="请输入正则匹配规则" />
      </el-form-item>
      <el-form-item v-if="formData.type === 0 || formData.type === 1" label="错误提示">
        <el-input v-model="formData.regularTips" placeholder="正则验证错误时给出提示" />
      </el-form-item>
      <el-form-item v-if="formData.type === 5 || formData.type === 6" label="最小范围">
        <el-input-number v-model="formData.min" :min="0" :max="10000" size="small" label="描述文字" />
      </el-form-item>
      <el-form-item v-if="formData.type !== 4 && formData.type !== 7" label="最大范围">
        <el-input-number v-model="formData.max" :min="formData.min" :max="10000" size="small" label="描述文字" />
      </el-form-item>
      <el-form-item v-if="formData.type === 4" label="时间类型">
        <el-switch v-model="formData.dateType" active-text="datetime型" inactive-text="date型" active-value="datetime" inactive-value="date" inactive-color="#67C23A"></el-switch>
      </el-form-item>
      <el-form-item v-if="formData.type === 7" label="建议内容">
        <el-input v-model="formData.suggestion" placeholder="每条建议,隔开" />
      </el-form-item>
      <el-form-item label="预置内容">
        <div class="forms">
          <el-autocomplete v-if="formData.type === 7" v-model="formData.content" class="inline-input" :class="{ 'verify-error': formData.regularError }" :fetch-suggestions="querySearch" @select="selectTips($event.value)" @blur="selectTips(formData.content)" placeholder="请输入内容" />
          <el-slider v-if="formData.type === 6" v-model="formData.content" :min="formData.min" :max="formData.max" style="padding: 0 20px"></el-slider>
          <el-input-number v-if="formData.type === 5" v-model="formData.content" :min="formData.min" :max="formData.max" size="small" label="描述文字" />
          <el-date-picker v-if="formData.type === 4" v-model="formData.content" value-format="yyyy-MM-dd hh:mm:ss" :type="formData.dateType" placeholder="选择日期" style="width: 100%" />
          <el-input v-if="formData.type === 1 || formData.type === 0" v-model="formData.content" :maxlength="formData.max" show-word-limit :class="{ 'verify-error': formData.regularError }" @input="validateInput(formData.regularRule, formData.content)" placeholder="可验证正则规则是否正确"/>
          <span v-if="formData.regularError" class="regular-tips">{{ formData.regularTips }}</span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ColumnForm',
  props: {
    componentData: {
      type: Object,
      default: null
    },
    columnIdx: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formData: {
        type: 0,
        min: 0,
        max: 100,
        dateType: '',
        content: '',
        regularError: false,
        regularRule: '',
        regularTips: '',
        suggestion: ''
      }
    }
  },
  created() {
    this.formData.type = this.componentData['bodyForm'][this.columnIdx].type
    this.formData.min = this.componentData['bodyForm'][this.columnIdx].min
    this.formData.max = this.componentData['bodyForm'][this.columnIdx].max
    this.formData.dateType = this.componentData['bodyForm'][this.columnIdx].dateType
    this.formData.content = this.componentData['content'][0][this.columnIdx]
    this.formData.regularRule = this.componentData['bodyForm'][this.columnIdx].regularRule
    this.formData.regularTips = this.componentData['bodyForm'][this.columnIdx].regularTips
    this.formData.regularError = this.componentData['bodyForm'][this.columnIdx].regularError
    this.formData.suggestion = this.componentData['bodyForm'][this.columnIdx].suggestion
    if (this.formData.type === 20) {
      this.selectTips(this.formData.content)
    }
  },
  methods: {
    querySearch(queryString, cb) {
      const oData = this.formData.suggestion.split(',')
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
    validateInput(rule, txt) {
      const regex = new RegExp(rule)
      if (!regex.test(txt)) {
        this.formData['regularError'] = true
        console.log(11111)
      } else {
        this.formData['regularError'] = false
        console.log('正确')
      }
    },
    selectTips(content) {
      const self = this
      if (content === '' || !self.formData.suggestion.split(',').includes(content)) {
        self.formData.regularTips = '只能选择建议内容'
        self.formData.regularError = true
        console.log(self.formData.regularError)
      } else {
        self.formData.regularTips = ''
        self.formData.regularError = false
        console.log('正确')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
