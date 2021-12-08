<template>
  <el-dialog :title="title" :visible.sync="visible" width="20%" :before-close="handleClose">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="100px">
      <el-form-item label="分类名称：" prop="name" label-position="right" style="width: 400px" status-icon>
        <el-input v-model.trim="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input-number v-model="formData.sort" :min="1" :max="1000" style="width: 300px"></el-input-number>
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
import api from '@/api/category'
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
          {required: true,message: '请输入分类名称',trigger: 'blur'}
        ],
        status: [
          {required: true,message: '请选择状态',trigger: 'change'}
        ],
        sort: [
          {required: true,message: '请输入排序号',trigger: 'blur'}
        ]
      }
    }
  },

  methods: {
    //关闭窗口
    handleClose () {
      this.$refs['formData'].resetFields()
      //触发父组件的remoteClose方法来关闭，子组件不能使用this.visible = false 应为他是父组件的元素
      this.remoteClose()
    },
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