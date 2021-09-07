<template>
  <el-card class="order-container">
      <el-form :model="form">

            <div style="float: left">
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
            </div>

          <div style="margin-left: 10%">
              <el-form-item :label="`订单ID`" >
                <label> {{form.orderId}} </label>
              </el-form-item>
              <el-form-item :label="`订单编号`" >
                <label> {{form.orderNo}} </label>
              </el-form-item>
              <el-form-item :label="`订单日期`">
                <label> {{form.orderDate}} </label>
              </el-form-item>
              <el-form-item :label="`快递费用`" >
                <el-input placeholder="快递费用" v-model="form.expressFee" clearable style="width: 50%"></el-input>
              </el-form-item>
              <el-form-item :label="`备注`" >
                <el-input placeholder="备注" v-model="form.remark" filterable clearable style="width: 50%"></el-input>
              </el-form-item>
          </div>

        <el-button size="mini" type="primary" @click="updateOrder">立即修改</el-button>
      </el-form>

    <hr  style="border-style: dashed"/>

    <div style="margin-top: 30px">
    <el-button size="mini" type="primary" @click="itemVisible=true">新增</el-button>
    <el-button size="mini" type="primary" @click="printOrder">打印</el-button>
    <el-table
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
          prop="goodsName"
          label="产品名称"
          align="center"
      >
      </el-table-column>
      <el-table-column
          prop="goodsIntro"
          label="光度"
          align="center"
      >
      </el-table-column>
      <el-table-column
        prop="goodsUnit"
        label="单位"
        align="center"
      >
      </el-table-column>
      <el-table-column
          prop="goodsCount"
          label="数量"
          align="center"
      ></el-table-column>
      <el-table-column
        prop="originalPrice"
        label="单价"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="sellingPrice"
        label="折后价格"
        align="center"
      >
      </el-table-column>
      <el-table-column
          label="操作"
          align="center"
      >
        <template #default="scope">
          <div v-if="scope.row.goodsUnit">
            <a style="cursor: pointer; margin-right: 10px;color: green" @click="updateItemAlert(scope.row.orderItemId)">修改</a>
            <br/>
            <el-popconfirm
                title="确定删除吗？"
                @confirm="deleteItem(scope.row.orderItemId)"
            >
              <template #reference>
                <a style="cursor: pointer; margin-right: 10px;color: red">删除</a>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </el-card>


  <el-dialog title="提示" v-model="itemVisible">
    <el-form :model="itemForm">
      <el-form-item :label="`选择产品`">
        <el-select placeholder="选择产品" v-model="itemForm.goodsId" filterable clearable   >
          <el-option v-for="val in goodList " :key="val.goodsId" :label="val.goodsName" :value="val.goodsId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="`产品名称`" >
        <label v-if="itemForm.goodsName"> {{itemForm.goodsName}} （球镜:{{itemForm.sphereMin}}~{{itemForm.sphereMax}}  柱镜: {{itemForm.cylinderMin}}~ {{itemForm.cylinderMax}}）</label>
      </el-form-item>
      <el-form-item :label="`光度`" >
        <el-input placeholder="光度" v-model="itemForm.goodsIntro" clearable ></el-input>
      </el-form-item>
      <el-form-item :label="`数量`" >
        <el-input placeholder="数量" v-model="itemForm.goodsCount" clearable ></el-input>
      </el-form-item>
      <el-form-item :label="`单价`" >
        <el-input placeholder="单价" v-model="itemForm.originalPrice" filterable clearable ></el-input>
      </el-form-item>
      <el-form-item :label="`折后金额`" >
        <el-input placeholder="折后金额" v-model="itemForm.sellingPrice" filterable clearable ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="itemVisible = false">取 消</el-button>
       <el-button type="primary" v-if="itemForm.orderItemId" @click="updateItem">修改</el-button>
      <el-button type="primary" v-else @click="addItem">新增</el-button>
    </span>
    </template>
  </el-dialog>


</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/utils/axios'
import {ElMessage} from "element-plus";
import { serverHost } from '@/utils'
export default {
  name: 'OrderDetail',
  data() {
    return {
      itemVisible:false,
      form:{},
      itemForm:{
        orderId:'',
        orderItemId:'',
        goodsId:'',
        goodsIntro:'',
        goodsCount:'',
        originalPrice:'',
        sellingPrice:''
      },
      orderId:'',
      tableData: [],
      userList:[],
      goodList:[]

    }
  },
  methods: {
    getOrderDetail() {
      axios.get(`/orders/`+this.orderId).then(res => {
        console.log(res)
        this.form = res
        this.tableData = res.orderItemVOS
      })
    },
    updateOrder(){
      axios.post('/order/edit', this.form).then(() => {
        ElMessage.success('修改成功')
        this.getOrderDetail()
      })
    },
    getAllUser(){
      axios.get('/user/allList').then(res => {
        this.userList = res
      })
    },
    getGoodList(){
      axios.get('/good/allList').then(res => {
        this.goodList = res
      })
    },
    updateItemAlert(orderItemId){
      axios.get('/order/item/detail/'+orderItemId).then((res) => {
        this.itemForm.sellingPrice = res.sellingPrice
        this.itemForm = res
        this.itemForm.orderId = this.orderId
        this.itemVisible = true
      })
    },
    updateItem(){
      axios.post('/order/item/update', this.itemForm).then(() => {
        ElMessage.success('修改成功')
        this.itemVisible = false
        this.itemForm ={}
        this.getOrderDetail()
      })
    },
    addItem(){
      this.itemForm.orderId = this.orderId
      axios.post('/order/item/add', this.itemForm).then(() => {
        ElMessage.success('新增成功')
        this.itemVisible = false
        this.itemForm ={}
        this.getOrderDetail()
      })
    },
    printOrder(){
      window.open(serverHost+"/order/print/"+this.orderId+"/"+this.form.printName)
    },
    deleteItem(itemId){
      axios.get('/order/item/delete/'+itemId).then(() => {
        ElMessage.success('删除成功')
        this.getOrderDetail()
      })
    },
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
    "itemForm.goodsId":{
      handler(newVal, oldVal) {
        for (const good in this.goodList) {
          if (this.goodList[good].goodsId === newVal) {
            this.itemForm.goodsName = this.goodList[good].goodsName
            this.itemForm.sphereMin = this.goodList[good].sphereMin
            this.itemForm.sphereMax = this.goodList[good].sphereMax
            this.itemForm.cylinderMin = this.goodList[good].cylinderMin
            this.itemForm.cylinderMax = this.goodList[good].cylinderMax
            this.itemForm.originalPrice = this.goodList[good].originalPrice
            if(this.itemForm.sellingPrice){
              this.itemForm.sellingPrice = this.goodList[good].sellingPrice
            }else{
              this.itemForm.sellingPrice =  this.goodList[good].originalPrice * this.form.costRate
            }
            break;
          }
        }
      }
    }
  },
  created() {
    this.orderId = this.$route.query.id;
    this.getAllUser()
    this.getOrderDetail()
    this.getGoodList()

  }
}
</script>

<style scoped>
  .data {
    display: flex;
    margin-bottom: 50px;
  }
  .data .data-item {
    flex: 1;
    margin: 0 10px;
  }
  .el-table {
    border: 1px solid #EBEEF5;
    border-bottom: none;
  }
  .has-gutter th {
    border-right: 1px solid #EBEEF5;
  }

  .has-gutter th:last-child {
    border-right: none;
  }
  .el-table__row td {
    border-right: 1px solid #EBEEF5;
  }
  .el-table__row td:last-child {
    border-right: none;
  }
</style>