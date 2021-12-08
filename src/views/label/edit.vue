<template>
  <el-dialog :title="title" :visible.sync="visible" width="20%" :before-close="handleClose">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="100px">
      <el-form-item label="分类名称：" prop="name" label-position="right" style="width: 400px" status-icon>
        <el-input v-model.trim="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="分类名称：" prop="categoryId">
        <el-select v-model="formData.categoryId" clearable filterable>
          <el-option v-for="item in categoryList" :key="item.code" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')" v-preventReClick>确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import api from '@/api/label'
export default {

  data(){
    return {
      rules: {
        name: [
          {required: true,message: '请输入标签名称',trigger: 'blur'}
        ],
        categoryId: [
          {required: true,message: '请选择分类名称',trigger: 'change'}
        ]
      }
    }
  },

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
    categoryList: {
      type: Array,
      default: []
    },
    remoteClose: Function, //用于关闭窗口
  },

  methods: {
    handleClose(){
      this.$refs['formData'].resetFields()
      this.remoteClose()
    },
    //提交表单数据
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if(valid){
          this.submitData()
        }else{
          return false
        }
      })
    },
    //调用接口提交数据
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
            message: '保存成功',
            type: 'success'
          })
          this.handleClose()
        }else{
          this.$message({
            message: '保存失败',
            type: 'error'
          })
        }
    }
  }
}
</script>