<template>
  <div ref="box" class="chatAppBody">
    <div v-for="(item,index) in lists" :key="item.id" class="chatBox">
      <div class="chatRow chatRowMe" style="flex-direction: column">
        <div class="chatUsername" style="margin-top: 40px;margin-right: 36px">{{ item.updated_at }}</div>
        <div class="chatMsgContent" style="position: relative">
          <div class="chatContent" style="margin-right: 34px;background-color: #d3f8d3">{{ item.user_content }}
            <i class="el-icon-document-copy" @click="userClickCopy(item,index)" />
            <!--            <i class="el-icon-edit" @click="changeUser(item)"/>-->
            <el-popconfirm
              title="确定删除吗？"
              @onConfirm="handleConfirm(index)"
            >
              <i slot="reference" class="el-icon-delete" />
            </el-popconfirm>
          </div>
          <el-avatar class="chat" :size="30" style="margin-top: -28px" src="https://goflychat.oss-cn-hangzhou.aliyuncs.com/static/upload/avator/2022June/32a988a3c2f8700119fa1f5da1b6a4bd.png" />
        </div>
      </div>
      <div class="chatRow">
        <img class="chatAvatar" src="https://effyic.s3.cn-north-1.jdcloud-oss.com/effyic-logo.png" style="height: 30px;width: 30px">
        <div class="chatMsgContent">
          <div class="chatUsername">{{ item.updated_at }}</div>
          <div id="chat" class="chatContent" style="background-color: #f5f5f5">
            <VueMarkdown :source="item.assistant_content" />
            <i class="el-icon-document-copy" @click="clickCopy(item,index)" />
            <el-dialog style="height: 50%" :visible.sync="dialogFormVisible" :before-close="cancle" title="修改消息内容" width="40%">
              <el-form :model="sessions" @submit.native.prevent>
                <el-form-item label="消息内容：" :label-width="formLabelWidth">
                  <el-input v-model="sessions.name" clearable autocomplete="off" placeholder="输入修改的消息内容" @keyup.enter.native="handleSubmit()" />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer" style="margin-top: -20px">
                <el-button @click="cancle">取 消</el-button>
                <el-button type="primary" @click="handleSubmit()">确 定</el-button>
              </div>
            </el-dialog>
            <el-popconfirm
              title="确定删除吗？"
              @onConfirm="handleConfirm(index)"
            >
              <i slot="reference" class="el-icon-delete" />
            </el-popconfirm>
            <i class="el-icon-edit" @click="changeText(index)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../../bus'
import { history, deleteChat, updataMessage } from '@/api/table'
import VueMarkdown from 'vue-markdown'
export default {
  name: 'Message',
  components: {
    VueMarkdown
  },
  data() {
    return {
      rowId: '',
      userId: '',
      msgId: '',
      lists: [],
      visible: false,
      dialogFormVisible: false,
      sessions: {
        name: ''
      },
      formLabelWidth: '120px',
      chatId: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getData()
    })
    // 页面首次展示时滚动条定位底部
    this.scrollToBottom()
  },
  updated() {
    // 在接收到新消息的时候触发方法将滚动条定位到底部
    this.scrollToBottom()
  },
  methods: {
    // 复制聊天框消息
    clickCopy(item, index) {
      let arr = []
      history(this.msgId).then(res => {
        arr = res.data
        arr = this.DateParse(arr)
        this.lists = arr
        item = arr[index]
        for (let i = 0; i < arr.length; i++) {
          if (item.id === arr[i].id) {
            this.$copyText(item.assistant_content).then(() => {
              this.$message.success('复制成功')
            }
            )
          }
        }
      })
    },
    // 获取历史数据
    getList(id) {
      let arr = []
      history(id).then(res => {
        arr = res.data
        arr = this.DateParse(arr)
        this.lists = arr
      })
    },
    userClickCopy(item, index) {
      let arr = []
      history(this.msgId).then(res => {
        arr = res.data
        arr = this.DateParse(arr)
        this.lists = arr
        item = arr[index]
        for (let i = 0; i < arr.length; i++) {
          if (item.id === arr[i].id) {
            this.$copyText(item.user_content).then(() => {
              this.$message.success('复制成功')
            })
          }
        }
      })
    },
    // 定义将滚动条定位在底部的方法
    scrollToBottom() {
      this.$nextTick(() => {
        const chat = this.$refs.box
        chat.scrollTop = chat.scrollHeight
      })
    },
    // 获取数据 进行渲染
    getData() {
      // 每个对话框的id
      bus.$on('msgID', data => {
        this.msgId = data
      })
      bus.$on('sengDataBefore', data => {
        this.lists.push(data)
        // const interval = setInterval(() => {
        //   this.lists[this.lists.length - 1].assistant_content = this.lists[this.lists.length - 1].assistant_content + '.'
        //   if (this.lists[this.lists.length - 1].assistant_content === 6) {
        //     clearInterval(interval)
        //   }
        // }, 500)
      })
      // 因为data在没有缓存的时候是[]，所以需要处理data.lists,如果data为空数组，给定this.lists也为空  接收每个会话id 的历史记录
      bus.$on('history', data => {
        if (data === [] || data === undefined || data.length === 0) {
          this.lists = []
          return
        } else {
          if (data[0].updated_at.indexOf('.') !== -1) {
            data = this.DateParse(data)
          }
          this.lists = data
        }
      })
      bus.$on('sendResData', data => {
        // 追加lists最后一条数据
        this.lists[this.lists.length - 1]['assistant_content'] = JSON.parse(data)['content']
      })
    },
    // 时间格式处理方法，后续可以放到一个公共方法里
    DateParse(data) {
      // 把带T的时间转为正常的时间格式 yyyy-mm-dd hh:mm:ss
      for (let i = 0; i < data.length; i++) {
        const time = data[i].updated_at
        if (time) {
          const yyyyMMdd = time.split('T')[0]
          const hhmmss = time.split('T')[1].split('.')[0]
          data[i].updated_at = yyyyMMdd + ' ' + hhmmss
        }
      }
      return data
    },
    // 修改取消
    cancle() {
      this.dialogFormVisible = false
    },
    // 修改确定
    handleSubmit() {
      this.dialogFormVisible = false
      const data = {
        'assistant_content': this.sessions.name
      }
      const id = this.chatId
      updataMessage({ id, data }).then(res => {
        history(this.msgId).then(res => {
          if (res.data === [] || res.data === undefined || res.data.length === 0) {
            this.lists = []
            return
          } else {
            const data = res.data
            if (data[0].updated_at.indexOf('.') !== -1) {
              // 把带T的时间转为正常的时间格式 yyyy-mm-dd hh:mm:ss
              this.DateParse(data)
            }
            this.lists = res.data
          }
        })
        this.$message.success('修改成功')
      })
    },
    // 修改机器人的消息
    changeText(index) {
      let arr = []
      history(this.msgId).then(res => {
        arr = res.data
        arr = this.DateParse(arr)
        this.lists = arr
        const item = this.lists[index]
        this.dialogFormVisible = true
        this.sessions.name = item.assistant_content
        this.chatId = item.id
      })
    },
    // 删除会话
    handleConfirm(index) {
      let arr = []
      history(this.msgId).then(res => {
        arr = res.data
        arr = this.DateParse(arr)
        this.lists = arr
        const list = this.lists
        const id = list[index].id
        deleteChat(id).then(res => {
          history(this.msgId).then(res => {
            if (res.data === [] || res.data === undefined || res.data.length === 0) {
              this.lists = []
              return
            } else {
              const data = res.data
              if (data[0].updated_at.indexOf('.') !== -1) {
                this.DateParse(data)
              }
              this.lists = res.data
            }
          })
          this.$message.success('删除成功')
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.img{
  width: 10px;
  height: 10px;
}
.chat{
  //float: right;
  position: absolute;
  right: 0;
  top: 20px;
}
.chatAppBody{
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
}
.chatBox{
  //flex: 1;
  padding: 0 6px;
}
.chatBottom{
  background: #fff;
}
.chatRow{
  display: flex;
  align-items: flex-end;
  margin: 5px 0px;
}
.chatAvatar{
  margin-right: 5px;
  margin-bottom: 24px;
  flex-shrink: 0;
}
.chatUsername {
  font-size: 12px;
  white-space: nowrap;
  color: #999;
  margin-bottom: 2px;
  margin-top: 20px;
}
.chatContent{
  border-radius: 10px 10px 10px 0px;
  padding:10px;
  font-size: 14px;
  word-break: break-all;
  line-height: 21px;
  position: relative;
  ::v-deep p{
    margin: 0;
  }
}
.el-icon-document-copy{
  position: absolute;
  top: -2px;
  right: 0;
  font-size: 12px;
  background-color: rgba(243, 243, 245,0.5);
  cursor: pointer;
}
.el-icon-edit{
  position: absolute;
  top: -2px;
  right: 40px;
  font-size: 12px;
  background-color: rgba(243, 243, 245,0.5);
  cursor: pointer;
}
.el-icon-delete{
  position: absolute;
  top: -2px;
  right: 20px;
  font-size: 12px;
  background-color: rgba(243, 243, 245,0.5);
  cursor: pointer;
}
.chatRowMe{
  justify-content: flex-end;
}
.chatRowMe .chatContent{
  border-radius: 10px 10px 0px 10px;
}
</style>

