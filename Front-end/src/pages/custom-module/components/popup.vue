<template>
  <div class="popup">
    <div class="popup-head">
      <h4 class="popup-head-title">工作台</h4>
      <i class="el-icon-close popup-head-close" @click="onClose" />
    </div>
    <div class="popup-body">
      <PopupLeft />
      <PopupMiddle v-bind="$attrs" v-on="$listeners" @onClose="onClose" @getData="getData" />
      <PopupRight v-bind="$attrs" v-on="$listeners" />
    </div>
  </div>
</template>

<script>
import PopupLeft from '@/pages/custom-module/components/popup-left'
import PopupMiddle from '@/pages/custom-module/components/popup-middle'
import PopupRight from '@/pages/custom-module/components/popup-right'
export default {
  name: 'Popup',
  components: {
    PopupLeft, PopupMiddle, PopupRight
  },
  methods: {
    onClose() {
      this.$emit('onClose')
    },
    getData(name) {
      this.$emit('getData', name)
    }
  }
}
</script>

<style lang="scss" scoped>
.popup {
  width: 100%;
  height: 100%;
  z-index: 99;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #fefefe;
  overflow: auto;
}

.popup-head {
  height: 30px;
  margin: 18px 10px 10px;
  border-bottom: 1px dotted #999;
  display: flex;
  justify-content: space-between;
  .popup-head-title {
    font-weight: 500;
  }
  .popup-head-close {
    cursor: pointer;
    transition: all .4s;
    height: 16px;
    &:hover {
      transform: rotate(180deg);
    }
  }
}

.popup-body {
  position: absolute;
  top: 48px;
  bottom: 0;
  width: 100%;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  overflow: auto;
  //background-color: #3a835d;
}
</style>
