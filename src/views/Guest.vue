<template>
  <el-card class="guest-container">
    <template #header>
      <div class="header">
        <el-form size="mini" inline v-model="queryForm" style="width: 100%; font-size: 12px">
          <el-form-item :label="`用户ID`">
            <el-input placeholder="用户ID"  v-model="queryForm.userId"  clearable/>
          </el-form-item>
          <el-form-item :label="`用户等级`">
            <el-select placeholder="用户等级" v-model="queryForm.userLevel" filterable clearable style="width: 120px" >
              <el-option  label="A"  value="1">A </el-option>
              <el-option  label="B"  value="2">B </el-option>
              <el-option  label="C"  value="3">C </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="`客户名称`">
            <el-input placeholder="客户名称" v-model="queryForm.userName" clearable/>
          </el-form-item>
          <el-form-item :label="`联系人名称`">
            <el-input placeholder="联系人名称" v-model="queryForm.contactName" clearable/>
          </el-form-item>
          <el-form-item :label="`联系电话`">
            <el-input placeholder="联系电话" v-model="queryForm.mobile" clearable/>
          </el-form-item>
          <el-button type="primary" size="small"  @click="getGuestList()">搜索</el-button>
          <el-button type="danger" size="small"  @click="dialogFormVisible = true">新增客户</el-button>
        </el-form>
      </div>
    </template>
    <el-table
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
          prop="userId"
          label="客户ID"
      >
      </el-table-column>
      <el-table-column
        prop="userName"
        label="客户名称"
      >
      </el-table-column>
      <el-table-column
          prop="userLevelStr"
          label="客户等级"
      >
      </el-table-column>
      <el-table-column
        prop="contactName"
        label="联系人"
      >
      </el-table-column>
      <el-table-column
          prop="mobile"
          label="联系电话"
      >
      </el-table-column>
      <el-table-column
          prop="address"
          label="联系地址"
      >
      </el-table-column>
      <el-table-column
          prop="remark"
          label="备注"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="注册时间"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="100"
      >
        <template #default="scope">
          <a style="margin-right: 10px" @click="updateGuestAlert(scope.row)">修改</a>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="deleteGuest(scope.row.userId)"
          >
            <template #reference>
              <a style="cursor: pointer">删除</a>
            </template>
          </el-popconfirm>
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


  <el-dialog title="新增/修改客户" v-model="dialogFormVisible">
    <el-form :model="form">
      <el-form-item :label="`客户名称`" >
        <el-input placeholder="客户名称" v-model="form.userName" style="width: 80%"></el-input>
      </el-form-item>

      <el-form-item :label="`用户等级`">
        <el-select placeholder="用户等级" v-model="form.userLevel" style="width: 80%" >
          <el-option  label="A"  :value="1">A </el-option>
          <el-option  label="B"  :value="2">B </el-option>
          <el-option  label="C"  :value="3">C </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="`联系人`" >
        <el-input placeholder="联系人" v-model="form.contactName" style="width: 80%"></el-input>
      </el-form-item>
      <el-form-item :label="`联系电话`" >
        <el-input placeholder="联系电话" v-model="form.mobile" style="width: 80%"></el-input>
      </el-form-item>
      <el-form-item :label="`联系地址`" >
        <el-input placeholder="联系地址" v-model="form.address" style="width: 80%"></el-input>
      </el-form-item>
      <el-form-item :label="`备注`" >
        <el-input placeholder="备注" v-model="form.remark" style="width: 80%"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" v-if="form.userId" @click="updateGuest()">修改</el-button>
        <el-button type="primary" v-else @click="addGuest()">新增</el-button>
    </span>
    </template>
  </el-dialog>

</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'
export default {
  name: 'Guest',
  data() {
    return {
      dialogFormVisible: false,
      form: {},
      queryForm: {
        userId:'',
        userLevel:'',
        userName:'',
        contactName:'',
        mobile:''
      },
      loading: false,
      tableData: [], // 数据列表
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10 // 分页大小
    }
  },
  methods: {
    // 获取轮播图列表
    getGuestList() {
      this.loading = true
      axios.get('/users', {
        params: {
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
          userId:this.queryForm.userId,
          userLevel:this.queryForm.userLevel,
          userName:this.queryForm.userName,
          contactName:this.queryForm.contactName,
          mobile:this.queryForm.mobile
        }
      }).then(res => {
        this.tableData = res.list
        this.total = res.totalCount
        this.currentPage = res.currPage
        this.loading = false
      })
    },
    updateGuestAlert(data) {
      this.dialogFormVisible = true
      this.form = data;
    },
    addGuest(){
      axios.post(`/user/add`, this.form).then(() => {
        ElMessage.success('新增成功')
        this.form = {}
        this.dialogFormVisible = false
        this.getGuestList()
      })
    },
    updateGuest(){
      axios.post(`/user/update`,  this.form).then(() => {
        ElMessage.success('修改成功')
        this.form = {}
        this.dialogFormVisible = false
        this.getGuestList()
      })
    },
    deleteGuest(userId){
      axios.get(`/users/status`,{ params: {
        userId:userId,
        status:1}
      }).then(() => {
        ElMessage.success('删除成功')
        this.getGuestList()
      })
    },
    // 选择项
    changePage(val) {
      this.currentPage = val
      this.getGuestList()
    },
  },
  created(){
    this.getGuestList()
  },
}
</script>

<style scoped>
  .guest-container {
    min-height: 100%;
  }
  .el-card.is-always-shadow {
    min-height: 100%!important;
  }
</style>