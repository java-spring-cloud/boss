<template>
  <div class="app-container">

     <!-- 条件查询 -->
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item label="广告标题:">
        <el-input v-model.trim="query.title"></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="query.status" clearable>
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
      <el-table-column align="center" prop="title" label="广告标题">
      </el-table-column>
      <el-table-column align="center" prop="imageUrl" label="广告图片">
        <template slot-scope="scope">
          <el-image 
          style="width: 100px; height: 100px"
          :src="scope.row.imageUrl" 
          :preview-src-list="[scope.row.imageUrl]">
        </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="advertUrl" label="广告链接">
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="danger">禁用</el-tag>
          <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sort" label="排序">
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

    <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData" :remoteClose="remoteClose" :oldImageUrl="edit.oldImageUrl" />
  </div>
</template>
<script>
const statusOptions = [
  {code: 0,name: '禁用'},
  {code: 1,name: '正常'}
]
import api from '@/api/advert'

import Edit from './edit.vue'
export default {
  name: 'Advert',
  components: {Edit},
  data(){
    return {
      list: [],
      page: {
        current: 1,
        size: 20,
        total: 0
      },
      query: {},
      statusOptions,
      edit: {
        title: '',
        visible: false,
        formData: {
          imageUrl: null //不声明，上传后无法回显图片
        }
      },
      oldImageUrl: null //是编辑时查询出来的原始图片
    }
  },

  created(){
    this.fetchData()
  },

  methods: {
    async fetchData(){
      console.log("123");
      const {data} = await api.getList(this.query,this.page.current,this.page.size)
      this.page.total = data.total
      this.list = data.records
    },
    //编辑
    async handleEdit(id){
      const response = await api.getById(id)
      if(response.code === 20000){
        this.edit.formData = response.data
        //修改前的url图片
        this.edit.oldImageUrl = response.data.imageUrl
        this.edit.visible = true
        this.edit.title = '编辑'
      }
    },
    //删除
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
    handleSizeChange(val){
      this.page.size = val
      this.fetchData()
    },
    handleCurrentChange(val){
      this.page.current = val
      this.fetchData()
    },
    //条件查询
    queryData(){
      this.page.current = 1
      this.fetchData()
    },
    //重置
    reload(){
      this.query = {}
      this.fetchData()
    },
    openAdd(){
      this.edit.visible = true
      this.edit.title = '新增'
    },
    remoteClose(){
      this.edit.formData = {imageUrl: null}
      this.edit.visible = false
      this.fetchData()
    }
  }
}
</script>