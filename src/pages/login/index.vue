<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">医务人员健康管理</div>
      <el-form
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
          <!--          <el-input-->
          <!--            :key="passwordType"-->
          <!--            ref="password"-->
          <!--            v-model="loginForm.password"-->
          <!--            :type="passwordType"-->
          <!--            placeholder="Password"-->
          <!--            name="password"-->
          <!--            tabindex="2"-->
          <!--            autocomplete="on"-->
          <!--            @keyup.native="checkCapslock"-->
          <!--            @blur="capsTooltip = false"-->
          <!--            @keyup.enter.native="handleLogin"-->
          <!--          />-->
          <!--          <span class="show-pwd" @click="showPwd">-->
          <!--            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />-->
          <!--          </span>-->
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
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </div>
        <p class="login-tips">Tips : 请输入用户名和密码</p>
      </el-form>
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
    return {
      loginForm: {
        username: '',
        password: ''
      },
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
            .catch(() => {
              this.loading = false
            })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    }
    // getOtherQuery(query) {
    //   return Object.keys(query).reduce((acc, cur) => {
    //     if (cur !== 'redirect') {
    //       acc[cur] = query[cur]
    //     }
    //     console.log(acc[cur])
    //     console.log(cur)
    //     console.log(acc)
    //     console.log()
    //     return acc
    //   }, {})
  }
}
</script>

<style>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/login-bg.jpg);
  background-size: cover;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #474747;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 75%;
  top: 50%;
  width: 550px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.ms-content {
  padding: 30px 30px;
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
  font-size: 12px;
  line-height: 30px;
  color: #474747;
}
</style>
