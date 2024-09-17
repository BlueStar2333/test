<template>
  <div class="login-wrap">
    <div class="ms-left">
      <p class="ms-left-txt">Welcome!</p>
      <p class="ms-left-txt">华西医院填表系统</p>
    </div>
    <div class="ms-login">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        label-width="0px"
        class="ms-content"
        autocomplete="on"
      >
        <el-form-item v-show="phoneShow" prop="phone">
          <el-input v-model="loginForm.phone" class="phone-inp" placeholder="请输入手机号" disabled>
            <i slot="prefix" class="el-icon-phone" />
          </el-input>
        </el-form-item>
        <el-form-item v-show="phoneShow" prop="code">
          <el-input v-model="loginForm.code" class="phone-inp" placeholder="请输入验证码">
            <i slot="prefix" class="el-icon-tickets" style="line-height: 36px;"/>
            <el-button slot="append" :disabled="sendDisabled" style="width: 130px" size="mini" @click="sendCode">{{ btnText }}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item v-show="!phoneShow" prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            clearable
            tabindex="1"
            autocomplete="on"
            placeholder="请输入账号"
          >
            <i slot="prefix" class="el-icon-user"/>
          </el-input>
        </el-form-item>
        <el-form-item v-show="!phoneShow">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          >
            <i slot="prefix" class="el-icon-lock"/>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button v-if="!phoneShow" type="primary" style="color: #e7e7e7" @click="accountSubmit" round>提交</el-button>
          <el-button v-if="phoneShow" type="primary" style="color: #e7e7e7" @click="handleLogin" round>登录</el-button>
          <el-link v-if="phoneShow" style="opacity: .6" type="primary" @click="loginBack">&lt;&lt;&lt; 返回</el-link>
        </div>
      </el-form>

    </div>
    <p class="copyright">版权所有 &copy; 2024 四川大学华西医院. 蜀ICP备2024095598号 - 工业和信息化部</p>
  </div>
</template>

<script>

export default {
  name: 'Login',
  components: {},
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (!validUsername(value)) {
      //   callback(new Error('Please enter the correct user name'))
      // } else {
      callback()
      // }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      loginForm: {
        phone: '',
        code: '',
        username: '',
        password: ''
      },
      btnText: '发送验证码',
      time: 60,
      sendDisabled: false,
      timer: null,
      loginRules: {
        phone: [{ validator: checkPhone, trigger: 'change' }],
        code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      phoneShow: false,
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: '/custom/CommonForm',
      otherQuery: {}
    }
  },
  computed: {
  },
  watch: {
    // $route: {
    //   handler: function(route) {
    //     const query = route.query
    //     console.log('--------------')
    //     console.log(query)
    //     console.log('================')
    //     if (query) {
    //       this.redirect = query.redirect
    //       this.otherQuery = this.getOtherQuery(query)
    //     }
    //   },
    //   immediate: true
    // }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    accountSubmit() {
      this.loginForm.phone = 14708267626
      this.phoneShow = true
      this.$nextTick(() => {
        this.sendCode()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              // console.log('kkl[][][')
              // console.log(this.redirect)
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(err => {
              this.loading = false
              this.$message({
                showClose: true,
                message: err,
                type: 'error'
              })
            })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    loginBack() {
      this.loginForm.phone = ''
      this.sendDisabled = false
      this.time = 60
      this.btnText = '发送验证码'
      clearInterval(this.timer)
      this.$nextTick(() => {
        this.phoneShow = false
      })
    },
    sendCode() {
      this.$refs.loginForm.validateField('phone', errorMessage => {
        if (errorMessage) {
          this.$message.error(errorMessage)
        } else {
          // 1.时间开始倒数
          // 2.按钮进入禁用状态
          // 3.如果倒计时结束 按钮恢复可用状态 按钮文字变为重新发送, 时间重置
          // 4.倒计时的过程中 按钮文字为 多少s后重新发送
          this.sendDisabled = true
          this.timer = setInterval(() => {
            this.time--
            this.btnText = `${this.time}s后重新发送`
            if (this.time === 0) {
              this.sendDisabled = false
              this.btnText = '重新发送'
              this.time = 60
              clearInterval(this.timer)
            }
          }, 1000)
          this.$emit('send')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/aa.png);
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ms-left {
  width: 450px;
  height: 420px;
  background-image: linear-gradient(330deg, rgba(225, 225, 225, 0.05) 0%, rgba(225, 225, 225, 0.05) 33.333%,rgba(114, 114, 114, 0.05) 33.333%, rgba(114, 114, 114, 0.05) 66.666%,rgba(52, 52, 52, 0.05) 66.666%, rgba(52, 52, 52, 0.05) 99.999%),linear-gradient(66deg, rgba(181, 181, 181, 0.05) 0%, rgba(181, 181, 181, 0.05) 33.333%,rgba(27, 27, 27, 0.05) 33.333%, rgba(27, 27, 27, 0.05) 66.666%,rgba(251, 251, 251, 0.05) 66.666%, rgba(251, 251, 251, 0.05) 99.999%),linear-gradient(225deg, rgba(98, 98, 98, 0.05) 0%, rgba(98, 98, 98, 0.05) 33.333%,rgba(222, 222, 222, 0.05) 33.333%, rgba(222, 222, 222, 0.05) 66.666%,rgba(228, 228, 228, 0.05) 66.666%, rgba(228, 228, 228, 0.05) 99.999%),linear-gradient(90deg, rgb(28, 20, 63),rgb(40, 160, 253));
  background-position: right bottom;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  opacity: .8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 70px;
  border-radius: 2px 0 0 2px;
  .ms-left-txt {
    color: #fff;
    font-size: 26px;
    line-height: 36px;
    margin-bottom: 10px;
    letter-spacing: 7px;
  }
}

.ms-login {
  height: 420px;
  width: 380px;
  border-radius: 0 2px 2px 0;
  padding-top: 40px;
  opacity: .9;
  background: #fff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  overflow: hidden;
}

.ms-content {
  padding: 90px 34px 0;
}

.login-btn {
  margin-top: 40px;
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 14px;
  line-height: 30px;
  color: #dbdbdb;
  float: right;
  margin: -20px 40px 20px;
}
.login-tips:hover {
  color: #e2e2e2;
  opacity: .6;
}
.copyright {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 12px;
  text-align: center;
  color: #999;
  font-size: 12px;
}

::v-deep .el-input__prefix {
  width: 40px;
}
::v-deep .el-input--prefix .el-input__inner {
  padding-left: 50px;
}
</style>
