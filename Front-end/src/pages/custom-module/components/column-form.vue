<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="名称">
        <el-select v-model="formData.type" placeholder="活动区域">
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
        regularRule: '',
        regularTips: '',
        suggestion: ''
      }
    }
  },
  created() {
    this.formData.type = this.componentData['bodyForm'][this.columnIdx].type
    this.formData.regularRule = this.componentData['bodyForm'][this.columnIdx].regularRule
    this.formData.regularTips = this.componentData['bodyForm'][this.columnIdx].regularTips
    this.formData.suggestion = this.componentData['bodyForm'][this.columnIdx].suggestion
  }
}
</script>

<style scoped>

</style>
