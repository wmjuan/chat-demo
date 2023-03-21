<template>
  <div class="pay">
    <el-card style="margin-top: 10px">
      <div><span style="font-size: 14px;font-weight: 700">账户余额</span></div>
      <div class="money">
        <div style="font-size: 24px;font-weight: 700">¥<span>0</span>.00</div>
        <el-button type="primary" round size="small" @click="recharge">去充值</el-button>
      </div>
    </el-card>

    <!--    <el-card class="box-card card">-->
    <!--      <div style="font-weight: 700;font-size: 14px">卡券</div>-->
    <!--      <div style="display: flex;flex-direction: row;margin-top: 20px;justify-content: space-evenly">-->
    <!--        <div class="voucher">-->
    <!--          <div @click="toprefer" style="cursor: pointer">优惠券</div>-->
    <!--          <div class="num"><span style="color: #46a0fc;font-size: 24px">5</span>张</div>-->
    <!--        </div>-->
    <!--        <div class="voucher">-->
    <!--          <div>折扣券</div>-->
    <!--          <div class="num"><span style="color: #46a0fc;font-size: 24px">5</span>张</div>-->
    <!--        </div>-->
    <!--        <div class="voucher">-->
    <!--          <div>积分</div>-->
    <!--          <div class="num"><span style="color: #46a0fc;font-size: 24px">0</span>积分</div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </el-card>-->

    <div class="card table">
<!--      <el-card class="card" style="width: 52%">-->
<!--        <div>消息记录 <span>(0)</span></div>-->
<!--        <el-table-->
<!--          :data="tableData"-->
<!--          style="width: 100%;margin-top: 12px"-->
<!--          max-height="400"-->
<!--          :header-cell-style="{background:'#f6f7fa'}"-->
<!--        >-->
<!--          >-->
<!--          <el-table-column-->
<!--            prop="date"-->
<!--            label="时间"-->
<!--            width="200"-->
<!--          />-->
<!--          <el-table-column-->
<!--            prop="name"-->
<!--            label="金额"-->
<!--            width="200"-->
<!--          />-->
<!--        </el-table>-->
<!--      </el-card>-->
      <el-card class="card" style="margin-left: 12px">
        <div>订单管理 <span>(0)</span></div>
        <el-table
          style="margin-top: 12px;width: 100%"
          :data="tableData"
          max-height="400"
          :header-cell-style="{background:'#f6f7fa'}"
        >
          <el-table-column
            prop="date"
            label="订单编号"
            width="150"
          />
          <el-table-column
            prop="name"
            label="金额"
            width="150"
          />
          <el-table-column
            prop="name"
            label="创建时间"
            width="200"
          />
          <el-table-column
            prop="name"
            label="支付状态"
            width="200"
          />
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Department',
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '23.89'
        },
        {
          date: '2016-05-02',
          name: '20.00'
        }]
    }
  },
  methods: {
    recharge() {
      this.$router.push('recharge')
    },
    toprefer() {
      this.$router.push('prefer')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table__header tr{
    padding: 0;
  }
.table{
  width: 90%;
  margin: 0 auto;
}
.pay{
  padding-top: 20px;
  .el-card{
    width: 90%;
    margin: 0 auto;
  }
  .card {
    display: flex;
    margin-top: 10px;
    padding: 6px;
    .voucher{
      background-color: #f6f7fa;
      padding: 10px;
      margin-left: 4px;
      width: 300px;
      font-size: 14px;
      .num{
        padding-top: 20px;
      }
    }
  }
}
.money {
  display: flex;
  padding-top: 20px;
  .el-button{
    margin-left: 50px;
  }
}
</style>
