<template>
  <el-card class="good-container">
    <template #header>
      <div class="header">
        <el-form size="mini" inline v-model="queryForm" style="width: 100%; font-size: 12px">
          <el-form-item :label="`商品名称`">
            <el-input placeholder="商品名称"  v-model="queryForm.goodsName"  clearable/>
          </el-form-item>
          <el-form-item :label="`上架状态`">
            <el-select placeholder="上架状态" v-model="queryForm.goodsSellStatus" filterable clearable style="width: 120px" >
              <el-option  label="销售中"  value="0">销售中</el-option>
              <el-option  label="下架"  value="1">下架 </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="`标签`">
            <el-input placeholder="标签" v-model="queryForm.tag" clearable/>
          </el-form-item>
          <el-button type="primary" size="small"  @click="getGoodList()">搜索</el-button>
          <el-button type="danger" size="small"  @click="handleAdd">新增商品</el-button>
        </el-form>
      </div>
    </template>
    <el-table
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%" >

      <el-table-column
        prop="goodsId"
        label="产品编号"
      >
      </el-table-column>
      <el-table-column
        prop="goodsName"
        label="产品名称"
      >
      </el-table-column>
      <el-table-column
        label="规格型号"
      >
        <template #default="scope">
          <span style="color: green">球镜：{{scope.row.sphereMin}} 至 {{scope.row.sphereMax}}</span>
          <br/>
          <span style="color: red">柱镜：{{scope.row.cylinderMin}} 至 {{scope.row.cylinderMax}} </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="stockNum"
        label="商品库存"
      >
      </el-table-column>
      <el-table-column
        prop="originalPrice"
        label="标批价格"
      >
      </el-table-column>
      <el-table-column
          prop="remark"
          label="备注"
      >
      </el-table-column>
      <el-table-column
          prop="tag"
          label="标签"
      >
      </el-table-column>
      <el-table-column
        label="上架状态"
      >
        <template #default="scope">
          <span style="color: green;" v-if="scope.row.goodsSellStatus == 0">销售中</span>
          <span style="color: red;" v-else>已下架</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="100"
      >
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.goodsId)">修改</a>
          <a style="cursor: pointer; margin-right: 10px" v-if="scope.row.goodsSellStatus == 0" @click="handleStatus(scope.row.goodsId, 1)">下架</a>
          <a style="cursor: pointer; margin-right: 10px" v-else @click="handleStatus(scope.row.goodsId, 0)">上架</a>
        </template>
      </el-table-column>
    </el-table>
    <!--总数超过一页，再展示分页器-->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePage"
    />
  </el-card>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import router from "../router";
export default {
  name: 'Good',
  data() {
    return {
      queryForm:{
        goodsName:'',
        goodsSellStatus:'',
        tag:''
      },
      loading: false,
      tableData: [], // 数据列表
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10 // 分页大小
    }
  },
  methods: {
    getGoodList(){
      this.loading = true
      axios.get('/goods/list', {
        params: {
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
          goodsName:this.queryForm.goodsName,
          tag:this.queryForm.tag,
          goodsSellStatus:this.queryForm.goodsSellStatus
        }
      }).then(res => {
        this.tableData = res.list
        this.total = res.totalCount
        this.currentPage = res.currPage
        this.loading = false
      })
    },
    handleAdd(){
      router.push({ path: '/add' })
    },
    handleEdit(id){
      router.push({ path: '/add', query: { id } })
    },
    changePage(val){
      this.currentPage = val
      this.getGoodList()
    },
    handleStatus(id, status){
      axios.put(`/goods/status/${status}`, {
        ids: id ? [id] : []
      }).then(() => {
        ElMessage.success('修改成功')
        this.getGoodList()
      })
    }
  },
  created() {
    this.getGoodList()
  },
}
</script>

<style scoped>
  .good-container {
    min-height: 100%;
  }
  .el-card.is-always-shadow {
    min-height: 100%!important;
  }
</style>