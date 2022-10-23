<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tradeMark.tmName"
            :value="tradeMark.id"
            v-for="tradeMark in tradeMarkList"
            :key="tradeMark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="描述"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndName">
          <el-option :label="unSelect.name" :value="`${unSelect.id}:${unSelect.name}`" v-for="unSelect in unSelectSaleAttr" :key="unSelect.id"> </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndName" @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="100px">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                :key="tag.id"
                v-for="(tag,index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- @keyup.enter.native="handleInputConfirm"-->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <!--  @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150px">
            <template slot-scope="{$index}">
              <el-button type="primary" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        category3Id: 0,
        description: "",
        spuName: "",
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
         /*  {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "string",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "string",
                saleAttrName: "string",
                saleAttrValueName: "string",
                spuId: 0,
              },
            ],
          }, */
        ],
        tmId: '',
      }, //存储spu信息属性
      tradeMarkList: [],
      spuImageList: [],
      saleAttrList: [],
      attrIdAndName:'',//收集未选择的，但后来又选择的销售属性的id
    };
  },
  methods: {
    // 照片墙删除某一个图片的时候触发
    handleRemove(file, fileList) {
      // file参数:代表的是删除的那张图片
      // fileList:照片墙删除某张图片后还剩余的图片
      // console.log(file, fileList);
      this.spuImageList=fileList;
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      // 将点击的想要预览的图片地址赋值给这个属性
      this.dialogImageUrl = file.url;
      //对话框显示 
      this.dialogVisible = true;
    },
    // 初始化SpuForm数据
    async initSpuData(spu) {
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code === 200) {
        this.spu = spuResult.data;
      }
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code === 200) {
        let fileList = spuImageResult.data;
        fileList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = fileList;
      }
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    handleSuccess(response, file, fileList){
      this.spuImageList=fileList;
    },
    addSaleAttr(){
      let [baseSaleAttrId,saleAttrName] = this.attrIdAndName.split(':')
      let newSaleAttr={baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
      this.spu.spuSaleAttrList.push(newSaleAttr)
      this.attrIdAndName=''
    },
    addSaleAttrValue(row){
      this.$set(row,'inputVisible',true)
      this.$set(row,'inputValue','')
      this.$nextTick(()=>{
        this.$refs.saveTagInput.focus();
      })
    },
    handleInputConfirm(row){
      let {baseSaleAttrId,inputValue}=row
      if(inputValue.trim()===''){
        this.$message('属性值不能为空')
        return;
      }
      let result = row.spuSaleAttrValueList.every(item=>{
        return item.saleAttrValueName!=inputValue
      })
      if(!result){
        this.$message('属性值不能重复')
        return;
      }
      let newSaleAttrValue={baseSaleAttrId,saleAttrValueName:inputValue}
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible=false
    },
    // 点击保存按钮的回调
    async addOrUpdateSpu(){
      // 整理参数,新增的图片没有imgName和imgUrl两个属性，需要添加上给服务器
      this.spu.spuImageList = this.spuImageList.map(item=>{
        return {
          imgName:item.name,
          imgUrl:(item.response&&item.response.data)||item.url
        }
      })
      // 发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if(result.code===200){
        this.$message({type:'success',message:'保存成功'})
        // 通知父亲修改场景
        this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'添加'})
        // 清除数据，以免回显
        Object.assign(this._data,this.$options.data())
      }
    },
    // 点击添加spu展示这个组件，也要获取品牌和所以销售属性信息
    async addSpu(category3Id){
      this.spu.category3Id=category3Id;
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data;
      };
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      };

    },
    cancel(){
      // 点击取消的之后清除数据
      Object.assign(this._data,this.$options.data());
      this.$emit('changeScene', {scene:0,flag:''})
    }
  },
  computed:{
    unSelectSaleAttr(){
      let result = this.saleAttrList.filter((item)=>{
        return this.spu.spuSaleAttrList.every(item1=>{
          return item.name!=item1.saleAttrName
        })
      })
      return result
    }
  }
};
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>