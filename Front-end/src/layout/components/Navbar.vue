<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
      @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <search id="header-search" class="right-menu-item" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar :size="37" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
          <!-- <label>{{ $store.state.user.userInfo.Name }}</label> -->
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="dropdown-name">
            <span style="display:block;">{{ $store.state.user.userInfo.Name }}</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="openEdit">
            <span style="display:block;">修改</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      :visible.sync="drawer"
      title="Edit Role"
    >
      <el-form
        ref="editPerson"
        label-position="right"
        label-width="180px"
        width="60%"
        style="max-width: 600px;"
        :model="editPerson"
        :rules="personRules"
      >
        <el-form-item label="姓名：" prop="name">
          <el-input
            v-model="editPerson.name"
            clearable
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item label="账号：" prop="account">
          <el-input
            v-model="editPerson.account"
            disabled
            clearable
            placeholder="请输入用户编号"
          />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            v-model="editPerson.password"
            type="password"
            clearable
            show-password
            placeholder="请输入用户密码"
          />
        </el-form-item>
        <el-form-item label="联系电话：" prop="phone">
          <el-input
            v-model="editPerson.phone"
            clearable
            placeholder="请输入联系电话"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: right; margin: 10px 10px 0">
        <el-button @click="drawer = false">取消</el-button>
        <el-button
          icon="el-icon-finished"
          type="primary"
          @click="confirm"
        >提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import Search from '@/components/HeaderSearch'
import {updateUser} from "@/api/employee";
import store from "@/store";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[0-9][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    const checkStrongPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'));
      } else {
        // 密码强度规则：至少8个字符，必须包含大写字母、小写字母和数字
        const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('密码强度不足，必须包含大写字母、小写字母和数字'));
        }
      }
    }
    return {
      drawer: false,
      editPerson: {
        name: this.$store.state.user.userInfo.name,
        account: this.$store.state.user.userInfo.account,
        password: this.$store.state.user.userInfo.password,
        phone: this.$store.state.user.userInfo.phone,
        power: this.$store.state.user.userInfo.power
      },
      personRules: {
        name: [{ required: true, trigger: 'blur', message: '姓名不能为空' }],
        account: [{ required: true, trigger: 'blur', message: '账号不能为空' }],
        password: [{ required: true, trigger: 'blur', validator: checkStrongPassword }],
        phone: [{ required: true, trigger: 'blur', validator: checkPhone }],
        power: [{ required: true, trigger: 'blur', message: '权限不能为空' }]
      },
    }
  },
  methods: {
    openEdit() {
      this.editPerson.name = this.$store.state.user.userInfo.name
      this.editPerson.account = this.$store.state.user.userInfo.account
      this.editPerson.password = this.$store.state.user.userInfo.password
      this.editPerson.phone = this.$store.state.user.userInfo.phone
      this.editPerson.power = this.$store.state.user.userInfo.power
      this.drawer = true
    },
    confirm() {
      this.$refs.editPerson.validate(valid => {
        if (valid) {
          updateUser(this.editPerson).then((res) => {
            if (res.code === 1) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.$store.commit('user/SET_USER_INFO', res.data)
              this.drawer = false
            } else {
              this.$message({
                type: 'warning',
                message: res.msg
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.dropdown-name {
  border-bottom: 1px solid #f5f5f5;
}

</style>
