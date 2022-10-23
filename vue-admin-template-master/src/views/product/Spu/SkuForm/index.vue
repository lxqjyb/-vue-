<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{spu.spuName}} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="sku.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="sku.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="规格描述" rows="4" v-model="sku.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndAttrValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndAttrValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList"  @selection-change="handleSelectionChange">>
          <el-table-column
            type="selection"
            prop="prop"
            width="80px"
          >
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <el-button type="primary" v-if="row.isDefault===0" @click="changeDefault(row)">设为默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spu:{},
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      sku: {
        category3Id: '',
        spuId: 0,
        tmId: 0,
        skuName: "",
        price: '',
        skuDesc: "",
        weight: "",
        skuDefaultImg: "",
        skuAttrValueList: [
          /* {
            attrId: 0，
            valueId: 0,
          }, */
        ],
        skuImageList: [
         /*  {
            imgName: "string",
            imgUrl: "string",
            isDefault: "string",
            spuImgId: 0,
          }, */
        ],
        skuSaleAttrValueList: [
          /* {
            saleAttrId: 0,
            saleAttrValueId: 0,
          }, */
        ],
      },
      imageList:[]
    }
  },
  methods: {
    async getDate(category1Id, category2Id, spu) {
      this.spu=spu;
      this.sku.category3Id=spu.category3Id;
      this.sku.spuId=spu.id;
      this.sku.tmId=spu.tmId;
      let result = await this.$API.sku.reqSpuImageList(spu.id);
      if (result.code === 200) {
        let list = result.data;
        list.forEach(item => {
          item.isDefault=0;
        });
        this.spuImageList=list;
      }
      let result1 = await this.$API.sku.reqSpuSaleAttrList(spu.id);
      if (result1.code === 200) {
        this.spuSaleAttrList = result1.data;
      }
      let result2 = await this.$API.sku.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result2.code === 200) {
        this.attrInfoList = result2.data;
      }
    },
    // 表格里的图片被选中的回调。选中的图片传给了params
    handleSelectionChange(params){
      this.imageList=params;
    },
    changeDefault(row){
      // 排他操作
      this.spuImageList.forEach(item=>{
        item.isDefault=0
      });
      row.isDefault=1;
      // 收集默认图片地址
      this.sku.skuDefaultImg=row.imgUrl;
    },
    cancel(){
      this.$emit('changeScenes',0);
      Object.assign(this._data,this.$options.data());
    },
    async save(){
      let {sku,attrInfoList,spuSaleAttrList,imageList}=this;
      // 整理平台属性的数据
      sku.skuAttrValueList = attrInfoList.reduce((pre,item)=>{
        if(item.attrIdAndAttrValueId){
          let [attrId,valueId] = item.attrIdAndAttrValueId.split(':');
          pre.push({attrId,valueId});
        }
        return pre;
      },[]);
      // 整理销售属性的数据
      sku.skuSaleAttrValueList = spuSaleAttrList.reduce((pre,item)=>{
        if(item.attrIdAndAttrValueId){
          let [saleAttrId,saleAttrValueId]=item.attrIdAndAttrValueId.split(':');
          pre.push({saleAttrId,saleAttrValueId})
        }
        return pre;
      },[]);
      // 整理图片的数据
      sku.skuImageList=imageList.map(item=>{
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      let result = await this.$API.sku.reqAddSku(sku);
      if(result.code===200){
        this.$message({type:'success',message:'添加sku成功'});
        this.$emit('changeScenes',0);
        Object.assign(this._data,this.$options.data());
      }
    }
  },
};
</script>

<style>
</style>