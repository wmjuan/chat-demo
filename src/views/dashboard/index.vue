<template>
  <div class="dashboard">
    <div class="left">
      <div class="title" style="cursor: pointer" @click="ceartChat">New Chat</div>
      <el-dialog style="height: 50%" :visible.sync="dialogFormVisible" :before-close="cancle" title="修改会话名称" width="30%">
        <el-form :model="form" @submit.native.prevent>
          <el-form-item label="会话名称：" :label-width="formLabelWidth">
            <el-input v-model="form.name" clearable autocomplete="off" placeholder="请输入会话名称" clearable @keyup.enter.native="config()" />
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
        <i class="el-icon-delete" style="cursor: pointer;position: absolute;right: 4px;top: 16px" @click.stop="deleteChat(item.id)" />
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
      @mousedown="down"
      @mousemove="move"
      @mouseup="end"
      @click="show"
    >
      <img src="../../assets/eff.jpg">
    </div>
    <el-dialog
      :close-on-click-modal='false'
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
      isshow: false,
      flags: false, // 控制使用
      position: {
        x: 0,
        y: 0
      },
      nx: '',
      ny: '',
      dx: '',
      dy: '',
      xPum: '',
      yPum: ''
    }
  },
  created() {
    this.$nextTick(() => {
      this.renderlist()
    })
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
        bus.$emit('msgID', id)
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
    // 取消新建/修改
    cancle() {
      this.dialogFormVisible = false
      this.form.name = ''
    },
    // 删除会话
    deleteChat(id) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
    down() {
      console.log(1)
      this.flags = true
      var touch
      if (event.touches) {
        touch = event.touches[0]
      } else {
        touch = event
      }
      this.position.x = touch.clientX
      this.position.y = touch.clientY
      this.dx = this.$refs.fu.offsetLeft
      this.dy = this.$refs.fu.offsetTop
      this.move()
    },
    move() {
      console.log(2)
      if (this.flags) {
        var touch
        if (event.touches) {
          touch = event.touches[0]
        } else {
          touch = event
        }
        this.nx = touch.clientX - this.position.x
        this.ny = touch.clientY - this.position.y
        this.xPum = this.dx + this.nx
        this.yPum = this.dy + this.ny
        const width = window.innerWidth - this.$refs.fu.offsetWidth // 屏幕宽度减去自身控件宽度
        const height = window.innerHeight - this.$refs.fu.offsetHeight // 屏幕高度减去自身控件高度
        this.xPum < 0 && (this.xPum = 0)
        this.yPum < 0 && (this.yPum = 0)
        this.xPum > width && (this.xPum = width)
        this.yPum > height && (this.yPum = height)
        this.$refs.fu.style.left = this.xPum + 'px'
        this.$refs.fu.style.top = this.yPum + 'px'
      }
    },
    // 鼠标释放时候的函数
    end() {
      this.flags = false
      this.move()
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
    padding-left: 30px;
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
