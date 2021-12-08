<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="20%"
    :before-close="handleClose"
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="100px"
    >
      <el-form-item
        label="类型"
        prop="type"
        label-position="right"
        style="width: 400px"
        status-icon
      >
        <el-radio-group v-model="formData.type">
          <el-radio :label="1">目录</el-radio>
          <el-radio :label="2">菜单</el-radio>
          <el-radio :label="3" v-if="formData.parentId !== 0">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限标识：" prop="code">
        <el-input v-model="formData.code"></el-input>
      </el-form-item>
      <el-form-item label="请求地址：" prop="url" v-if="formData.type !== 3">
        <el-input v-model="formData.url"></el-input>
      </el-form-item>
      <el-form-item label="图标：" prop="icon" v-if="formData.type !== 3">
        <el-input v-model="formData.icon"></el-input>
      </el-form-item>
      <el-form-item label="排序:" prop="sort">
        <el-input-number
          v-model="formData.sort"
          :min="1"
          :max="1000"
          style="width: 300px"
        ></el-input-number>
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
import api from '@/api/menu'
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

  data () {
    return {
      rules: {
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入权限标识', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {

    handleClose () {
      this.$refs['formData'].resetFields()
      this.remoteClose()
    },
    //提交表单数据
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //校验通过，提交表单数据
          // 判断类型是否为按钮，按钮则不提交，请求地址，图标，将两个属性设为之为空
          if (this.formData.type === 3) {
            this.formData.url = ''
            this.formData.icon = ''
          }
          this.submitData()
        } else {
          return false
        }
      })
    },

    async submitData () {
      let response = null
      if(this.formData.id){
        response = await api.update(this.formData)
      }else{
        response = await api.add(this.formData)
      }
      if (response.code === 20000) {
        //提交成功
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.handleClose()
      } else {
        this.$message({
          message: '保存失败',
          type: 'error'
        })
      }
    }
  }
}
</script>