<template>
  <div class="app-container">
    
     <!-- 条件查询 -->
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item label="角色名称:">
        <el-input v-model.trim="query.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData()" v-preventReClick>查询</el-button>
        <el-button icon="el-icon-refresh" @click="reload()" v-preventReClick>重置</el-button>
        <el-button v-if="!roleIds" icon="el-icon-circle-plus-outline" type="primary" @click="openAdd" v-preventReClick>新增</el-button>
        <el-button v-if="roleIds" icon="el-icon-circle-plus-outline" type="success" @click="handleUserRole" v-preventReClick>设置角色</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="dataTable" @selection-change="handleSelectionChange" :data="list" stripe border style="width: 100%" row-key="id">
      <el-table-column align="center" reserve-selection	type="selection" width="55"></el-table-column>
      <el-table-column align="center" type="index" label="序号" width="60">
      </el-table-column>
      <el-table-column align="center" prop="name" label="角色名称">
      </el-table-column>
      <el-table-column align="center" prop="remark" label="备注">
      </el-table-column>
      <el-table-column align="center" label="操作" v-if="!roleIds">
        <template slot-scope="scope">
          <el-button type="primary" @click="handlePermission(scope.row.id)" size="small" v-preventReClick>分配权限</el-button>
          <el-button type="success" @click="handleEdit(scope.row.id)" size="small" >编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope.row.id)" size="small" v-preventReClick>删除</el-button>
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

    <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData" :remoteClose="remoteClose" />

    <!-- 设置权限 -->
    <permission title="分配权限" :visible="per.visible" :remoteClose="remotePerClose" :roleId="per.roleId" />

  </div>
</template>
<script>
import api from "@/api/role";
import Edit from "./edit.vue";
import Permission from './permission.vue'
export default {
  name: 'Role',
  components: {Edit,Permission},
  props: {
    roleIds: null
  },
  data(){
    return {
      list: [],
      page: {
        current: 1,
        size: 20,
        total: 0
      },
      edit: {
        title: '',
        visible: false,
        formData: {}
      },
      query: {},
      per: {
        visible: false,
        roleId: null //角色id
      },
      checkedRoleList: [] //存储选中的对象
    }
  },

  created(){
    this.fetchData()
  },

  methods: {
    async fetchData(){
      const {data} = await api.getList(this.query,this.page.current,this.page.size)
      this.list = data.records
      this.page.total = data.total

      //有数据后选择角色·1
      this.chekedRoles()
    },
    //勾选角色
    chekedRoles(){
      this.$refs.dataTable.clearSelection()
      if(this.roleIds){
        //悬幻出所有查询到的每个角色数据，要进行判断父组件的roleIds中的每个角色对象
        this.list.forEach(item => {
          if(this.roleIds.indexOf(item.id) !== -1){
            this.$refs.dataTable.toggleRowSelection(item,true);
          }
        })
      }
    },
    //编辑
    async handleEdit(id){
      const {data} =  await api.getById(id)
      this.edit.formData = data
      this.edit.title = '修改'
      this.edit.visible = true
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
      this.page.size = 1
      this.fetchData()
    },
    //重置
    reload(){
      this.query = {}
      this.fetchData()
    },
    //新增
    openAdd(){
      this.edit.visible = true
      this.edit.title = '新增'
    },
    //关闭弹窗
    remoteClose(){
      this.edit.formData = {}
      this.edit.visible = false
      this.fetchData()
    },
    //分配权限
    handlePermission(id){
      this.per.roleId = id
      this.per.visible = true
    },
    //关闭分配权限弹窗
    remotePerClose(){
      this.per.visible = false
      this.per.roleId = null
      this.fetchData()
    },
    //收集被选中的角色
    handleSelectionChange(val){
      console.log(val);
      this.checkedRoleList = val
    },
    //点击设置角色按钮触发
    handleUserRole(){
      //存放
      const checkedRoleIds = []
      //获取每个元素在的角色id
      this.checkedRoleList.forEach(item => {
        checkedRoleIds.push(item.id)
      })
      //触发父组件的事件函数
      this.$emit('saveUserRole',checkedRoleIds)
    }
  },

  watch: {
    roleIds(){
      this.query = {}
      this.queryData()
    }
  }
}
</script>