<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="20%"
    :before-close="handleClose"
  >
    <el-form ref="formData" label-width="80px" v-loading="loading">
      <el-tree
      ref="tree"
        :data="menuList"
        show-checkbox
        node-key="id"
        :props="{children: 'children',label: 'name'}"
        accordion
        :default-checked-keys="menuIds"
      >
      </el-tree>

      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')" size="mini" v-preventReClick>确定</el-button>
        <el-button @click="handleClose()" size="mini">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import menuApi from '@/api/menu'
import roleApi from '@/api/role'
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      },
      remoteClose: Function,
      roleId: null
    },
    data() {
      return {
        menuList: [],//存储所有菜单
        loading: false,
        menuIds: [] //默认选种的菜单ids
      };
    },
    watch: {
      visible(val){
        if(val){
          this.getMenuList()
        }
      }
    },
    methods: {
      //获取所有菜单
      getMenuList(){
        this.loading = true
        menuApi.getList({}).then(response => {
          console.log(response.data);
          this.menuList = response.data
          //查询角色之前所拥有的菜单ids，然后进行回显
          this.getMednuIdsByRoleId()
        })
        this.loading = false
      },
      async getMednuIdsByRoleId(){
        const {data} = await roleApi.getMenuIdsByRoleId(this.roleId)
        this.menuIds = data
      },
      submitForm(){
        const cneckedMenuIds = this.$refs.tree.getCheckedKeys()
        //调用保存角色权限菜单接口
        roleApi.saveRoleMenu(this.roleId,cneckedMenuIds).then(response => {
          if(response.code === 20000){
            this.$message({message: '分配权限成功',type: 'success'})
            this.handleClose()
          }else{
            this.$message({message: '分配权限失败',type: 'error'})
          }
        })
      },
      //取消
      handleClose(){
        this.menuList = []
        this.menuIds = []
        this.remoteClose()
      }
    }
  };
</script>