<template>
  <div class="preview">
    <h4 class="preview-title">{{ previewData.table_name }}</h4>
    <p class="preview-description">{{ previewData.description }}</p>
    <div v-for="(item,index) in previewData.content" :key="index" :class="{ 'preview-form' : true, 'verify' : previewData.state === 3}">
      <h5 class="preview-form-title" :class="{required: item.isNecessary}">{{ index + 1 }}. {{ item.label }}{{ item.checkValue ? '（校验值）' : '' }}</h5>
      <div class="forms">
        <!--单行文本-->
        <el-input v-if="item.type === 0" v-model="item.content" @input="validateInput(item.regularRule, item.content, index)" :class="{ 'verify-error': correct[index] === false, 'regular-error': item.regularError }" size="small" placeholder="请输入内容" :maxlength="item.max" show-word-limit :disabled="redactStateC === '查看'" />
        <!--多行文本-->
        <el-input v-if="item.type === 1" v-model="item.content" @input="validateInput(item.regularRule, item.content, index)" :class="{ 'verify-error': correct[index] === false, 'regular-error': item.regularError }" type="textarea" :maxlength="item.max" show-word-limit :rows="2" placeholder="请输入内容" :disabled="redactStateC === '查看'" />
        <!--单选-->
        <div v-if="item.type === 2" :class="{ 'verify-error': correct[index] === false }">
          <el-radio v-for="(radio,idx) in item.select" :key="idx" v-model="item.content" :label="radio" :disabled="redactStateC === '查看'">{{ radio }}</el-radio>
        </div>
        <!--多选-->
        <el-checkbox-group v-if="item.type === 3" v-model="item.content" :class="{ 'verify-error': correct[index] === false }">
          <el-checkbox v-for="(checkbox,idx) in item.select" :key="idx" :label="checkbox" :disabled="redactStateC === '查看'">{{ checkbox }}</el-checkbox>
        </el-checkbox-group>
        <!--日期选择-->
        <el-date-picker v-if="item.type === 4" v-model="item.content" :class="{ 'verify-error': correct[index] === false }" size="small" :type="item.dateType" placeholder="选择日期" :disabled="redactStateC === '查看'" />
        <!--数量选择-->
        <el-input-number v-if="item.type === 5" v-model="item.content" :class="{ 'verify-error': correct[index] === false }" :min="item.min" :max="item.max" label="数" :disabled="redactStateC === '查看'" />
        <!--滑动条-->
        <el-slider v-if="item.type === 6" v-model="item.content" :class="{ 'verify-error': correct[index] === false }" :min="item.min" :max="item.max" style="padding: 0 20px" :disabled="redactStateC === '查看'" />
        <!--输入建议选择框-->
        <el-autocomplete v-if="item.type === 7" v-model="item.content" :class="{ 'verify-error': correct[index] === false }" class="inline-input" :fetch-suggestions="querySearch" placeholder="请输入内容" :disabled="redactStateC === '查看'" @focus="sugFocus(index, 'pub')" />
        <span v-if="item.regularError" class="regular-tips">{{ item.regularTips }}</span>
        <!--自增表格-->
        <el-table v-if="item.type === 20" :class="{ 'verify-error': correct[index] === false }" :data="item.content" class="body-input-content" style="width: 100%" border :header-cell-style="{backgroundColor: '#efefef'}">
          <el-table-column v-for="(column,colIdx) in item.header" :key="colIdx" :label="column">
            <template slot-scope="scope">
              <div class="table-forms">
                <el-input v-if="item.bodyForm[colIdx].type === 0" v-model="item.content[scope.$index][colIdx]" :class="{ 'regular-error': item.regularError[scope.$index][colIdx], 'verify-error': correct[index] !== false && (correct[index] === false || correct[index][scope.$index][colIdx] === false) }" @input="validateInput(item.bodyForm[colIdx].regularRule, item.content[scope.$index][colIdx], index, { row: scope.$index, col: colIdx })" placeholder="请输入内容" :maxlength="item.bodyForm[colIdx].max" show-word-limit size="mini" :disabled="redactStateC === '查看'" />
                <el-input v-if="item.bodyForm[colIdx].type === 1" v-model="item.content[scope.$index][colIdx]" :class="{ 'regular-error': item.regularError[scope.$index][colIdx], 'verify-error': correct[index] !== false && (correct[index] === false || correct[index][scope.$index][colIdx] === false) }" @input="validateInput(item.bodyForm[colIdx].regularRule, item.content[scope.$index][colIdx], index, { row: scope.$index, col: colIdx })" type="textarea" :maxlength="item.bodyForm[colIdx].max" show-word-limit :rows="2" placeholder="请输入内容" size="mini" :disabled="redactStateC === '查看'" />
                <el-date-picker v-if="item.bodyForm[colIdx].type === 4" v-model="item.content[scope.$index][colIdx]" :class="{ 'verify-error': correct[index] !== false && (correct[index] === false || correct[index][scope.$index][colIdx] === false) }" :type="item.bodyForm[colIdx].dateType" placeholder="选择日期" style="width: 100%" size="mini" :disabled="redactStateC === '查看'" />
                <el-input-number v-if="item.bodyForm[colIdx].type === 5" v-model="item.content[scope.$index][colIdx]" :class="{ 'verify-error': correct[index] !== false && (correct[index] === false || correct[index][scope.$index][colIdx] === false) }" :min="item.bodyForm[colIdx].min" :max="item.bodyForm[colIdx].max" label="数" style="width: 100%" size="mini" :disabled="redactStateC === '查看'" />
                <el-slider v-if="item.bodyForm[colIdx].type === 6" v-model="item.content[scope.$index][colIdx]" :class="{ 'verify-error': correct[index] !== false && (correct[index] === false || correct[index][scope.$index][colIdx] === false) }" :min="item.bodyForm[colIdx].min" :max="item.bodyForm[colIdx].max" style="padding: 0 20px" size="mini" :disabled="redactStateC === '查看'" />
                <el-autocomplete v-if="item.bodyForm[colIdx].type === 7" v-model="item.content[scope.$index][colIdx]" :class="{ 'verify-error': correct[index] !== false && (correct[index] === false || correct[index][scope.$index][colIdx] === false) }" class="inline-input" :fetch-suggestions="querySearch" placeholder="请输入内容" size="mini" :disabled="redactStateC === '查看'" @focus="sugFocus(index, 'table', colIdx)" />
                <span v-if="item.regularError[scope.$index][colIdx]" class="regular-tips">{{ item.bodyForm[colIdx].regularTips }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="redactStateC !== '查看'" fixed="right" label="操作">
            <template slot-scope="scope">
              <div class="operation">
                <el-link v-if="1" type="danger" style="margin: 0 6px" @click="deleteBodyForm(index, scope.$index)">删除</el-link>
                <el-link v-if="item.content.length === (scope.$index + 1)" type="success" @click="addBodyForm(index)">添加</el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="submit-btn">
      <el-button v-if="redactStateC === '新增'" type="primary" @click="addForm">提交</el-button>
      <el-button v-if="redactStateC === '编辑'" type="primary" @click="editForm">修改</el-button>
      <el-button @click="$emit('close')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { addContentTable, editContentTable } from '@/api/fillout'

export default {
  name: 'Preview',
  props: {
    previewData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // inputData: []
      sugData: [],
      redactStateC: '',
      loading: false,
      correct: []
    }
  },
  created() {
    this.init()
    console.log(this.previewData, 78)
  },
  methods: {
    init() {
      console.log(this.previewData, 781)
      this.previewData.content = JSON.parse(this.previewData.content)
      console.log(this.previewData, 782)
      this.redactStateC = this.previewData.redactState
      this.correct = JSON.parse(this.previewData.verify_correct)
    },
    validateInput(rule, txt, idx, coordinate) {
      let result = ''
      const regex = new RegExp(rule)
      if (!regex.test(txt)) {
        if (coordinate) {
          // this.previewData.content[idx]['regularError'][coordinate.row][coordinate.col] = true
          console.log(this.previewData.content[idx]['regularError'][coordinate.row][coordinate.col],7789)
          const newErrorRow = { ...this.previewData.content[idx]['regularError'][coordinate.row] }
          newErrorRow[coordinate.col] = true
          // 使用 Vue.set 替换整个对象,确保数据双向绑定
          this.$set(this.previewData.content[idx]['regularError'], coordinate.row, newErrorRow)
        } else {
          this.previewData.content[idx]['regularError'] = true
        }
        result = 'error'
        console.log(11111)
      } else {
        if (coordinate) {
          // this.previewData.content[idx]['regularError'][coordinate.row][coordinate.col] = false
          const newErrorRow = { ...this.previewData.content[idx]['regularError'][coordinate.row] }
          newErrorRow[coordinate.col] = false
          // 使用 Vue.set 替换整个对象,确保数据双向绑定
          this.$set(this.previewData.content[idx]['regularError'], coordinate.row, newErrorRow)
        } else {
          this.previewData.content[idx]['regularError'] = false
        }
        result = ''
        console.log('正确')
      }
      return result
    },
    sugFocus(index, type, twoIndex) {
      if (type === 'pub') {
        this.sugData = this.previewData.content[index].suggestion.split(',')
      } else if (type === 'table') {
        this.sugData = this.previewData.content[index].bodyForm[twoIndex].suggestion.split(',')
      }
    },
    // 校验初始值和表单正则校验
    verifyContent(content) {
      let errorTxt = ''
      let errorRegular = ''
      let verify = ''
      const verify_correct = []
      content.forEach((itemOne, indexOne) => {
        console.log(itemOne['regularError'], itemOne['regularRule'],69)
        if (itemOne['isNecessary'] && !itemOne.content.toString()) {
          errorTxt = '请将必填项填写完整'
        }
        if (itemOne.type === 0 || itemOne.type === 1) {
          errorRegular += this.validateInput(itemOne['regularRule'], itemOne.content, indexOne)
        }
        if (itemOne.checkValue) {
          verify += '-' + itemOne.content.toString()
        }
        if (itemOne.type === 20) {
          verify_correct[indexOne] = []
          itemOne.content.forEach((itemTwo, indexTwo) => {
            verify_correct[indexOne][indexTwo] = new Array(itemTwo.length).fill(false)
            itemTwo.forEach((itemThree, indexThree) => {
              console.log(itemOne.bodyForm,indexOne,itemThree,14,indexTwo,indexThree)
              if (itemOne.bodyForm[indexThree].type === 0 || itemOne.bodyForm[indexThree].type === 1) {
                errorRegular += this.validateInput(itemOne.bodyForm[indexThree]['regularRule'], itemThree, indexOne, { row: indexTwo, col: indexThree })
              }
            })
          })
        } else {
          verify_correct[indexOne] = false
        }
      })
      return { errorTxt, errorRegular, verify, verify_correct }
    },
    addForm() {
      this.loading = true
      const verifyData = this.verifyContent(this.previewData.content)
      console.log(verifyData.errorRegular,6635)
      if (verifyData.errorRegular.includes('error')) {
        this.$message({
          type: 'info',
          message: '表单项有格式填写错误'
        })
        this.loading = false
        return
      }
      if (verifyData.errorTxt) {
        this.$message({
          type: 'info',
          message: verifyData.errorTxt
        })
        this.loading = false
        return
      }
      const data = {
        form_id: this.previewData.id,
        form_name: this.previewData.table_name,
        written_by: this.$store.state.user.userInfo.name,
        written_account: this.$store.state.user.userInfo.account,
        content: JSON.stringify(this.previewData.content),
        user_id: this.previewData.content[0].content,
        verify: verifyData.verify,
        verify_correct_req: verifyData.verify_correct
      }
      addContentTable(data).then(res => {
        if (res.code === 1) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.$emit('close')
        } else {
          this.$message({
            type: 'info',
            message: res.msg
          })
        }
        this.loading = false
      })
    },
    editForm() {
      this.loading = true
      const verifyData = this.verifyContent(this.previewData.content)
      console.log(verifyData.verify_correct, this.previewData, 886)
      if (verifyData.errorTxt) {
        this.$message({
          type: 'info',
          message: verifyData.errorTxt
        })
        this.loading = false
        return
      }
      const data = {
        id: this.previewData.id,
        content: JSON.stringify(this.previewData.content),
        written_account: this.$store.state.user.userInfo.account,
        user_id: this.previewData.content[0].content,
        verify: verifyData.verify,
        oldVerify: this.previewData.verify,
        verify_correct_req: verifyData.verify_correct
      }
      editContentTable(data).then(res => {
        if (res.code === 1) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.$emit('close')
        } else {
          this.$message({
            type: 'info',
            message: res.msg
          })
        }
        this.loading = false
      })
    },
    deleteBodyForm(index, idx) {
      if (this.previewData.content[index].content.length === 1) {
        this.$message({
          type: 'info',
          message: '至少保留一条数据'
        })
      } else {
        this.previewData.content[index].content.splice(idx, 1)
        this.previewData.content[index].regularError.splice(idx, 1)
      }
    },
    addBodyForm(index) {
      console.log(this.previewData.content[index], 36)
      const data = this.previewData.content[index]
      const len = data.content[0].length
      console.log(this.correct[index], 78)
      data.content.push(new Array(len).fill(''))
      data.regularError.push(new Array(len).fill(false))
      this.correct[index].push(new Array(len).fill(false))
    },
    querySearch(queryString, cb) {
      const restaurants = []
      this.sugData.forEach(item => {
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
    }
  }
}
</script>

<style scoped lang="scss">
  .preview-title {
    text-align: center;
    font-size: 18px;
  }
  .preview-description {
    font-style:italic;
    text-indent: 2em;
    padding: 10px 0 6px;
    color: #666;
  }
  .verify {
    .verify-error {
      ::v-deep * {
        border-color: red !important;
      }
    }
  }
  .regular-error {
    ::v-deep * {
      border-color: red !important;
    }
  }
  .forms {
    position: relative;
    margin-bottom: 8px;
  }
  .table-forms {
    position: relative;
    margin-bottom: 16px;
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
  .preview-form {
    .required:before {
      content: '*';
      color: red;
      margin: 0 2px;
    }
    .preview-form-title {
      //font-style:italic;
      padding: 16px 0 10px;
      color: #4f4f4f;
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
  .submit-btn {
    display: flex;
    justify-content: space-around;
    margin: 20px 120px 0;
  }
</style>
