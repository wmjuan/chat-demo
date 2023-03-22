<template>
  <div class="dashboard">
    <div class="left">
      <div class="title" style="cursor: pointer" @click="ceartChat">New Chat</div>
      <el-dialog style="height: 50%" :visible.sync="dialogFormVisible" :before-close="cancle" title="修改会话名称" width="30%">
        <el-form :model="form" @submit.native.prevent>
          <el-form-item label="会话名称：" :label-width="formLabelWidth">
            <el-input v-model="form.name" clearable autocomplete="off" placeholder="请输入会话名称" @keyup.enter.native="config()" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top: -20px">
          <el-button @click="cancle">取 消</el-button>
          <el-button type="primary" @click="config()">确 定</el-button>
        </div>
      </el-dialog>
      <div v-for="(item,index) in list" :key="item.id" class="conversation" :class="{active:active == index}" @click="hangleClick(item.id);toggle(index)">
        <i class="el-icon-chat-dot-square" />
        <span class="text">{{ item.name }}</span>
        <i class="el-icon-edit" style="cursor: pointer;position: absolute;right:30px;top:16px" @click.stop="updataChat(item.id)" />
        <el-popconfirm
          title="确定删除吗？"
          @onConfirm="successConfirm(item.id)"
          @onCancel="successCancel()"
        >
          <i
            slot="reference"
            class="el-icon-delete"
            style="cursor: pointer;position: absolute;right: 4px;top: 16px"
          />
        </el-popconfirm>
      </div>
    </div>
    <div v-if="isshow" class="right">
      <div class="lists">
        <message />
      </div>
      <div class="dialog">
        <dialogue :sessionid="sessionid" />
      </div>
    </div>
    <div
      ref="fu"
      class="callback float"
    >
      <img src="../../assets/eff.jpg">
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="80%"
      top="50vh"
    >
      <span>11111</span>
    </el-dialog>
  </div>
</template>

<script>
import Dialogue from '@/views/dashboard/components/dialogue.vue'
import Message from '@/views/dashboard/components/message.vue'

import { createSession, sessionList, updataChat, deleteSession, checkSession, history } from '@/api/table'
import bus from '../../bus'
export default {
  name: 'Dashboard',
  components: {
    Message,
    Dialogue
  },
  data() {
    return {
      dialogVisible: false,
      active: -1,
      dialogFormVisible: false,
      form: {
        name: ''
      },
      formLabelWidth: '120px',
      list: [],
      handleType: null,
      updataid: null,
      sessionDetails: [],
      sessionid: 0,
      isshow: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.renderlist()
    })
  },
  mounted() {
    // 监听悬浮拖拽区域
    // this.$nextTick(() => {
    //   // 获取DOM元素
    //   const smallBox = this.$refs.fu
    //   const bigBox = document.querySelector('.dashboard')
    //   //  绑定事件
    //   function handleMove(e) {
    //     console.log(11)
    //     // 计算  x  y
    //     var e = e || window.event
    //     var x = e.clientX - bigBox.offsetLeft - 20
    //     var y = e.clientY - bigBox.offsetTop - 20
    //     //  判断上 左
    //     if (x <= 0) {
    //       x = 0
    //     }
    //     if (y <= 0) {
    //       y = 0
    //     }
    //     // 判断右 下
    //     if (x >= bigBox.offsetWidth - smallBox.offsetWidth) {
    //       x = bigBox.offsetWidth - smallBox.offsetWidth + 48
    //     }
    //     if (y >= bigBox.offsetHeight - smallBox.offsetHeight) {
    //       y = bigBox.offsetHeight - smallBox.offsetHeight + 48
    //     }
    //     smallBox.style.top = y + 'px'
    //     smallBox.style.left = x + 'px'
    //   }
    //   smallBox.addEventListener('mousedown', function(e) {
    //     document.addEventListener('mousemove', handleMove)
    //   })
    //   document.addEventListener('mouseup', function() {
    //     document.removeEventListener('mousemove', handleMove)
    //   })
    // })

    const box = this.$refs.fu
    // 获取浏览器的尺寸
    var window_width = document.body.clientWidth || document.documentElement.clientWidth
    var window_height = document.body.clientHeight || document.documentElement.clientHeight
    // 获取box的尺寸
    var box_width = box.offsetWidth
    var box_height = box.offsetHeight
    // 给box绑定按下事件
    box.onmousedown = function(e) {
      console.log('我被按下了')
      var e = e || window.event
      //  按下的时候  可以获取按下的位置 在元素中的位置
      var l = e.offsetX
      var t = e.offsetY
      //  在鼠标移动的时候  可以绑定给其他的元素 如 document
      document.onmousemove = function(e) {
        console.log('我移动了')
        var e = e || window.event
        // 获取鼠标移动的坐标
        //  鼠标一直在按下的位置
        // var x = e.pageX - l
        // var y = e.pageY - t
        // 鼠标一直在中间位置
        var x = e.pageX - box.offsetWidth / 2
        var y = e.pageY - box.offsetHeight / 2
        // 判断左边和上边
        if (x <= 50) {
          x = 0
        } else if (x >= window_width - box_width - 50) {
          x = window_width - box_width
        }
        if (y <= 50) {
          y = 0
        } else if (y >= window_height - box_height - 50) {
          y = window_height - box_height
        }
        //  判断下边和右边
        if (x >= window_width - box_width - 50) {
          x = window_width - box_width
        }
        if (y >= window_height - box_height - 50) {
          y = window_height - box_height
        }
        // 2-5 改变div的位置
        box.style.left = x + 'px'
        box.style.top = y + 'px'
      }
      // 2-3 绑定抬起事件 取消移动事件
      box.onmouseup = function() {
        console.log('我被抬起了')
        document.onmousemove = null
      }
    }
  },
  methods: {
    toggle(index) {
      this.active = index
    },
    // 会话列表
    renderlist() {
      sessionList().then(res => {
        this.list = res.data
        this.list.reverse()
      })
    },
    // 点击确认
    config() {
      const data = {
        'name': this.form.name
      }
      const id = this.updataid
      updataChat({ id, data }).then(res => {
        this.renderlist()
        this.dialogFormVisible = false
        this.$message.success('修改成功')
        this.form.name = ''
      })
    },
    // 点击每个会话
    hangleClick(id) {
      setTimeout(() => {
        bus.$emit('msgID', id)
      }, 100)
      this.sessionid = id
      this.isshow = true
      const data = JSON.parse(localStorage.getItem(id))
      // if (data != null && data !== undefined) {
      //   // 根据每个会话id 传所有消息记录
      //   bus.$emit('sengmess', data)
      // } else {
      //   // 缓存查询出来为null，但是v-for渲染需要初始化数组，所以给定一个空的数组
      //   data = []
      //   bus.$emit('sengmess', data)
      // }
      // 根据每个会话id 查询所有的历史记录
      history(this.sessionid).then(res => {
        // 把历史记录传给 message 组件中
        bus.$emit('history', res.data)
      })
    },
    // 创建会话
    ceartChat() {
      const val = {
        'name': 'New Chat'
      }
      createSession(val).then(res => {
        this.list.unshift(res.data)
        this.active = 0
        this.hangleClick(res.data.id)
      })
    },
    // 取消修改
    cancle() {
      this.dialogFormVisible = false
      this.form.name = ''
    },
    // 删除
    successConfirm(id) {
      deleteSession(id).then(res => {
        this.renderlist()
        const num = []
        this.list.forEach(function(item, index) {
          num.push(item.id)
        })
        if (num[0] === id && this.list.length === 1) {
          this.isshow = false
          this.active = -1
        } else if (num[0] === id && this.list.length !== 1) {
          this.hangleClick(num[1])
        } else {
          this.hangleClick(num[0])
        }
        this.active = 0
      })
    },
    // 取消删除
    successCancel() {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    },
    // 更改会话名称
    updataChat(id) {
      this.updataid = id
      this.handleType = 'edit'
      this.dialogFormVisible = true
      checkSession(id).then(res => {
        this.form.name = res.data.name
      })
    },
    show() {
      this.dialogVisible = !this.dialogVisible
    }
  }
}
</script>

<style lang="scss" scoped>
.callback img {
  display: block;
  width: 50px;
  height: 50px;
  box-shadow: 0 0 10px rgb(133, 129, 129);
  border-radius: 50%;
  background: #fff;
}

.callback {
  position: fixed;
  top: 40px;
  left: 20px;
  z-index: 99999;
}

.float {
  position: fixed;
  right: 20px;
  top: 60%;
  touch-action: none;
  text-align: center;
  width: 50px;
  height: 50px;
  border-radius: 24px;
  line-height: 48px;
  color: white;
}
.active{
  border: 1px solid rgb(75 158 95 )!important;
  background-color: rgb(245 245 245);
  color: rgb(75 158 95);
}
.dashboard {
    display: flex;
    flex-wrap: wrap;
    justify-content:start;
    //height: 100vh;
    //overflow-y: hidden;
  position: relative;
  .text{
    display: inline-block;
    //width: 204px;
    font-size: 14px;
    text-align: center;
    //margin-left: 54px;
    padding-left: 26px;
  }
    .left{
      width:18%;
      border: 1px solid #e5e7eb;
      text-align: center;
      padding: 6px;
      padding-left: 20px;
      height: 93vh;
      .title{
        text-align: center;
        padding: 4px;
        height: 40px;
        line-height: 30px;
        border: 1px dashed #e5e7eb;
        border-radius: 4px;
        font-size: 14px;
      }
      .conversation{
        cursor: pointer;
        margin-top: 10px;
        padding: 4px;
        padding-left: 16px;
        height: 50px;
        line-height: 40px;
        position: relative;
        border: 1px solid #e5e7eb;
        border-radius: 4px;
        text-align: left;
      }
    }
    .right{
      width:80%;
      display: flex;
      flex-direction:column;
      position:relative;
      height: 93vh;
      .lists{
        //position: absolute;
        //top: 0;
        //left: 0;
        //right: 0;
        //bottom: 30px;
        height: 90%;
        overflow-y:auto;
        overflow: hidden;
      }
      .dialog{
        padding-top: 10px;
      }
    }
  }
</style>
