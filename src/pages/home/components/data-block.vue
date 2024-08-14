<template>
  <el-row :gutter="40" class="panel-group">
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
      v-for="(item, index) in formData"
      :key="index"
    >
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper" :class="`icon-form${index}`">
          <svg-icon :icon-class="item.icon" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ item.name }}
          </div>
          <count-to
            :start-val="0"
            :end-val="item.num"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";
import { getHomeCount, getMessageData } from "@/api/home";

export default {
  components: {
    CountTo,
  },
  data() {
    return {
      formData: [
        { icon: "home-form-data", name: "表单数据", num: 102400 },
        { icon: "home-form-data", name: "完成流程", num: 81212 },
        { icon: "home-form-data", name: "待完成流程", num: 9280 },
        { icon: "home-form-data", name: "总消息条数", num: 13600 },
      ],
    };
  },
  mounted() {
    this.init();
    // console.log(this.$store.state.user.userInfo)
  },
  methods: {
    init() {
      const dataA = {
        hospitalCode: this.$store.state.user.userInfo.hospitalCode,
        power: this.$store.state.user.userInfo.Power,
        dept: this.$store.state.user.userInfo.Department,
        name: this.$store.state.user.userInfo.Name,
      };
      getHomeCount(dataA).then((res) => {
        res = JSON.parse(res.d);
        this.formData[0].num = res.All;
        this.formData[1].num = res.Complete;
        this.formData[2].num = res.UnComplete;
      });

      const dataB = {
        hospitalCode: this.$store.state.user.userInfo.hospitalCode,
        dept: this.$store.state.user.userInfo.Department,
        name: this.$store.state.user.userInfo.Name,
      };
      getMessageData(dataB).then((res) => {
        res = JSON.parse(res.d);
        this.formData[3].num = res.length;
      });
    },
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-form0 {
        background: #40c9c6;
      }

      .icon-form1 {
        background: #36a3f7;
      }

      .icon-form2 {
        background: #f4516c;
      }

      .icon-form3 {
        background: #34bfa3;
      }
    }

    .icon-form0 {
      color: #40c9c6;
    }

    .icon-form1 {
      color: #36a3f7;
    }

    .icon-form2 {
      color: #f4516c;
    }

    .icon-form3 {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
