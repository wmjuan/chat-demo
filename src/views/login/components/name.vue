<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="off"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
      <el-button type="primary" style="width:34%;margin-bottom:30px;margin-left:270px" @click="$router.push('/register')">注册</el-button>

    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'

export default {
  name: 'Name',
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('The password can not be less than 6 digits'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loginForm: {
        username: '',
        password: '',
        login_type: 'username'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password'
      // redirect: undefined
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
  methods: {
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
      // debugger
      if (this.loginForm.username.length === 0 && this.loginForm.password.length === 0) {
        return
      }
      this.loading = true
      const data = {
        username: this.loginForm.username,
        password: this.loginForm.password,
        login_type: 'username'
      }
      this.$store.dispatch('user/login', data).then(() => {
        // debugger
        // this.$router.push({ path: this.redirect || '/' })
        // this.$router.push('/dashboard')
        window.location.href = '/'
        this.$message.success('登录成功')
        this.loading = true
      }).catch(() => {
        this.$message.error('登录失败')
        this.loading = false
      })

      // this.$refs.loginForm.validate(valid => {
      //   if (valid) {
      //
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" >
.el-input__inner{
  background-color: #fff!important;
}
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 65%;

    input {
      //background: transparent;
      border: 0px;
      //-webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #000;
      height: 47px;
      //caret-color: $cursor;
      //
      //&:-webkit-autofill {
      //  box-shadow: 0 0 0px 1000px $bg inset !important;
      //  -webkit-text-fill-color: $cursor !important;
      //}
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #fff;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
//.login-container {
//  .login-form {
//    position: relative;
//    width: 520px;
//    max-width: 100%;
//    padding: 10px 35px 0;
//    overflow: hidden;
//    float: right;
//    margin-right: 260px;
//    margin-top: 20px;
//  }
//
//  .tips {
//    font-size: 14px;
//    color: #fff;
//    margin-bottom: 10px;
//
//    span {
//      &:first-of-type {
//        margin-right: 16px;
//      }
//    }
//  }
//
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

