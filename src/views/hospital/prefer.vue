<template>
  <div class="card">
    <el-card class="card" style="width: 90%;margin-top: 30px">
      <div style="padding-bottom: 20px;font-size: 14px">
        <span>未使用</span>
        <span style="margin-left: 20px">已使用</span>
        <span style="margin-left: 20px">已过期</span>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{background:'#f6f7fa'}"
      >
        >
        <el-table-column
          prop="date"
          label="使用场景"
          width="200"
        />
        <el-table-column
          prop="name"
          label="使用规则"
          width="200"
        />
        <el-table-column
          prop="name"
          label="生效时间/失效时间"
          width="400"
        />
        <el-table-column
          prop="name"
          label="来源"
          width="350"
        />
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Prefer',
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
  }
}
</script>

<style lang="scss" scoped>
.el-card{
  width: 80%;
  margin: 0 auto;
}
</style>
