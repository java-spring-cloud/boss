<template>
  <el-dialog :title="title" :visible.sync="visible" width="20%" :before-close="handleClose">
    <el-form :model="formData" :rules="rules"  ref="formData" label-width="100px">
      <el-form-item label="新密码：" prop="newPassword" label-position="right" style="width: 400px" status-icon>
        <el-input type="password" v-model.trim="formData.newPassword" maxlength="20" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="repPassword" label-position="right" style="width: 400px" status-icon>
        <el-input type="password" v-model.trim="formData.repPassword" maxlength="20" placeholder="请输入确认密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import * as api from '@/api/user'
export default {
  props: {
    userId: null,//用户id
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    remoteClose: Function
  },

  data(){
    var validateRepPassword = (rule,value,callback) => {
      if(value !== this.formData.newPassword){
        callback(new Error('两次密码输入的不一致！'))
      }else{
        callback()
      }
    };
    return {
      formData: {},
      rules: {
        newPassword: [
          {required: true,message: '新密码不能为空',trigger: 'blur'},
          {min: 6,max: 30,message: '长度在6到20个字符',trigger: 'blur'},
        ],
        repPassword: [
          {required: true,message: '确认密码不能为空',trigger: 'blur'},
          {validator: validateRepPassword,trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.formData.userId = this.userId
            api.updatePassword(this.formData).then(response => {
              if(response.code === 20000){
                this.$message({
                  message: response.message,
                  type: 'success'
                })
                this.handleClose()
              }else{
                this.$message({
                  message: '保存失败',
                  type: 'error'
                })
              }
            })
          } else {
            return false;
          }
      });
    },
    handleClose(){
      this.$refs['formData'].resetFields()
      this.remoteClose()
    }
  }
}
</script>