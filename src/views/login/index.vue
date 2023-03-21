<template>
  <div class="login-container">
    <div class="left">
      <div class="pic">
        <img src="../../assets/login.jpg">
        <div class="box">
          <p>识因AI是一款基于人工智能技术的生成式自然语言处理模型，由识因团队开发，为客户提供24/7全天候支持。</p>
          <p>识因AI的应用非常广泛，它可以被应用于智能客服、聊天机器人等领域。</p>
          <p>可以用于构建智能客服和聊天机器人，实现自然语言的交互式沟通，通过不断学习和自我优化，能够更好地理解用户的问题，并给出更合适的答复。</p></div>
      </div>
    </div>
    <div class="right">
      <div>
        <div style="font-weight: 700;font-size: 22px;text-align: center;padding-bottom: 30px">识因AI</div>
        <span style="cursor: pointer;font-size: 16px;font-weight: 600" @click="nameLogin">用户名登录</span>
        <span style="cursor: pointer;margin-left: 220px;font-size: 16px;font-weight: 700" @click="phoneLogin">手机号登录</span>
      </div>
      <name v-if="isname" style="padding-top: 20px" />
      <phone v-if="isphone" style="padding-top: 20px" />
    </div>
  </div>
</template>

<script>
import name from './components/name'
import phone from './components/phone'
export default {
  name: 'Login',
  components: {
    name,
    phone
  },
  data() {
    return {
      isphone: false,
      isname: true
    }
  },
  methods: {
    phoneLogin() {
      this.isphone = true
      this.isname = false
    },
    nameLogin() {
      this.isphone = false
      this.isname = true
    }
  }
}
</script>

<style lang="scss" scoped>
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
  display:flex;
  flex-direction:row;
  justify-content:space-around;
  padding-top: 100px;
  .left{
    .pic {
      position: relative;
      img{
        width: 600px;
        height: 500px;
      }
      .box{
        color: #304156;
        width: 550px;
        padding: 10px;
        position: absolute;
        left: 24px;
        bottom: 10px;
        line-height: 20px;
        font-weight: 700;
      }
    }
  }
  .right{
      padding-top: 120px;
  }
}
</style>
