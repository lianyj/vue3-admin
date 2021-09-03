<template>
  <div class="add">
    <el-card class="add-container">
      <el-form :model="goodForm" :rules="rules" ref="goodRef" label-width="100px" class="goodForm">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input style="width: 300px" v-model="goodForm.goodsName" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="标批价格" prop="originalPrice">
          <el-input style="width: 300px" v-model="goodForm.originalPrice" placeholder="请输入商品价格"></el-input>
        </el-form-item>
        <el-form-item label="球镜范围" >
          <el-input style="width: 100px" v-model="goodForm.sphereMin"  ></el-input> 至
          <el-input style="width: 100px" v-model="goodForm.sphereMax"  ></el-input>
        </el-form-item>
        <el-form-item label="柱镜范围" >
          <el-input style="width: 100px" v-model="goodForm.cylinderMin"  ></el-input> 至
          <el-input style="width: 100px" v-model="goodForm.cylinderMax"  ></el-input>
        </el-form-item>
        <el-form-item label="商品库存" >
          <el-input type="number" min="0" style="width: 300px" v-model="goodForm.stockNum" placeholder="请输入商品库存"></el-input>
        </el-form-item>
        <el-form-item label="备注" >
          <el-input style="width: 300px" v-model="goodForm.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="商品标签">
          <el-input style="width: 300px" v-model="goodForm.tag" placeholder="请输入商品小标签"></el-input>
        </el-form-item>
        <el-form-item label="上架状态" >
          <el-radio-group v-model="goodForm.goodsSellStatus">
            <el-radio :label="0">上架</el-radio>
            <el-radio :label="1">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="goodForm.goodsId" @click="updateGood()">立即修改</el-button>
          <el-button type="primary" v-else @click="submitAdd()">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'
import router from "../router";
export default {
  name: 'AddGood',
  data() {
    return {
      goodForm: {
        id:'',
        goodsName: '',
        originalPrice: '',
        sphereMin:'',
        sphereMax:'',
        cylinderMin:'',
        cylinderMax:'',
        remark:'',
        stockNum: '',
        goodsSellStatus:'0',
        tag: ''
      },
      rules: {
        goodsName: [
          { required: 'true', message: '请填写商品名称', trigger: ['change'] }
        ],
        originalPrice: [
          { required: 'true', message: '请填写商品价格', trigger: ['change'] }
        ],
      },
    }
  },
  methods: {
    getGood(id){
      axios.get(`/goods/`+id).then((res)=>{
        console.log('data', res)
        this.goodForm = res.goods
        });
      },
     submitAdd(){
       axios.post('/goods', this.goodForm).then(() => {
            ElMessage.success( '添加成功')
            router.push({ path: '/good' })
          })
    },
    updateGood(){
      axios.put('/goods', this.goodForm).then(() => {
        ElMessage.success( '修改成功' )
        router.push({ path: '/good' })
      })
    },
  },
  created() {
    this.goodForm.id = this.$route.query.id;
    if(this.goodForm.id){
      this.getGood(this.goodForm.id);
    }
  }
}
</script>

<style scoped>
  .add {
    display: flex;
  }
  .add-container {
    flex: 1;
    height: 100%;
  }
  .avatar-uploader {
    width: 100px;
    height: 100px;
    color: #ddd;
    font-size: 30px;
  }
  .avatar-uploader-icon {
    display: block;
    width: 100%;
    height: 100%;
    border: 1px solid #e9e9e9;
    padding: 32px 17px;
  }
</style>