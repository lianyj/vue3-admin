var e=Object.defineProperty,o=Object.defineProperties,l=Object.getOwnPropertyDescriptors,r=Object.getOwnPropertySymbols,a=Object.prototype.hasOwnProperty,d=Object.prototype.propertyIsEnumerable,t=(o,l,r)=>l in o?e(o,l,{enumerable:!0,configurable:!0,writable:!0,value:r}):o[l]=r;import{_ as s}from"./element-plus.392249c9.js";import"./vue.6371db79.js";import{a as m}from"./index.5b6ae43b.js";import{b as i,u as n}from"./vue-router.b8b6d224.js";import{a as u}from"./axios.6127bb87.js";import{g as p,x as g,z as c,m as b,K as y,a8 as h,a9 as f,P as F,o as x,d as V,N as M,U as j,u as k,aa as N}from"./@vue.07e3533d.js";import"./dayjs.2a17732a.js";import"./lodash.ebb3c926.js";import"./mitt.33133208.js";import"./async-validator.e3a73323.js";import"./@popperjs.6ab8fae4.js";import"./resize-observer-polyfill.06552ccc.js";import"./normalize-wheel.d56ec257.js";import"./@sentry.2890fdbd.js";import"./tslib.e2371a99.js";const S={name:"AddGood",setup(){const{proxy:e}=p();console.log("proxy",e);const h=g(null),f=g(null),F=i(),x=n(),{id:V}=F.query,M=c({token:m("token")||"",id:V,goodForm:{goodsName:"",goodsIntro:"",originalPrice:"",stockNum:"",goodsSellStatus:"0",tag:null,remark:null,sphereMin:null,sphereMax:null,cylinderMin:null,cylinderMax:null},rules:{goodsName:[{required:"true",message:"请填写商品名称",trigger:["change"]}],originalPrice:[{required:"true",message:"请填写商品价格",trigger:["change"]}],stockNum:[{required:"true",message:"请填写商品库存",trigger:["change"]}]}});b((()=>{V&&u.get(`/goods/${V}`).then((e=>{const{goods:o}=e;M.goodForm={goodsName:o.goodsName,goodsIntro:o.goodsIntro,originalPrice:o.originalPrice,stockNum:o.stockNum,goodsSellStatus:String(o.goodsSellStatus),tag:o.tag,remark:o.remark,sphereMin:o.sphereMin,sphereMax:o.sphereMax,cylinderMin:o.cylinderMin,cylinderMax:o.cylinderMax}}))}));return j=((e,o)=>{for(var l in o||(o={}))a.call(o,l)&&t(e,l,o[l]);if(r)for(var l of r(o))d.call(o,l)&&t(e,l,o[l]);return e})({},y(M)),o(j,l({goodRef:f,submitAdd:()=>{f.value.validate((e=>{if(e){let e=u.post,o={goodsName:M.goodForm.goodsName,goodsIntro:M.goodForm.goodsIntro,goodsSellStatus:M.goodForm.goodsSellStatus,originalPrice:M.goodForm.originalPrice,stockNum:M.goodForm.stockNum,tag:M.goodForm.tag,remark:M.goodForm.remark,sphereMin:M.goodForm.sphereMin,sphereMax:M.goodForm.sphereMax,cylinderMin:M.goodForm.cylinderMin,cylinderMax:M.goodForm.cylinderMax};console.log("params",o),V&&(o.goodsId=V,e=u.put),e("/goods",o).then((()=>{s.success(V?"修改成功":"添加成功"),x.push({path:"/good"})}))}}))},editor:h}));var j}},_=N("data-v-5b264698");h("data-v-5b264698");const P={class:"add"},v=j(" 至 "),w=j(" 至 "),U=j("上架"),O=j("下架");f();const I=_(((e,o,l,r,a,d)=>{const t=F("el-input"),s=F("el-form-item"),m=F("el-radio"),i=F("el-radio-group"),n=F("el-button"),u=F("el-form"),p=F("el-card");return x(),V("div",P,[M(p,{class:"add-container"},{default:_((()=>[M(u,{model:e.goodForm,rules:e.rules,ref:"goodRef","label-width":"100px",class:"goodForm"},{default:_((()=>[M(s,{label:"商品名称",prop:"goodsName"},{default:_((()=>[M(t,{style:{width:"300px"},modelValue:e.goodForm.goodsName,"onUpdate:modelValue":o[1]||(o[1]=o=>e.goodForm.goodsName=o),placeholder:"请输入商品名称"},null,8,["modelValue"])])),_:1}),M(s,{label:"标批价格",prop:"originalPrice"},{default:_((()=>[M(t,{type:"number",min:"0",style:{width:"300px"},modelValue:e.goodForm.originalPrice,"onUpdate:modelValue":o[2]||(o[2]=o=>e.goodForm.originalPrice=o),placeholder:"请输入商品价格"},null,8,["modelValue"])])),_:1}),M(s,{label:"球镜范围",prop:"originalPrice"},{default:_((()=>[M(t,{type:"number",min:"-20",style:{width:"100px"},modelValue:e.goodForm.sphereMin,"onUpdate:modelValue":o[3]||(o[3]=o=>e.goodForm.sphereMin=o)},null,8,["modelValue"]),v,M(t,{type:"number",min:"0",style:{width:"100px"},modelValue:e.goodForm.sphereMax,"onUpdate:modelValue":o[4]||(o[4]=o=>e.goodForm.sphereMax=o)},null,8,["modelValue"])])),_:1}),M(s,{label:"柱镜范围",prop:"originalPrice"},{default:_((()=>[M(t,{type:"number",min:"-20",style:{width:"100px"},modelValue:e.goodForm.cylinderMin,"onUpdate:modelValue":o[5]||(o[5]=o=>e.goodForm.cylinderMin=o)},null,8,["modelValue"]),w,M(t,{type:"number",min:"0",style:{width:"100px"},modelValue:e.goodForm.cylinderMax,"onUpdate:modelValue":o[6]||(o[6]=o=>e.goodForm.cylinderMax=o)},null,8,["modelValue"])])),_:1}),M(s,{label:"商品库存",prop:"stockNum"},{default:_((()=>[M(t,{type:"number",min:"0",style:{width:"300px"},modelValue:e.goodForm.stockNum,"onUpdate:modelValue":o[7]||(o[7]=o=>e.goodForm.stockNum=o),placeholder:"请输入商品库存"},null,8,["modelValue"])])),_:1}),M(s,{label:"备注",prop:"stockNum"},{default:_((()=>[M(t,{style:{width:"300px"},modelValue:e.goodForm.remark,"onUpdate:modelValue":o[8]||(o[8]=o=>e.goodForm.remark=o),placeholder:"请输入备注"},null,8,["modelValue"])])),_:1}),M(s,{label:"商品标签",prop:"tag"},{default:_((()=>[M(t,{style:{width:"300px"},modelValue:e.goodForm.tag,"onUpdate:modelValue":o[9]||(o[9]=o=>e.goodForm.tag=o),placeholder:"请输入商品小标签"},null,8,["modelValue"])])),_:1}),M(s,{label:"上架状态",prop:"goodsSellStatus"},{default:_((()=>[M(i,{modelValue:e.goodForm.goodsSellStatus,"onUpdate:modelValue":o[10]||(o[10]=o=>e.goodForm.goodsSellStatus=o)},{default:_((()=>[M(m,{label:"0"},{default:_((()=>[U])),_:1}),M(m,{label:"1"},{default:_((()=>[O])),_:1})])),_:1},8,["modelValue"])])),_:1}),M(s,null,{default:_((()=>[M(n,{type:"primary",onClick:o[11]||(o[11]=e=>r.submitAdd())},{default:_((()=>[j(k(e.id?"立即修改":"立即创建"),1)])),_:1})])),_:1})])),_:1},8,["model","rules"])])),_:1})])}));S.render=I,S.__scopeId="data-v-5b264698";export{S as default};
