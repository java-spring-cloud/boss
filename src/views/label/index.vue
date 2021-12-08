<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item label="标签名称:">
        <el-input v-model.trim="query.name"></el-input>
      </el-form-item>
      <el-form-item label="分类名称:">
        <el-select v-model="query.categoryId" clearable filterable>
          <el-option v-for="item in categoryList" :key="item.code" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData()" v-preventReClick>查询</el-button>
        <el-button icon="el-icon-refresh" @click="reload()" v-preventReClick>重置</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="openAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" stripe border style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="60">
      </el-table-column>
      <el-table-column align="center" prop="name" label="标签名称">
      </el-table-column>
      <el-table-column align="center" prop="categoryName" label="分类名称">
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


    <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData" :remoteClose="remoteClose" :categoryList="categoryList" />
  </div>
</template>
<script>


import api from '@/api/label'

import categoryApi from '@/api/category'

import Edit from './edit.vue'
export default {
  name: 'Label',

  components: {Edit},
  data(){
    return {
      list: [], //封装列表数据
      page: {
        current: 1,
        size: 20,
        total: 0
      },
      query: {},
      categoryList: [],
      edit: {
        title: '',
        visible: false,
        formData: {}
      }
    }
  },
  created(){
    this.fetchData()
    this.getCategoryList()
  },
  methods: {
    fetchData(){
      api.getList(this.query,this.page.current,this.page.size).then(response => {
        this.list = response.data.records
        console.log(this.list+ '123');
        this.page.total = response.data.total
      })
    },
    handleEdit(id){
      api.getById(id).then(response => {
        if(response.code === 20000){
          this.edit.formData = response.data
          //弹出堂口
          this.edit.visible = true,
          this.edit.title = '编辑'
        }
      })
    },
    handleDelete(id){
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
    //每页显示多少条后触发
    handleSizeChange(val){
      this.page.size = val
      this.fetchData()
    },
    handleCurrentChange(val){
      this.page.current = val
      this.fetchData()
    },
    //获取正常状态的分类列表数据
    getCategoryList(){
      categoryApi.getNormalList().then(response => {
        this.categoryList = response.data
        console.log(response.data);
        console.log('this.categoryList:'+ this.categoryList);
      })
    },
    //条件查询
    queryData(){
      //将页码转化为第一页
      this.page.current = 1
      this.fetchData()
    },
    //重置
    reload(){
      this.query = {}
      this.fetchData()
    },
    //打开新增窗口
    openAdd(){
      this.getCategoryList()
      this.edit.visible = true
      this.edit.title = '新增'
    },
    //关闭弹窗
    remoteClose(){
      this.edit.formData = {}
      this.edit.visible = false
      this.fetchData()
    }
  }
}
</script>