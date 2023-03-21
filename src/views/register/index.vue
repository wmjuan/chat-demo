<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="registerlogin"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">注册</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="registerlogin.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="off"
        />
      </el-form-item>

      <el-form-item prop="phone_number">
        <el-input v-model="registerlogin.phone_number" placeholder="请输入手机号" auto-complete="off"/>
      </el-form-item>
      <el-row>
        <el-form-item prop="code" style="width: 68%;float: left">
          <el-input v-model="registerlogin.code" placeholder="请输入验证码" class="code" auto-complete="off"/>
        </el-form-item>
        <el-form-item prop="code" style="width: 25%;float: right;margin-top: 3px">
          <el-button type="primary" :disabled="disabled" @click="getcode">{{
            disabled ? btnText : '发送验证码'
          }}
          </el-button>
        </el-form-item>
      </el-row>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerlogin.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="off"
          @keyup.enter.native="hangleregister"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <div>
        <el-button
          class="inline-block"
          type="primary"
          style="width:40%;margin-bottom:30px;float: left"
          @click="gologin"
        >已有账号？去登录
        </el-button>
        <el-button
          class="inline-block"
          :loading="loading"
          type="primary"
          style="width:40%;margin-bottom:30px;float: right"
          @click="hangleregister"
        >注册
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import { register, sendmessages } from '@/api/user'

export default {
  name: 'Login',
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (validUsername(value)) {
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
      registerlogin: {
        username: '',
        password: '',
        phone_number: '',
        code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }],
        phone_number: [{ required: true, trigger: 'blur' }],
        code: [{ required: true, trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      btnText: '',
      start: localStorage.getItem('codetimee') || 0
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
    gologin() {
      this.$router.push({ path: '/login' || '/' })
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
    hangleregister() {
      if (this.registerlogin === {}) {
        return
      }
      const data = {
        username: this.registerlogin.username,
        password: this.registerlogin.password,
        phone_number: this.registerlogin.phone_number,
        code: this.registerlogin.code
      }
      register(data).then(res => {
        this.$message.success('注册成功')
        this.$router.push({ path: '/login' || '/' })
      }).catch(data => {
        this.$message.error('注册失败')
      })
    },
    getcode() {
      const data = {
        phone_number: this.registerlogin.phone_number
      }
      if (this.registerlogin.phone_number.length === 0) {
        return
      }
      sendmessages(data).then(res => {
        this.$message.success('发送成功')
      }).catch(data => {
        this.start = 0
        this.$message.error('发送失败')
      })
      this.start = Date.now()
      this.timer()
      localStorage.setItem('codetimee', this.start)
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
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.inline-block {
  display: inline-block;
}

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #000;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #000;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #000;
    cursor: pointer;
    user-select: none;
  }
}
</style>
<style lang="scss">
/* reset element-ui css */
.login-container:before{
  background: url(../../assets/bgc.jpg) no-repeat;
  background-size: cover;
  background-attachment: fixed;
  width: 100%;
  height: 100%;
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;/*-1 可以当背景*/
  -webkit-filter: blur(3px);
  filter: blur(3px);
  opacity: 0.6;
}
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      height: 47px;
      color: #000;
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #fff;
    border-radius: 5px;
    //color: #454545;
  }
}
</style>
<!--<style lang="scss" scoped>-->
<!--//.code :deep .el-input__wrapper{-->
<!--//  padding-right: 1px-->
<!--//}-->
<!--.login {-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  position:relative;-->

<!--  .login-container {-->
<!--    width: 300px;-->
<!--    height: 240px;-->
<!--    position:absolute;-->

<!--    top:-126px;-->
<!--    bottom: 0;-->
<!--    left: 0;-->
<!--    right: 0;-->
<!--    margin:auto;-->
<!--    display:flex;-->
<!--    flex-direction:column;-->
<!--    justify-content:space-between;-->

<!--    &-title {-->
<!--      font-size: 16px;-->
<!--      font-weight: 700;-->

<!--  }-->

<!--    span {-->
<!--      cursor:pointer;-->

<!--  }-->

<!--    &-tip {-->
<!--      font-size: 12px;-->
<!--      text-align:center;-->
<!--      color: #666;-->
<!--  }-->
<!--}-->

<!--  .tologin {-->
<!--    color: #000;-->
<!--    text-align:right;-->
<!--    cursor:pointer;-->
<!--    font-size: 12px;-->

<!--}-->

<!--}-->
<!--</style>-->
