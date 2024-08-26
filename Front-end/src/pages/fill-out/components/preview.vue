<template>
  <div class="preview">
    <h4 class="preview-title">{{ previewData.table_name }}</h4>
    <p class="preview-description">{{ previewData.description }}</p>
    <div v-for="(item,index) in previewData.content" :key="index" class="preview-form">
      <h5 class="preview-form-title" :class="{required: item.isNecessary}">{{ index + 1 }}. {{ item.label }}{{ item.checkValue ? '（校验值）' : '' }}</h5>
      <!--单行文本-->
      <el-input v-if="item.type === 0" v-model="item.content" size="small" placeholder="请输入内容" :maxlength="item.max" show-word-limit />
      <!--多行文本-->
      <el-input v-if="item.type === 1" v-model="item.content" type="textarea" :maxlength="item.max" show-word-limit :rows="2" placeholder="请输入内容" />
      <!--单选-->
      <div v-if="item.type === 2">
        <el-radio v-for="(radio,idx) in item.content" :key="idx" v-model="item.select" :label="radio">{{ radio }}</el-radio>
      </div>
      <!--多选-->
      <el-checkbox-group v-if="item.type === 3" v-model="item.select">
        <el-checkbox v-for="(checkbox,idx) in item.content" :key="idx" :label="checkbox">{{ checkbox }}</el-checkbox>
      </el-checkbox-group>
      <!--日期选择-->
      <el-date-picker v-if="item.type === 4" v-model="item.content" size="small" type="date" placeholder="选择日期" />
      <!--数量选择-->
      <el-input-number v-if="item.type === 5" v-model="item.content" :min="item.min" :max="item.max" label="数" />
      <!--滑动条-->
      <el-slider v-if="item.type === 6" v-model="item.content" :min="item.min" :max="item.max" style="padding: 0 20px" />
      <!--输入建议选择框-->
      <el-autocomplete v-if="item.type === 7" v-model="item.content" class="inline-input" :fetch-suggestions="querySearch" placeholder="请输入内容" @focus="sugFocus(index, 'pub')" />
      <!--自增表格-->
      <el-table v-if="item.type === 20" :data="item.content" class="body-input-content" style="width: 100%" border :header-cell-style="{backgroundColor: '#efefef'}">
        <el-table-column v-for="(column,colIdx) in item.header" :key="colIdx" :label="column">
          <template slot-scope="scope">
            <el-input v-if="item.bodyForm[colIdx].type === 0" v-model="item.content[scope.$index][colIdx]" placeholder="请输入内容" :maxlength="item.bodyForm[colIdx].max" show-word-limit size="mini" />
            <el-input v-if="item.bodyForm[colIdx].type === 1" v-model="item.content[scope.$index][colIdx]" type="textarea" :maxlength="item.bodyForm[colIdx].max" show-word-limit :rows="2" placeholder="请输入内容" size="mini" />
            <el-date-picker v-if="item.bodyForm[colIdx].type === 4" v-model="item.content[scope.$index][colIdx]" type="date" placeholder="选择日期" style="width: 100%" size="mini" />
            <el-input-number v-if="item.bodyForm[colIdx].type === 5" v-model="item.content[scope.$index][colIdx]" :min="item.bodyForm[colIdx].min" :max="item.bodyForm[colIdx].max" label="数" style="width: 100%" size="mini" />
            <el-slider v-if="item.bodyForm[colIdx].type === 6" v-model="item.content[scope.$index][colIdx]" :min="item.bodyForm[colIdx].min" :max="item.bodyForm[colIdx].max" style="padding: 0 20px" size="mini" />
            <el-autocomplete v-if="item.bodyForm[colIdx].type === 7" v-model="item.content[scope.$index][colIdx]" class="inline-input" :fetch-suggestions="querySearch" placeholder="请输入内容" @focus="sugFocus(index, 'table', colIdx)" size="mini" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <div class="operation">
              <el-link v-if="1" type="danger" @click="deleteBodyForm(index, scope.$index)" style="margin: 0 6px">删除</el-link>
              <el-link v-if="item.content.length === (scope.$index + 1)" type="success" @click="addBodyForm(index)">添加</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="submit-btn">
      <el-button v-if="previewData.redactState === '新增'" type="primary" @click="addForm">提交</el-button>
      <el-button v-if="previewData.redactState === '编辑'" type="primary" @click="editForm">修改</el-button>
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
      sugData: []
    }
  },
  mounted() {
    this.previewData.content = JSON.parse(this.previewData.content)
    console.log(this.previewData, 78)
  },
  methods: {
    sugFocus(index, type, twoIndex) {
      if (type === 'pub') {
        this.sugData = this.previewData.content[index].suggestion.split(',')
      } else if (type === 'table') {
        this.sugData = this.previewData.content[index].bodyForm[twoIndex].suggestion.split(',')
      }
    },
    addForm() {
      const data = {
        form_id: this.previewData.id,
        form_name: this.previewData.table_name,
        written_by: this.$store.state.user.userInfo.name,
        written_account: this.$store.state.user.userInfo.account,
        content: JSON.stringify(this.previewData.content)
      }
      addContentTable(data).then(res => {
        if (res.code === 1) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.$emit('close')
        }
      })
    },
    editForm() {
      const data = {
        id: this.previewData.id,
        content: JSON.stringify(this.previewData.content)
      }
      editContentTable(data).then(res => {
        if (res.code === 1) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.$emit('close')
        }
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
      console.log(this.previewData.content[index],36)
      const data = this.previewData.content[index]
      const len = data.content[0].length
      data.content.push(new Array(len).fill(''))
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
