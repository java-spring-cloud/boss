<template>
  <el-dialog :title="title" :visible.sync="visible" width="20%" :before-close="handleClose">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="100px">
      <el-form-item label="用户名：" prop="username" label-position="right" style="width: 400px" status-icon>
        <el-input v-model.trim="formData.username" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="昵称：" prop="nickName" label-position="right" style="width: 400px" status-icon>
        <el-input v-model.trim="formData.nickName" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="mobile" label-position="right" style="width: 400px" status-icon>
        <el-input v-model.trim="formData.mobile" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="邮箱地址：" prop="email" label-position="right" style="width: 400px" status-icon>
        <el-input v-model.trim="formData.email" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="账号过期：" prop="isAccountNonExpired">
        <el-radio-group v-model="formData.isAccountNonExpired">
          <el-radio :label="0" border>正常</el-radio>
          <el-radio :label="1" border>禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="密码过期：" prop="isCredentialsNonExpired">
        <el-radio-group v-model="formData.isCredentialsNonExpired">
          <el-radio :label="0" border>正常</el-radio>
          <el-radio :label="1" border>禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否锁定：" prop="isAccountNonLocked">
        <el-radio-group v-model="formData.isAccountNonLocked">
          <el-radio :label="0" border>未锁定</el-radio>
          <el-radio :label="1" border>已锁定</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')" v-preventReClick>确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import * as api from '@/api/user'
export default {
  props: {
    title: { //弹窗的标题
      type: String,
      default: ''
    },
    visible: { //弹出框 true弹出
      type: Boolean,
      default: false
    },
    formData: { //提交表单数据
      type: Object,
      default: {}
    },
    remoteClose: Function, //用于关闭窗口
  },

  data(){
    return {
      rules: {
        username: [
          {required: true,message: '请输入用户名',trigger: 'blur'},
          {min: 6,max: 20,message: '长度在6到20个字符',trigger: 'blur'}
        ],
        nickName: [
          {required: true,message: '请输入昵称',trigger: 'blur'},
        ],
        mobile: [
          {required: true,message: '请输入手机号',trigger: 'blur'},
        ],
        isAccountNonExpired: [
          {required: true,message: '请选择',trigger: 'change'},
        ],
        isCredentialsNonExpired: [
          {required: true,message: '请选择',trigger: 'change'},
        ],
        isAccountNonLocked: [
          {required: true,message: '请选择',trigger: 'change'},
        ]
      }
    }
  },

  methods: {
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitData()
            console.log("123");
          } else {
            console.log('error submit!!');
            return false;
          }
      });
    },
    async submitData(){
      let response = null
      if(this.formData.id){
        //编辑
        response = await api.update(this.formData)
      }else{
        //新增
        this.formData.password = this.formData.username
        response = await api.add(this.formData)
      }
      //将用户名与密码一致
      
      if(response.code === 20000){
        this.$message({
          type: 'success',
          message: response.message
        })
        this.handleClose()
      }else{
        this.$message({
          type: 'error',
          message: response.message
        })
      }
    },
    handleClose(){
      this.$refs['formData'].resetFields();
      this.remoteClose()
    }
  }
}
</script>