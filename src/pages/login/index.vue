<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">华西医院填表系统</div>
      <el-form
        v-show="!phoneLoginState"
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        label-width="0px"
        class="ms-content"
        autocomplete="on"
      >
        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            clearable
            tabindex="1"
            autocomplete="on"
            placeholder="Username"
          >
            <template #prepend>
              <el-button icon="el-icon-user" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          >
            <template #prepend>
              <el-button icon="el-icon-lock" />
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" style="color: #e7e7e7" @click="handleLogin">登录</el-button>
        </div>
      </el-form>

      <el-form v-show="phoneLoginState" ref="ruleForm" class="ms-content" :model="ruleForm" :rules="rules" style="padding-bottom: 16px;">
        <el-form-item prop="phone">
          <el-input v-model="ruleForm.phone" class="phone-inp" placeholder="请输入手机号">
            <i slot="prefix" class="el-icon-phone" />
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-input v-model="ruleForm.code" class="phone-inp" placeholder="请输入验证码">
                <i slot="prefix" class="el-icon-tickets" />
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-button :disabled="sendDisabled" style="width: 130px" @click="sendCode">{{ btnText }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width:100%"
            @click="phoneLogin"
          >登录</el-button>
        </el-form-item>
      </el-form>

      <a v-if="phoneLoginState" class="login-tips" @click="changePhoneLoginState(false)">账号密码登录 ></a>
      <a v-else class="login-tips" @click="changePhoneLoginState(true)">手机号登录 ></a>
    </div>
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
        username: '',
        password: ''
      },
      ruleForm: {
        phone: '',
        code: ''
      },
      btnText: '发送验证码',
      phoneLoginState: false,
      time: 60,
      rules: {
        phone: [
          { validator: checkPhone, trigger: 'change' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      sendDisabled: false,
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
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
    changePhoneLoginState(bool) {
      this.phoneLoginState = bool
    },
    phoneLogin() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert('submit')
        } else {
          alert('errHandle')
        }
      })
    },
    sendCode() {
      this.$refs.ruleForm.validateField('phone', errorMessage => {
        if (errorMessage) {
          this.$message.error(errorMessage)
        } else {
          // 1.时间开始倒数
          // 2.按钮进入禁用状态
          // 3.如果倒计时结束 按钮恢复可用状态 按钮文字变为重新发送, 时间重置
          // 4.倒计时的过程中 按钮文字为 多少s后重新发送
          const timer = setInterval(() => {
            this.time--
            this.btnText = `${this.time}s后重新发送`
            this.sendDisabled = true
            if (this.time === 0) {
              this.sendDisabled = false
              this.btnText = '重新发送'
              this.time = 60
              clearInterval(timer)
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
  background-image: url(../../assets/img/login-bg.jpg);
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fcfcfc;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  width: 500px;
  border-radius: 5px;
  background: rgba(161, 160, 160, 0.5);
  overflow: hidden;
}

.ms-content {
  padding: 30px 34px;
}

.login-btn {
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

::v-deep .el-input__prefix {
  width: 40px;
}
::v-deep .el-input--prefix .el-input__inner {
  padding-left: 50px;
}
</style>
