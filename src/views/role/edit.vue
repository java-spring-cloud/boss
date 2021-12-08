<template>
  <el-dialog :title="title" :visible.sync="visible" width="20%" :before-close="handleClose">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="100px">
      <el-form-item label="角色名称：" prop="name" label-position="right" style="width: 400px" status-icon>
        <el-input v-model.trim="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="备注：" style="width: 400px" prop="remark">
        <el-input type="textarea" v-model="formData.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')" v-preventReClick>确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import api from '@/api/role'
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
        name: [
          {required: true,message: '请输入角色',trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    //提交表单数据
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitData()
          } else {
            console.log('error submit!!');
            return false;
          }
      });
    },
    //提交
    async submitData(){
      let response = null
      if(this.formData.id){
        //编辑
        response = await api.update(this.formData)
      }else{
        //新增
        response = await api.add(this.formData)
      }
      if(response.code === 20000){
        this.$message({
          type: 'success',
          message: response.message
        })
        this.remoteClose()
      }else{
        this.$message({
          type: 'error',
          message: '保存失败'
        })
      }
    },
    //关闭窗口
    handleClose () {
      this.$refs['formData'].resetFields()
      //触发父组件的remoteClose方法来关闭，子组件不能使用this.visible = false 应为他是父组件的元素
      this.remoteClose()
    },
  }
}
</script>