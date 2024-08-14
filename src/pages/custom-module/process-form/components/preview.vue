<template>
  <div class="preview">
    <h4 class="preview-title">{{ previewData.diyName }}</h4>
    <p class="preview-description">{{ previewData.diyDescription }}</p>
    <div v-for="(item,index) in previewData.diyContent[0].content" :key="index" class="preview-form">
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
    <el-divider class="tabs" content-position="left">流程如下</el-divider>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane v-for="(itemX,indexX) in previewData.diyContent.slice(1)" :key="indexX" :label="itemX.title" :name="itemX.name">
        <div v-if="itemX.name === '2'">
          已全部完成√
        </div>
        <div v-for="(item,index) in itemX.content" :key="index" class="preview-form">
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
      </el-tab-pane>
    </el-tabs>
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
      activeName: '3'
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

.tabs {
  margin-top: 50px;
  ::v-deep .el-divider__text {
    color: #999;
  }
}
</style>
