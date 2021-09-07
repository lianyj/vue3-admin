<template>
  <el-card class="order-container">
    <template #header>
      <div class="header">
        <el-form size="mini" inline v-model="queryForm" style="width: 100%; font-size: 12px">
          <el-form-item label="订单日期">
            <el-date-picker
                v-model="queryForm.dateTime"
                type="daterange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="`订单号`">
            <el-input placeholder="订单号"  v-model="queryForm.orderNo"  clearable/>
          </el-form-item>
          <el-form-item :label="`订单状态`">
            <el-select placeholder="订单状态" v-model="queryForm.orderStatus" filterable clearable style="width: 120px" >
              <el-option  label="待支付" value="1">待支付</el-option>
              <el-option  label="已支付"  value="2">已支付</el-option>
              <el-option  label="已关闭"  value="3">已关闭</el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="`快递状态`">
            <el-select placeholder="快递状态" v-model="queryForm.expressStatus" filterable clearable style="width: 120px" >
              <el-option  label="未寄出" value="1">未寄出</el-option>
              <el-option  label="已寄出"  value="2">已寄出</el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="`客户ID`">
            <el-input placeholder="客户ID" v-model="queryForm.userId" clearable/>
          </el-form-item>
          <el-button type="primary" size="small"  @click="getOrderList">搜索</el-button>
          <el-button type="danger" size="small"  @click="this.dialogFormVisible = true">新增商品</el-button>
          <el-button type="warning" size="small"  @click="orderExport">导出</el-button>
        </el-form>
      </div>
    </template>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
     >
      <el-table-column
        prop="orderNo"
        label="订单号"
      >
      </el-table-column>
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
          prop="contactName"
          label="联系人"
      >
      </el-table-column>
      <el-table-column
          prop="userLevelStr"
          label="客户等级"
      >
      </el-table-column>
      <el-table-column
        prop="totalPrice"
        label="订单总价"
      >
      </el-table-column>
      <el-table-column
        prop="orderStatusStr"
        label="订单状态"
      >
      </el-table-column>
      <el-table-column
        prop="expressStatusStr"
        label="快递状态"
      >
      </el-table-column>
      <el-table-column
        prop="orderDate"
        label="订单时间"
      >
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template #default="scope">
          <router-link :to="{ path: '/order_detail', query: { id: scope.row.orderId }}">订单详情</router-link>
        <br/>
          <el-popconfirm
            v-if="scope.row.orderStatus === 1"
            title="确定支付成功吗？"
            @confirm="changeOrderStatus(scope.row.orderId,2)"
          >
            <template #reference>
              <a style="cursor: pointer; margin-right: 10px;color: red">支付成功</a>
            </template>
          </el-popconfirm>

          <el-popconfirm
              v-if="scope.row.orderStatus === 2"
              title="确定还未支付吗？"
              @confirm="changeOrderStatus(scope.row.orderId,1)"
          >
            <template #reference>
              <a style="cursor: pointer; margin-right: 10px;color: green">还未支付</a>
            </template>
          </el-popconfirm>
          <br/>
          <el-popconfirm
            v-if="scope.row.expressStatus === 1"
            title="确定快递已寄吗？"
            @confirm="changeExpressStatus(scope.row.orderId,2)"
          >
            <template #reference>
              <a style="cursor: pointer; margin-right: 10px;color: red">快递已寄</a>
            </template>
          </el-popconfirm>
          <el-popconfirm
              v-if="scope.row.expressStatus === 2 && scope.row.orderStatus !== 3"
              title="确定快递未寄吗？"
              @confirm="changeExpressStatus(scope.row.orderId,1)"
          >
            <template #reference>
              <a style="cursor: pointer; margin-right: 10px ; color: green">快递未寄</a>
            </template>
          </el-popconfirm>
          <br/>
          <el-popconfirm
            v-if="(scope.row.orderStatus === 2 && scope.row.expressStatus === 2)"
            title="确定关闭订单吗？"
            @confirm="handleClose(scope.row.orderId)"
          >
            <template #reference>
              <a style="cursor: pointer; margin-right: 10px">关闭订单</a>
            </template>
          </el-popconfirm>
          <br/>
          <el-popconfirm
              title="确定删除订单吗？"
              @confirm="deleteOrder(scope.row.orderId)"
          >
            <template #reference>
              <a style="cursor: pointer; margin-right: 10px">删除订单</a>
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

  <el-dialog title="新增订单" v-model="dialogFormVisible">
    <el-form :model="form">
      <el-form-item :label="`选择用户`">
        <el-select placeholder="选择用户" v-model="form.userId" filterable clearable  style="width: 50%" >
          <el-option v-for="val in userList " :key="val.userId" :label="val.userName+'-'+val.contactName+'-'+val.userLevelStr" :value="val.userId">{{val.userName}}-{{val.contactName}}-{{val.userLevelStr}}</el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="`客户名称`" >
        <label> {{form.userName}} </label>
      </el-form-item>
      <el-form-item :label="`联系人`" >
        <label> {{form.contactName}} </label>
      </el-form-item>
      <el-form-item :label="`联系电话`" >
        <label> {{form.mobile}} </label>
      </el-form-item>
      <el-form-item :label="`联系地址`" >
        <label> {{form.address}} </label>
      </el-form-item>

      <el-form-item :label="`订单日期`">
        <el-date-picker
            v-model="form.orderDate"
            clearable
            style="width: 50%"
            type="date"
            placeholder="选择日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item :label="`快递费用`" >
        <el-input placeholder="快递费用" v-model="form.expressFee" clearable style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item :label="`支付方式`" >
        <el-select placeholder="支付方式" v-model="form.payType" filterable clearable style="width: 50%" >
          <el-option  label="现结" value="X">现结 </el-option>
          <el-option  label="月结" value="Y">月结 </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="`订单状态`" >
          <el-select placeholder="订单状态" v-model="form.orderStatus" filterable clearable style="width: 50%" >
            <el-option  label="待支付" value="1">待支付</el-option>
            <el-option  label="已支付" value="2">已支付</el-option>
            <el-option  label="已关闭" value="3">已关闭</el-option>
          </el-select>
      </el-form-item>
      <el-form-item :label="`快递状态`" >
        <el-select placeholder="快递状态" v-model="form.expressStatus" filterable clearable style="width: 50%" >
            <el-option  label="未寄出" value="1">未寄出</el-option>
            <el-option  label="已寄出"  value="2">已寄出</el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="`备注`" >
        <el-input placeholder="备注" v-model="form.remark" filterable clearable style="width: 50%"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="addOrder()">新增</el-button>
    </span>
    </template>
  </el-dialog>

</template>

<script>
import { ElMessage } from 'element-plus'
import qs from "qs";
import axios from '@/utils/axios'
import { serverHost } from '@/utils'
export default {
  name: 'Order',
  data() {
    return {
      form:{
        userId:'',
        userName:'',
        contactName:'',
        mobile:'',
        address:'',
        expressFee:'',
        expressStatus:'',
        orderStatus:'',
        orderDate:'',
        payType:'',
        remark:'',
      },
      userList:[],
      dialogFormVisible:false,
      queryForm: {
        dateTime: null,
        startTime: null,
        endTime: null,
        userId: null,
        expressStatus: null,
        orderNo: null,
        orderStatus: null
      },
      loading: false,
      tableData: [], // 数据列表
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 分页大小
      orderNo: '', // 订单号
      orderStatus: '', // 订单状态
    }
  },
  methods:{
    getAllUser(){
      axios.get('/user/allList').then(res => {
        this.userList = res
      })
    },
    deleteOrder(orderId){
      axios.get('/order/delete/'+ orderId).then(() => {
        ElMessage.success('删除成功')
        this.getOrderList()
      })
    },
    getOrderList(){
      this.loading = true
      let params = {
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
          userId:this.queryForm.userId,
          expressStatus:this.queryForm.expressStatus,
          orderNo: this.queryForm.orderNo,
          orderStatus: this.queryForm.orderStatus
      }
     if(this.queryForm.dateTime){
       params.startTime=this.queryForm.dateTime[0]
       params.endTime=this.queryForm.dateTime[1]
     }
      axios.get('/orders', {
        params: params
      }).then(res => {
        this.tableData = res.list
        this.total = res.totalCount
        this.currentPage = res.currPage
        this.loading = false
      })
    },
    addOrder(){
      axios.post('/order/save', this.form).then(() => {
        ElMessage.success('新增成功')
        this.form = ''
        this.dialogFormVisible = false
        this.getOrderList()
      })
    },
    orderExport(){
      window.location.href = serverHost + '/manage-api/v1/orders/export?' + qs.stringify(this.queryForm, { arrayFormat: 'repeat' });
    },
    changePage(val){
      this.currentPage = val
      this.getOrderList()
    },
    changeOrderStatus(orderId,orderStatus) {
      let form = {
        orderId: orderId,
        orderStatus:orderStatus
      }
      axios.get('/orders/status/change?'+qs.stringify(form) ).then(() => {
        ElMessage.success('修改订单状态成功')
        this.getOrderList()
      })
    },
    changeExpressStatus(orderId,expressStatus){
      let form = {
        orderId: orderId,
        expressStatus:expressStatus
      }
      axios.get('/orders/express/change?'+qs.stringify(form)).then(() => {
        ElMessage.success('修改快递状态成功')
        this.getOrderList()
      })
    },
    handleClose(orderId){
      axios.get('/orders/close?orderId='+orderId).then(() => {
        ElMessage.success('关闭成功')
        this.getOrderList()
      })
    }
  },
  watch: {
    "form.userId": {
      handler(newVal, oldVal) {
        for (const user in this.userList) {
          if (this.userList[user].userId === newVal) {
            this.form.userName = this.userList[user].userName;
            this.form.contactName = this.userList[user].contactName;
            this.form.mobile = this.userList[user].mobile;
            this.form.address = this.userList[user].address;
            break;
          }
        }
      }
    },
  },
  created() {
    this.getOrderList()
    this.getAllUser()
  }
}
</script>

<style scoped>
  .order-container {
    min-height: 100%;
  }
  .el-card.is-always-shadow {
    min-height: 100%!important;
  }
</style>