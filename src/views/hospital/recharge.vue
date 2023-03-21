<template>
  <el-card style="margin-top: 30px">
    <h5>充值金额</h5>
    <div class="top">
      <div style="display: flex;flex-direction: row;justify-content: space-around">
        <div class="box">
          <div class="bord">¥6.00</div>
          <div class="small">尝鲜体验</div>
        </div>
        <div class="box">
          <div class="bord">¥18.00</div>
          <div class="small">尝鲜体验</div>
        </div>
        <div class="box">
          <div class="bord">¥68.00</div>
          <div class="small">稳定体验</div>
        </div>
        <div class="box">
          <div class="bord">¥168.00</div>
          <div class="small">性价比之王</div>
        </div>
      </div>
      <div style="display: flex;flex-direction: row;justify-content: space-around;margin-top: 12px">
        <div class="box">
          <div class="bord">¥648.00</div>
          <div class="small">送福利</div>
        </div>
        <div class="box">
          <div class="bord">¥998.00</div>
          <div class="small">送福利</div>
        </div>
        <div class="box" style="text-align: left;width: 47%;padding-left: 20px">
          <div style="padding-top: 26px;font-weight: 700">自定义金额</div>
          <div style="font-size: 12px">
            <el-input placeholder="请输入金额" style="border: none"></el-input>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom">

    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Recharge'
}
</script>

<style lang="scss" scoped>
.el-card{
  width: 80%;
  margin: 0 auto;
  .box{
    width: 22%;
    height: 100px;
    //padding: 20px 80px;
    border: 1px solid #ccc;
    text-align: center;
  }
  .bord{
    margin-top: 26px;
    font-weight: 700;
    font-size: 20px;
  }
  .small{
    font-size: 12px;
    padding-top: 10px;
  }
  .el-input {
    padding-left: 0;
    border: 0;
  }
}
.bottom {
  width: 97%;
  background-color: #f6f7fa;
  padding: 10px;
  margin: 0 auto;
  margin-top: 20px;
}
</style>
