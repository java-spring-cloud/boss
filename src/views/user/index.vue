<template>
  <div class="app-container">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item label="用户名:">
        <el-input v-model.trim="query.username"></el-input>
      </el-form-item>
      <el-form-item label="手机号:">
        <el-input v-model.trim="query.mobile"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData()" v-preventReClick
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="reload()" v-preventReClick>重置</el-button>
        <el-button
          icon="el-icon-circle-plus-outline"
          type="primary"
          @click="openAdd"
          >新增</el-button
        >
        <el-button
          icon="el-icon-circle-plus-outline"
          type="primary"
          @click="handleDownload"
          v-preventReClick
          >导出用户</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :data="list" stripe border style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="60">
      </el-table-column>
      <el-table-column align="center" prop="username" label="用户名">
      </el-table-column>
      <el-table-column align="center" prop="nickName" label="昵称">
      </el-table-column>
      <el-table-column align="center" prop="mobile" label="手机号">
      </el-table-column>
      <el-table-column align="center" prop="email" label="邮箱">
      </el-table-column>
      <el-table-column
        align="center"
        prop="isAccountNonExpired"
        label="账号过期"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isAccountNonExpired === 0" type="danger"
            >已过期</el-tag
          >
          <el-tag v-if="scope.row.isAccountNonExpired === 1" type="success"
            >未过期</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="isAccountNonLocked"
        label="账号锁定"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isAccountNonLocked === 0" type="danger"
            >锁定</el-tag
          >
          <el-tag v-if="scope.row.isAccountNonLocked === 1" type="success"
            >正常</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="isCredentialsNonExpired"
        label="密码过期"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isCredentialsNonExpired === 0" type="danger"
            >已过期</el-tag
          >
          <el-tag v-if="scope.row.isCredentialsNonExpired === 1" type="success"
            >未过期</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isEnabled" label="是否可用">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isEnabled === 0" type="danger">已删除</el-tag>
          <el-tag v-if="scope.row.isEnabled === 1" type="success">可用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="340px">
        <template slot-scope="scope" v-if="scope.row.isEnabled === 1">
          <el-button @click="handleEdit(scope.row.id)" size="small"
            >编辑</el-button
          >
          <el-button
            type="danger"
            @click="handleDelete(scope.row.id)"
            size="small"
            v-preventReClick
            >删除</el-button
          >
          <el-button
            type="success"
            @click="handleRole(scope.row.id)"
            size="small"
            v-preventReClick
            >设置角色</el-button
          >
          <el-button
            type="success"
            @click="handlePwd(scope.row.id)"
            size="small"
            v-preventReClick
            >密码修改</el-button
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

    <edit
      :title="edit.title"
      :formData="edit.formData"
      :visible="edit.visible"
      :remoteClose="remoteClose"
    />

    <el-dialog title="设置角色" :visible.sync="role.visible" width="65%">
      <!--  当前用户可拥有的角色id，saveUserRole事件是子组件进行触发提交选择的角色id -->
      <role :roleIds="role.roleIds" @saveUserRole="saveUserRole" />
    </el-dialog>

    <password title="修改密码" :userId="pwd.userId" :visible="pwd.visible" :remoteClose="remotePwdClose" />
  </div>
</template>
<script>
import * as api from '@/api/user'

import Edit from './edit.vue'

import Role from '../role/index.vue'

import Password from './password.vue'

export default {
  name: 'User',
  components: { Edit,Role, Password },
  data () {
    return {
      list: [],
      page: {
        current: 1,
        size: 20,
        total: 0
      },
      query: {},
      edit: {
        title: '',
        visible: false,
        formData: {}
      },
      role: { //弹出设置角色组件
        visible: false,
        roleIds: [],//封装
        userId: null
      },
      pwd: {
        userId: null,
        visible: false,
      },
      downloadLoading: false
    }
  },

  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      const { data } = await api.getList(this.query, this.page.current, this.page.size)
      this.list = data.records
      this.page.total = data.total
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
    queryData () {
      console.log('条件查询');
      this.page.current = 1
      this.fetchData()
    },
    //重置
    reload () {
      console.log('重置');
      this.query = {}
      this.fetchData()
    },
    //子组件会触发此方法来关闭窗口
    remoteClose () {
      this.edit.formData = {}
      this.edit.visible = false
      this.fetchData()
    },
    //打开新增窗口
    openAdd () {
      this.edit.visible = true
      this.edit.title = '新增————默认密码与用户名一致'
    },
    handleEdit (id) {
      api.getById(id).then(response => {
        if(response.code === 20000){
          this.edit.formData = response.data
          this.edit.visible = true
          this.edit.title = '编辑'
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
    handleRole (id) {
      this.role.userId = id
      api.getRoleIdsByUserId(id).then(response => {
        //角色id 传递给子组件
        this.role.roleIds = response.data
        //弹出
        this.role.visible = true
      })
    },
    //角色列表子组件会触发此方法来保存当前用户选择的角色id
    saveUserRole(roleIds){
      // console.log('saveUserRole'+roleIds);
      api.saveUserRole(this.role.userId,this.roleIds).then(response => {
        if(response.code === 20000){
          this.$message({
            message: '保存用户角色成功',
            type: 'success',
          })
          this.role.visible = false
        }else{
          this.$message({
            message: '保存用户角色失败',
            type: 'error',
          })
        }
      })
    },
    remotePwdClose(){
      this.pwd.userId = null
      this.pwd.visible = false
      this.fetchData()
    },
    //修改密码
    handlePwd (id) {
      this.pwd.userId = id
      this.pwd.visible = true
    },
    handleDownload(){
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const multiHeader = [['Id', 'Main Information', '', '', 'email']]
        const header = ['序号', '用户名', '昵称', '手机号','邮箱']
        const filterVal = ['id', 'username', 'nickName', 'mobile', 'email']
        const list = this.list
        console.log(list);
        const data = this.formatJson(filterVal, list)
        const merges = ['A1:A2', 'B1:D1', 'E1:E2']
        excel.export_json_to_excel({
          multiHeader,
          header,
          merges,
          data
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>