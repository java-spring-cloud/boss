<template>
  <div class="app-container">

     <!-- 条件查询 -->
    <el-form :inline="true" :model="query" size="mini">
      <el-form-item label="文章标题:">
        <el-input v-model.trim="query.name"></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="query.region" clearable>
          <el-option label="未审核" :value="1"></el-option>
          <el-option label="审核通过" :value="2"></el-option>
          <el-option label="审核未通过" :value="3"></el-option>
          <el-option label="已删除" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="queryData()" v-preventReClick>查询</el-button>
        <el-button icon="el-icon-refresh" @click="reload()" v-preventReClick>重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" stripe border style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="60">
      </el-table-column>
      <el-table-column align="center" prop="title" label="文章标题">
      </el-table-column>
      <el-table-column align="center" prop="viewCount" label="浏览数">
      </el-table-column>
      <el-table-column align="center" prop="thumhup" label="点赞数">
      </el-table-column>
      <el-table-column align="center" prop="ispublic" label="是否公开">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.ispublic === 0" type="danger">不公开</el-tag>
          <el-tag v-if="scope.row.ispublic === 1" type="warning">公开</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="danger">已删除</el-tag>
          <el-tag v-if="scope.row.status === 1" >未审核</el-tag>
          <el-tag v-if="scope.row.status === 2" type="success">审核通过</el-tag>
          <el-tag v-if="scope.row.status === 3" type="warning">审核未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updateDate" label="最后更新时间">
        <template slot-scope="scope">
          {{getFormat(scope.row.updateDate)}}
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="openView(scope.row.id)" size="small">查看</el-button>
          <el-button v-if="scope.row.status === 1" type="success" @click="openAudit(scope.row.id)" size="small">审核</el-button>
          <el-button v-if="scope.row.status !== 0" type="danger" @click="handleDelete(scope.row.id)" size="small" v-preventReClick>删除</el-button>
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

    <audit :title="audit.title" :visible="audit.visible" :remoteClose="remoteClose" :id="audit.id" :isAudit="audit.isAudit" />

  </div>
</template>
<script>
import api from '@/api/article'
//格式化日期
import {format} from '@/utils/date'

import Audit from './audit.vue'

export default {
  name: 'Article',
  components: {Audit},
  data(){
    return {
      list: [],
      page: {
        current: 1,
        size: 20,
        total: 0
      },
      query: {}, //查询条件
      audit: {
        title: '',
        visible: false,
        id: null,//文章id
        isAudit: true //是否打开为审核页面，true是审核，false查看
      }
    }
  },
  created(){
    this.fetchData();
  },

  methods: { 
    //分页查询数据列表
    async fetchData(){
        await api.getList(this.query,this.page.current,this.page.size).then(response => {
          this.list = response.data.records
          this.page.total = response.data.total
        })
    },
    getFormat(date){
      return format(date)
    },
    //当每页显示多少条改变多少条触发
    handleSizeChange(val){
      this.page.size = val
      this.fetchData()
    },
    //切换页码初稿发
    handleCurrentChange(val){
      this.page.current = val
      this.fetchData()
    },
    //条件查询
    queryData(){
      this.page.current = 1
      this.fetchData()
    },
    //刷新重置
    reload(){
      this.query = {}
      this.fetchData()
    },
    openAudit(id){
      this.audit.id = id
      //标识为审核时间
      this.audit.isAudit = true
      this.audit.title = '审核文章'
      this.audit.visible = true
    },
    remoteClose(){
      this.audit.visible = !this.audit.visible
      this.fetchData()
    },
    //查看详情页
    openView(id){
      this.audit.id = id
      //标识为查看详情页
      this.audit.isAudit = false
      this.audit.title = '文章详情'
      this.audit.visible = true
    },
    //删除文章
    handleDelete(id){
      this.$confirm('确定删除本篇文章吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.deleteById(this.id).then(response => {
            if(response.code === 20000){
              this.$message({
                type: 'success',
                message: response.message
              });
            }
            //刷新数据
            this.fetchData()
        })
        }).catch(() => {
          //取消删除不用理会
        });
    }
  }

}
</script>