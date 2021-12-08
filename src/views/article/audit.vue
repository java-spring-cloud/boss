<template>
  <div class="app-container">
    <el-dialog :title="title" :visible.sync="visible" width="90%" :before-close="handleClose">
      <!-- 条件查询 -->
    <el-form ref="formData" :model="formData" label-width="100px" label-position="right">
      <el-form-item label="标题:" >
        <el-input v-model.trim="formData.title" readonly></el-input>
      </el-form-item>
      <el-form-item label="标签:">
        <el-cascader :options="labelOptions" v-model="formData.labelIds" :props="{multiple: true,emitPath: false,children: 'labelList',value: 'id',label: 'name'}" clearable style="display: block;" disabled></el-cascader>
      </el-form-item>
      <el-form-item label="主图:">
        <img :src="formData.imageUrl" style="width: 178px;height: 178px;display:block;">
      </el-form-item>
      <el-form-item label="是否公开:" >
        <el-radio-group v-model="formData.ispublic" disabled>
          <el-radio :label="1">公开</el-radio>
          <el-radio :label="0">不公开</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="简介:">
        <el-input type="textarea" v-model="formData.summary" readonly></el-input>
      </el-form-item>
      <el-form-item label="内容:">
        <mavonEditor v-model="formData.mdContent" :editable="false" />
      </el-form-item>
      <el-form-item align="center" v-if="isAudit">
        <el-button type="primary" @click="auditSuccess()" v-preventReClick>审核通过</el-button>
        <el-button type="danger" @click="auditFail()" v-preventReClick>审核不通过</el-button>
      </el-form-item>
    </el-form>
    </el-dialog>
  </div>
</template>

<script>

import api from '@/api/article'
import categoryApi from '@/api/category'
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  //注册为子组件
  components: {mavonEditor},
   props: {
     id: null,//文章id
     isAudit: true,//是否为审核页面
    title: { //弹窗的标题
      type: String,
      default: ''
    },
    visible: { //弹出框 true弹出
      type: Boolean,
      default: false
    },
    remoteClose: Function, //用于关闭窗口
  },

  data(){
    return {
      formData: {},
      labelOptions: [] //渲染分类标签级联下拉框的
    }
  },

  watch: {//监听
    visible(val){ //监听visible的变化，将改变的值作为参数传入
      if(val){
        this.getLabelOptions()
        // val为true，则打开窗口，打开之后查询文章详情
        this.getArticleById()
      }
    }
  },

  methods: {
    //关闭窗口
    handleClose(){
      // this.$refs['formData'].resetFields() 
      this.remoteClose()
    },
    //审核通过触发
    auditSuccess(){
      this.$confirm('确定审核通过吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.auditSuccess(this.id).then(response => {
            if(response.code === 20000){
              this.$message({
                type: 'success',
                message: '审核通过!'
              });
            }
        })
        this.remoteClose()
        }).catch(() => {
          //取消删除不用理会
        });
    },
    //审核不通过触发
    auditFail(){
      this.$confirm('确定审核不通过吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.auditFail(this.id).then(response => {
            if(response.code === 20000){
              this.$message({
                type: 'success',
                message: '审核不通过!'
              });
            }
        })
        this.remoteClose()
        }).catch(() => {
          //取消删除不用理会
        });
    },
    //查询文章详情
    async getArticleById(){
      const {data} = await api.getById(this.id)
      this.formData = data
    },
    async getLabelOptions(){
      const {data} = await categoryApi.getCategoryAndLabel()
      this.labelOptions = data
      // console.log('this.labelOptions'+this.labelOptions);

    }
  }
}
</script>