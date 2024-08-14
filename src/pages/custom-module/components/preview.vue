<template>
  <div class="preview">
    <h4 class="preview-title">{{ previewData.diyName }}</h4>
    <p class="preview-description">{{ previewData.diyDescription }}</p>
    <div v-for="(item,index) in previewData.diyContent" :key="index" class="preview-form">
      <h5 class="preview-form-title" :class="{required: item.isNecessary}">{{ index + 1 }}. {{ item.label }}</h5>
      <el-input v-if="item.type === 0" size="small" placeholder="请输入内容" v-model="item.content" />
      <el-input v-if="item.type === 1" v-model="item.content" type="textarea" :rows="2" placeholder="请输入内容" />
      <div v-if="item.type === 2">
        <el-radio v-for="(radio,idx) in item.content" :key="idx" v-model="item.select" :label="radio">{{ radio }}</el-radio>
      </div>
      <el-checkbox-group v-if="item.type === 3" v-model="item.select">
        <el-checkbox v-for="(checkbox,idx) in item.content" :key="idx" :label="checkbox">{{ checkbox }}</el-checkbox>
      </el-checkbox-group>
      <el-date-picker v-if="item.type === 4" size="small" type="date" placeholder="选择日期" />
      <el-input-number v-if="item.type === 5" v-model="item.content" :min="1" :max="10000" label="数"></el-input-number>
      <div v-if="item.type === 20" class="body-input-content select-department">请选择</div>
    </div>
  </div>
</template>

<script>
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
    }
  },
  mounted() {
    // console.log(this.previewData, 78)
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
</style>
