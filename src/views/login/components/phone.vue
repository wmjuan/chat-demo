<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="phone"
          v-model="loginForm.phone_number"
          placeholder="请输入手机号"
          name="phone"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-row>
        <el-form-item prop="code" style="width: 68%;float: left">
          <el-input v-model="loginForm.code" placeholder="请输入验证码" class="code" @keyup.enter.native="handleLogin"/>
        </el-form-item>
        <el-form-item prop="code" style="width: 27%;float: right;margin-top: 3px">
          <el-button type="primary" :disabled="disabled" @click="getcode">{{
            disabled ? btnText : '发送验证码'
          }}
          </el-button>
        </el-form-item>
      </el-row>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
      <el-button type="primary" style="width:34%;margin-bottom:30px;margin-left:270px" @click="$router.push('/register')">注册</el-button>

    </el-form>
  </div>
</template>

<script>
// import { validatePhone } from '@/utils/validate'
import { sendmessages } from '../../../api/user'
export default {
  name: 'Phone',
  data() {
    // const valiPhone = (rule, value, callback) => {
    //   if (!validatePhone(value)) {
    //     callback(new Error('Please enter the correct user phone'))
    //   } else {
    //     callback()
    //   }
    // }
    // const valiCode = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('The code can not be less than 6 digits'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loginForm: {
        phone_number: '',
        code: '',
        login_type: 'phone_number'
      },
      btnText: '',
      start: localStorage.getItem('codetime') || 0,
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }]
      },
      loading: false,
      // passwordType: 'password',
      redirect: undefined
    }
  },
  computed: {
    disabled() {
      if (this.start === 0) {
        return false
      }
      return Date.now() - this.start < 10000
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.timer()
  },
  destroyed() {
    clearTimeout(this.timeid)
  },
  methods: {
    // showPwd() {
    //   if (this.passwordType === 'password') {
    //     this.passwordType = ''
    //   } else {
    //     this.passwordType = 'password'
    //   }
    //   this.$nextTick(() => {
    //     this.$refs.password.focus()
    //   })
    // },
    handleLogin() {
      if (this.loginForm.phone_number.length === 0 && this.loginForm.code.length === 0) {
        return
      }
      this.loading = true
      const phonelogin = {
        login_type: 'phone_number',
        phone_number: this.loginForm.phone_number,
        code: this.loginForm.code
      }
      this.$store.dispatch('user/login', phonelogin).then(() => {
        // this.$router.push({ path: this.redirect || '/' })
        this.$message.success('登录成功')
        window.location.href = '/'
        this.loading = false
      }).catch(data => {
        this.loading = false
        this.$message.error('登录失败,请重新登录')
      })
      // this.$refs.loginForm.validate(valid => {
      // if (valid) {

      //   }).catch(() => {
      //     this.loading = false
      //   })
      // } else {
      //   console.log('error submit!!')
      //   return false
      // }
      // }
    },
    getcode() {
      const data = {
        phone_number: this.loginForm.phone_number
      }
      console.log(data)
      if (this.loginForm.phone_number.length === 0) {
        return
      }
      sendmessages(data).then(res => {
        this.$message.success('发送成功')
      }).catch(data => {
        this.$message.error('发送失败')
        this.start = 0
      })
      this.start = Date.now()
      this.timer()
      localStorage.setItem('codetime', this.start)
    },
    timer() {
      this.btnText = `重新发送(${60 - Math.floor((Date.now() - this.start) / 1000)})`
      if (Date.now() - this.start >= 10000) {
        this.start = 0
        return
      }
      this.timeid = setTimeout(this.timer, 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
.svg-container {
  padding: 6px 5px 6px 15px;
  vertical-align: middle;
  width: 30px;
  display: inline-block;
}
.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
}
</style>
<!--<style lang="scss" scoped>-->
<!--.login-container {-->
<!--.el-input {-->
<!--display: inline-block;-->
<!--height: 47px;-->
<!--width: 85%;-->
<!--input {-->
<!--background: transparent;-->
<!--border: 0px;-->
<!-- -webkit-appearance: none;-->
<!--border-radius: 0px;-->
<!--padding: 12px 5px 12px 15px;-->
<!--color: #000;-->
<!--height: 47px;-->
<!--}-->
<!--}-->
<!--.el-form-item {-->
<!--border: 1px solid rgba(255, 255, 255, 0.1);-->
<!--background: rgba(0, 0, 0, 0.1);-->
<!--border-radius: 5px;-->
<!--color: #454545;-->
<!--}-->
<!--}-->
<!--</style>-->

<!--<style lang="scss" scoped>-->
<!--.login-container {-->
<!--  min-height: 100%;-->
<!--  width: 100%;-->
<!--  .login-form {-->
<!--    position: relative;-->
<!--    width: 520px;-->
<!--    max-width: 100%;-->
<!--    padding: 10px 35px 0;-->
<!--    margin-right: 260px;-->
<!--    overflow: hidden;-->
<!--    margin-top: 20px;-->
<!--    float: right;-->
<!--  }-->

<!--  .tips {-->
<!--    font-size: 14px;-->
<!--    color: #fff;-->
<!--    margin-bottom: 10px;-->

<!--    span {-->
<!--      &:first-of-type {-->
<!--        margin-right: 16px;-->
<!--      }-->
<!--    }-->
<!--  }-->

<!--  .svg-container {-->
<!--    padding: 6px 5px 6px 15px;-->
<!--    color: $dark_gray;-->
<!--    vertical-align: middle;-->
<!--    width: 30px;-->
<!--    display: inline-block;-->
<!--  }-->
<!--  .show-pwd {-->
<!--    position: absolute;-->
<!--    right: 10px;-->
<!--    top: 7px;-->
<!--    font-size: 16px;-->
<!--    color: $dark_gray;-->
<!--    cursor: pointer;-->
<!--    user-select: none;-->
<!--  }-->
<!--}-->
<!--</style>-->
