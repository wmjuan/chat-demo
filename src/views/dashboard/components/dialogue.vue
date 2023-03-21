<template>
  <div class="dialog">
    <el-form :model="mess" @submit.native.prevent>
      <el-row>
        <el-col :span="21">
          <el-form-item prop="username" :inline="true">
            <el-input v-model="mess.user_content" clearable autofocus tabindex="2" placeholder="来说点什么..." auto-complete="off" style="margin-left: 20px;width: 600px" @input="change" @keyup.enter.native="sendMess()" />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item :inline="true" style="margin-left: 30px">
            <el-button type="primary" icon="el-icon-position" style="background-color: rgb(145, 207, 173);border:0 " @click="sendMess" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog
      style="margin-left: 50px"
      :visible.sync="dialogVisible"
      width="60%"
      :modal="false"
      top="50vh"
      :before-close="handleClose"
    >
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
      </ul>
    </el-dialog>
  </div>
</template>s

<script>
// import { send } from '../../../api/table'
import bus from '../../../bus'
import { getToken } from '@/utils/auth'
import { EventSourcePolyfill } from 'event-source-polyfill'
export default {
  name: 'Dialogue',
  props: ['sessionid'],
  data() {
    return {
      mess: {
        user_content: ''
      },
      lists: [],
      dialogVisible: false
    }
  },
  methods: {
    // 发送问题
    sendMess() {
      const token = getToken()
      if (this.mess.user_content.trim() === '') {
        this.$message('内容不要为空！')
        return
      }
      let datetime = new Date()
      const year = datetime.getFullYear()
      const month = (datetime.getMonth() + 1) < 10 ? '0' + (datetime.getMonth() + 1) : (datetime.getMonth() + 1)
      const date = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate()
      const hour = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours()
      const minute = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes()
      const second = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds()
      datetime = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
      const data = {
        updated_at: datetime,
        assistant_content: '加载中...',
        user_content: this.mess.user_content,
        conversation_id: this.sessionid
      }
      bus.$emit('sengDataBefore', data)
      this.mess.user_content = ''
      const BASE_URL = process.env.VUE_APP_BASE_API
      // 判断浏览器是否支持SSE
      if (typeof (EventSource) !== 'undefined') {
        const source = new EventSourcePolyfill(BASE_URL + '/messages/stream?user_content=' + data.user_content + '&conversation_id=' + data.conversation_id, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        // 响应消息-实现方式2
        source.addEventListener('message', function(e) {
          if (e.data === '[DONE]') {
            console.log('链接关闭')
            source.close()
          } else {
            const resData = e.data
            bus.$emit('sendResData', resData)
          }
        }, false)
        // 响应open事件
        source.addEventListener('open', function(e) {
          console.log('连接打开')
        }, false)
        // 响应close事件，主动关闭EventSource
        // 后端关闭SSE会执行error事件，在error事件中关闭SSE不友好，后端在关闭SSE发送close
        // 事件以友好的关闭SSE
        source.addEventListener('close', function(e) {
          source.close()
          console.log('数据接收完毕，关闭EventSource')
        }, false)

        // 响应error事件
        source.addEventListener('error', function(e) {
          source.close()
          if (e.readyState === EventSource.CLOSED) {
            console.log('连接关闭')
          } else {
            console.log(e)
          }
        }, false)
      } else {
        alert('你的浏览器不支持SSE')
      }
      this.dialogVisible = false
    },
    handleClose() {
      this.dialogVisible = false
    },
    // input值发生改变
    change() {
      const mess = this.mess.user_content.trim()
      if (mess.length === 0) {
        this.dialogVisible = false
      } else {
        this.dialogVisible = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 10px;
}
ul{
  padding: 0;
  li{
    list-style-type: none
  }
}
.dialog{
  width: 100%;
  display: flex;
  justify-content: start;
}
el-input{
  outline:none;
}
input{
  outline:none;
}
.el-input__inner{
  outline:none;
}
/* 设置输入框（input）聚焦时的高亮颜色 */
.el-input__inner:focus {
  border-color: red;
}
</style>
