<template>
  <el-dialog :title="title" :visible.sync="visible" width="900px" :before-close="handleClose">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" label-position="right" style="width: 400px">
      <el-form-item label="广告图片" status-icon prop="imageUrl">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :http-request="uploadMainImg"
          :before-upload="beforeAvatarUpload"
          >
          <img v-if="formData.imageUrl" :src="formData.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="广告标题：" prop="title">
        <el-input v-model="formData.title"></el-input>
      </el-form-item>
      <el-form-item label="广告链接：" prop="advertUrl">
        <el-input v-model="formData.advertUrl"></el-input>
      </el-form-item>
      <el-form-item label="跳转方式：" prop="advertTarget">
        <el-select v-model="formData.advertTarget" clearable style="width: 185px">
          <el-option label="新窗口打开" value="_blank"/>
          <el-option label="当前窗口打开" value="_self"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="广告位置:" prop="position">
        <el-input-number v-model="formData.position" :min="1" :max="1000" style="width: 300px"></el-input-number>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input-number v-model="formData.sort" :min="1" :max="1000" style="width: 300px"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')" v-preventReClick>确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import commonApi from '@/api/common'
import api from '@/api/advert'
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
    oldImageUrl: String, //编辑室，查询出来的那张图片
  },

  data(){
    return {
      rules: {
        imageUrl: [
          {required: true,message: '请上传广告图片',trigger: 'blur'}
        ],
        title: [
          {required: true,message: '请输入广告标题',trigger: 'blur'}
        ],
        advertUrl: [
          {required: true,message: '请输入广告链接',trigger: 'blur'}
        ],
        advertTarget: [
          {required: true,message: '请输入广告链接',trigger: 'change'}
        ],
        status: [
          {required: true,message: '请选择状态',trigger: 'change'}
        ],
        position: [
          {required: true,message: '请选择广告位置',trigger: 'blur'}
        ],
        sort: [
          {required: true,message: '请输入排序号',trigger: 'change'}
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
        if(valid){
          this.submitData()
        }else{
          return false
        }
      })
    },
    async submitData(){
      let response = null
      if(this.formData.id){
        response = await api.update(this.formData);
      }else{
        //新增
        response = await api.add(this.formData);
      }
      if(response.code === 20000){
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.handleClose()
      }else{
        this.$message({
          message: '保存成功',
          type: 'error'
        })
      }
    },
    //上传图片
    uploadMainImg(file){
      const data = new FormData()
      data.append('file',file.file)
      commonApi.uploadImg(data).then(response => {
        //将之前的删除
        this.deleteImg()
        //回显图片
        this.formData.imageUrl = response.data
      }).catch(error => {
        this.$message.error('上传失败')
      })
    },
    //删除图片
    deleteImg(){
     if(this.formData.imageUrl && this.formData.imageUrl !== this.oldImageUrl){
       //发送请求删除
       commonApi.deleteImg(this.formData.imageUrl)
     } 
    },
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>