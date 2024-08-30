<template>
  <div class="preview">
    <h4 class="preview-title">{{ previewData.table_name }}</h4>
    <p class="preview-description">{{ previewData.description }}</p>
    <div v-for="(item,index) in previewData.content" :key="index" :class="{ 'preview-form' : true, 'verify' : previewData.state === 3}">
      <h5 class="preview-form-title" :class="{required: item.isNecessary}">{{ index + 1 }}. {{ item.label }}{{ item.checkValue ? '（校验值）' : '' }}</h5>
      <!--单行文本-->
      <el-input v-if="item.type === 0" :class="{ 'verify-error': correct[index] === false }" v-model="item.content" size="small" placeholder="请输入内容" :maxlength="item.max" show-word-limit :disabled="redactStateC === '查看'" />
      <!--多行文本-->
      <el-input v-if="item.type === 1" :class="{ 'verify-error': correct[index] === false }" v-model="item.content" type="textarea" :maxlength="item.max" show-word-limit :rows="2" placeholder="请输入内容" :disabled="redactStateC === '查看'" />
      <!--单选-->
      <div v-if="item.type === 2" :class="{ 'verify-error': correct[index] === false }">
        <el-radio v-for="(radio,idx) in item.select" :key="idx" v-model="item.content" :label="radio" :disabled="redactStateC === '查看'">{{ radio }}</el-radio>
      </div>
      <!--多选-->
      <el-checkbox-group v-if="item.type === 3" v-model="item.content" :class="{ 'verify-error': correct[index] === false }">
        <el-checkbox v-for="(checkbox,idx) in item.select" :key="idx" :label="checkbox" :disabled="redactStateC === '查看'">{{ checkbox }}</el-checkbox>
      </el-checkbox-group>
      <!--日期选择-->
      <el-date-picker v-if="item.type === 4" :class="{ 'verify-error': correct[index] === false }" v-model="item.content" size="small" type="date" placeholder="选择日期" :disabled="redactStateC === '查看'" />
      <!--数量选择-->
      <el-input-number v-if="item.type === 5" :class="{ 'verify-error': correct[index] === false }" v-model="item.content" :min="item.min" :max="item.max" label="数" :disabled="redactStateC === '查看'" />
      <!--滑动条-->
      <el-slider v-if="item.type === 6" :class="{ 'verify-error': correct[index] === false }" v-model="item.content" :min="item.min" :max="item.max" style="padding: 0 20px" :disabled="redactStateC === '查看'" />
      <!--输入建议选择框-->
      <el-autocomplete v-if="item.type === 7" :class="{ 'verify-error': correct[index] === false }" v-model="item.content" class="inline-input" :fetch-suggestions="querySearch" placeholder="请输入内容" :disabled="redactStateC === '查看'" @focus="sugFocus(index, 'pub')" />
      <!--自增表格-->
      <el-table v-if="item.type === 20" :class="{ 'verify-error': correct[index] === false }" :data="item.content" class="body-input-content" style="width: 100%" border :header-cell-style="{backgroundColor: '#efefef'}">
        <el-table-column v-for="(column,colIdx) in item.header" :key="colIdx" :label="column">
          <template slot-scope="scope">
            <el-input v-if="item.bodyForm[colIdx].type === 0" :class="{ 'verify-error': correct[index] !== false && correct[index][scope.$index][colIdx] === false }" v-model="item.content[scope.$index][colIdx]" placeholder="请输入内容" :maxlength="item.bodyForm[colIdx].max" show-word-limit size="mini" :disabled="redactStateC === '查看'" />
            <el-input v-if="item.bodyForm[colIdx].type === 1" :class="{ 'verify-error': correct[index] !== false && correct[index][scope.$index][colIdx] === false }" v-model="item.content[scope.$index][colIdx]" type="textarea" :maxlength="item.bodyForm[colIdx].max" show-word-limit :rows="2" placeholder="请输入内容" size="mini" :disabled="redactStateC === '查看'" />
            <el-date-picker v-if="item.bodyForm[colIdx].type === 4" :class="{ 'verify-error': correct[index] !== false && correct[index][scope.$index][colIdx] === false }" v-model="item.content[scope.$index][colIdx]" type="date" placeholder="选择日期" style="width: 100%" size="mini" :disabled="redactStateC === '查看'" />
            <el-input-number v-if="item.bodyForm[colIdx].type === 5" :class="{ 'verify-error': correct[index] !== false && correct[index][scope.$index][colIdx] === false }" v-model="item.content[scope.$index][colIdx]" :min="item.bodyForm[colIdx].min" :max="item.bodyForm[colIdx].max" label="数" style="width: 100%" size="mini" :disabled="redactStateC === '查看'" />
            <el-slider v-if="item.bodyForm[colIdx].type === 6" :class="{ 'verify-error': correct[index] !== false && correct[index][scope.$index][colIdx] === false }" v-model="item.content[scope.$index][colIdx]" :min="item.bodyForm[colIdx].min" :max="item.bodyForm[colIdx].max" style="padding: 0 20px" size="mini" :disabled="redactStateC === '查看'" />
            <el-autocomplete v-if="item.bodyForm[colIdx].type === 7" :class="{ 'verify-error': correct[index] !== false && correct[index][scope.$index][colIdx] === false }" v-model="item.content[scope.$index][colIdx]" class="inline-input" :fetch-suggestions="querySearch" placeholder="请输入内容" size="mini" :disabled="redactStateC === '查看'" @focus="sugFocus(index, 'table', colIdx)" />
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
    sugFocus(index, type, twoIndex) {
      if (type === 'pub') {
        this.sugData = this.previewData.content[index].suggestion.split(',')
      } else if (type === 'table') {
        this.sugData = this.previewData.content[index].bodyForm[twoIndex].suggestion.split(',')
      }
    },
    verifyContent(content) {
      let errorTxt = ''
      let verify = ''
      const verify_correct = []
      content.forEach((itemOne, indexOne) => {
        if (itemOne['isNecessary'] && !itemOne.content.toString()) {
          errorTxt = '请将必填项填写完整'
        }
        if (itemOne.checkValue) {
          verify += '-' + itemOne.content.toString()
        }
        if (itemOne.type === 20) {
          verify_correct[indexOne] = []
          itemOne.content.forEach((itemTwo, indexTwo) => {
            verify_correct[indexOne][indexTwo] = new Array(itemTwo.length).fill(false)
          })
        } else {
          verify_correct[indexOne] = false
        }
      })
      return { errorTxt, verify, verify_correct }
    },
    addForm() {
      this.loading = true
      const verifyData = this.verifyContent(this.previewData.content)
      console.log(verifyData.verify)
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
        verify_correct_req: verifyData.verify_correct,
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
      console.log(verifyData.verify_correct,this.previewData,886)
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
      }
    },
    addBodyForm(index) {
      console.log(this.previewData.content[index], 36)
      const data = this.previewData.content[index]
      const len = data.content[0].length
      console.log(this.correct[index], 78)
      data.content.push(new Array(len).fill(''))
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
