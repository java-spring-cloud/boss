<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="query" size="mini" >
      <el-form-item label="分类名称:">
        <el-input v-model.trim="query.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="fetchData()" v-preventReClick
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="reload()" v-preventReClick>重置</el-button>
        <el-button
          icon="el-icon-circle-plus-outline"
          type="primary"
          @click="handleAdd(0)"
          v-preventReClick
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <el-table row-key="id" :data="list" stripe border style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="60">
      </el-table-column>
      <el-table-column align="center" prop="name" label="名称">
      </el-table-column>
      <el-table-column align="center" prop="url" label="请求地址">
      </el-table-column>
      <el-table-column align="center" prop="code" label="权限标识">
      </el-table-column>
      <el-table-column align="center" prop="type" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">目录</span>
          <span v-if="scope.row.type === 2">菜单</span>
          <span v-if="scope.row.type === 3">按钮</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="code" label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sort" label="排序">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="handleAdd(scope.row.id)"
            size="small"
            >新增</el-button
          >
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

    <!-- 新增或者编辑 -->
    <edit
      :title="edit.title"
      :visible="edit.visible"
      :formData="edit.formData"
      :remoteClose="remoteClose"
    />
  </div>
</template>

<script>
import api from '@/api/menu'

import Edit from './edit.vue'

export default {
  name: 'Menu',
  components: { Edit },
  data () {
    return {
      list: [],
      query: {},
      edit: {
        title: '',
        visible: false,
        formData: {}
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      const { data } = await api.getList(this.query)
      this.list = data
    },
    //新增菜单 ,id作为新菜单的parentId
    handleAdd (id) {
      //id = 0 是在条件查询的地方点击，是新增一级菜单，否侧新增的是某菜单的子菜单
      this.edit.formData.parentId = id
      this.edit.title = '新增'
      this.edit.visible = true
    },
    //关闭窗口
    remoteClose () {
      this.edit.formData = {}
      this.edit.visible = false
      this.fetchData()
    },
    //编辑菜单
    handleEdit (id) {
      api.getById(id).then(response => {
        if(response.code === 20000){
          this.edit.formData = response.data
          //设置标题
          this.edit.title = '编辑'
          this.edit.visible = true
        }else{

        }
      })
    },
    //删除菜单
    handleDelete (id) {
      this.$confirm('确定删除当前节点与子节点记录吗?', '提示', {
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
    //重置
    reload () {
      this.query = {}
      this.fetchData()
    },
  }
}
</script>