<template>
  <div class="left">
    <el-tabs>

      <el-tab-pane>
        <span slot="label"><i class="el-icon-coin" /> 组件库</span>
        <el-collapse>
          <el-collapse-item title="基础组件" name="1">
            <ul class="base">
              <li v-for="(item,index) in baseComponents" :key="index" class="base-component" draggable="true" @dragstart="dragStart($event,index)">
                <img :src="item.icon" :width="14" height="14" style="margin: 0 4px;position: relative;top: 2px" alt="基础组件">{{ item.name }}
              </li>
            </ul>
          </el-collapse-item>
          <el-collapse-item title="特殊组件" name="2">
            <ul class="base">
              <li v-for="(item,index) in specialInputData" :key="index" class="base-component" draggable="true" @dragstart="dragStart($event,baseComponents.length + index)">
                <img :src="item.icon" :width="14" height="14" style="margin: 0 4px;position: relative;top: 2px" alt="特殊组件">{{ item.name }}
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>

      <!--      <el-tab-pane>-->
      <!--        <span slot="label"><i class="el-icon-document"></i> 表单模板</span>-->
      <!--        暂无表单模板-->
      <!--      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'PopupLeft',
  data() {
    return {
      baseComponents: [
        {
          icon: require('../../../assets/icons/single-line-text.svg'),
          name: '单行文本'
        }, {
          icon: require('../../../assets/icons/multiline-text.svg'),
          name: '多行文本'
        }, {
          icon: require('../../../assets/icons/single-option.svg'),
          name: '单选框'
        }, {
          icon: require('../../../assets/icons/multiple-selection.svg'),
          name: '多选框'
        }, {
          icon: require('../../../assets/icons/date-selection.svg'),
          name: '日期选择'
        }, {
          icon: require('../../../assets/icons/select-number.svg'),
          name: '数量选择'
        }, {
          icon: require('../../../assets/icons/sliding.svg'),
          name: '滑动条'
        }, {
          icon: require('../../../assets/icons/pull-down.svg'),
          name: '带建议框'
        }
      ],
      specialInputData: [
        {
          icon: require('../../../assets/icons/table.svg'),
          name: '自增表格'
        }
      ]
    }
  },
  methods: {
    dragStart(e, type) {
      // console.log(e, 8)
      e.dataTransfer.setData('type', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.left {
  flex: 0 0 260px;
  border-right: 1px dotted #999;
  ::v-deep .el-tabs__nav-wrap {
    padding: 0 30px;
  }
  ::v-deep .el-collapse {
    border-top: transparent;
  }
  ::v-deep .el-collapse-item__header {
    margin-left: 8px;
    font-style: italic;
    font-weight: 700;
    background-color: #fefefe;
  }
}

.base {
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
  padding: 10px 16px 0;
  .base-component {
    height: 32px;
    line-height: 32px;
    width: 98px;
    margin: 7px 14px 7px 0;
    padding: 0 8px;
    border: 1px solid #e8e9eb;
    border-radius: 4px;
    text-overflow: ellipsis;
    cursor: move;
    font-size: 13px;
    color: #666;
    &:hover {
      background: #f1f2f3;
      border-color: #409eff;
    }
  }
}
</style>
