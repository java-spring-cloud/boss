<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item label="分类名称:">
        <el-input v-model.trim="query.name"></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="query.region" clearable>
          <el-option v-for="item in statusOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData()">查询</el-button>
        <el-button icon="el-icon-refresh" @click="reload()">重置</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="openAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" stripe border style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="60">
      </el-table-column>
      <el-table-column align="center" prop="name" label="分类名称">
      </el-table-column>
      <el-table-column align="center" prop="sort" label="排序">
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注">
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statsusFilter">
            {{ scope.row.status ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="success"
            @click="handleEdit(scope.row.id)"
            size="small"
            >编辑</el-button
          >
          <el-button
            type="danger"
            @click="handleDelete(scope.row.id)"
            size="small"
            v-preventReClick
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    >
    </el-pagination>

    <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData" :remoteClose="remoteClose"/>
  </div>
</template>
<script>
import api from '@/api/category'
import Edit from './edit.vue'
const statusOptions = [
  {code: 0,name: '禁用'},
  {code: 1,name: '正常'}
]
export default {
  name: 'Category',
  components: {Edit},

  data () {
    return {
      list: [],
      page: {
        current: 1,//当前页码
        size: 20,//每页显示多少页码
        total: 0
      },
      query: {},//查询条件
      statusOptions,//状态下拉框数组
      edit: {
        title: '',
        visible: false,
        formData: {}
      }
    }
  },


  filters: {
    statsusFilter (status) {
      const statusMap = { 0: 'danger', 1: 'success' }
      return statusMap[status]
    }
  },

  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      api.getList(this.query, this.page.current, this.page.size).then(response => {
        console.log(response);
        this.list = response.data.records
        this.page.total = response.data.total
      })
    },
    handleEdit (id) {
      //通过id查询详情
      api.getById(id).then(response => {
        if(response.code === 20000){
          //将查询的详情传递
          this.edit.formData = response.data
          this.edit.title = '编辑'
          this.edit.visible = true
        }
      })
    },
    handleDelete (id) {
      this.$confirm('是否删除此记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.deleteById(id).then(response => {
            this.$message({
            type: response.code === 20000 ? 'success' : 'error',
            message: response.message
          });
        })
        this.fetchData()
        }).catch(() => {
          //取消删除不用理会
        });
    },
    //切换之后显示每页多少条数
    handleSizeChange (val) {
      this.page.size = val
      this.fetchData()
    },
    //页码改变的时候触发此方法 val是当前点击的那个页码
    handleCurrentChange (val) {
      this.page.current = val
      this.fetchData()
    },
    //条件查询
    queryData(){
      console.log('条件查询');
      this.page.current = 1
      this.fetchData()
    },
    //重置
    reload(){
      console.log('重置');
      this.query = {}
      this.fetchData()
    },
    //子组件会触发此方法来关闭窗口
    remoteClose(){
      this.edit.formData = {}
      this.edit.visible = false
      this.fetchData()
    },
    //打开新增窗口
    openAdd(){
      this.edit.visible = true
      this.edit.title = '新增'
    }
  }
}
</script>