<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene!=0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="scene===0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80px" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <el-button type="primary" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></el-button>
              <el-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="handle(row)"></el-button>
              <el-popconfirm :title="`确定删除${row.spuName}吗`" @onConfirm="deleteSpu(row)">
                <el-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference" style="margin-left:10px"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align:center"
          :current-page="page"
          :page-sizes="[3, 5, 7]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :total="total">
        </el-pagination>
      </div>
      <SpuForm v-show="scene===1" @changeScene="changeScene" ref="spu"></SpuForm>
      <SkuForm v-show="scene===2" @changeScenes="changeScenes" ref="sku"></SkuForm>
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuList" style="width: 100%" v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: "Spu",
  components:{
    SpuForm,
    SkuForm
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page:1,
      limit:3,
      // Spu列表数据
      records:[],
      total:0,
      // 控制显示哪个
      scene:0,
      // 控制展示sku列表的对话框是否显示
      dialogTableVisible:false,
      spu:{},
      // 存储服务器返回的sku列表数据
      skuList:[],
      // sku列表还没有回来的时候，loading效果
      loading:true
    };
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    async getSpuList(pager = 1) {
      this.page=pager
      let {page,limit,category3Id}=this
      let result = await this.$API.spu.reqSpuList(page,limit,category3Id)
      if(result.code===200){
        this.total=result.data.total;
        this.records=result.data.records;
      }
    },
    handleSizeChange(limit){
      this.limit=limit
      this.getSpuList()
    },
    addSpu(){
      this.scene=1;
      this.$refs.spu.addSpu(this.category3Id);
    },
    updateSpu(row){
      this.scene=1;
      this.$refs.spu.initSpuData(row);
    },
    changeScene({scene,flag}){
      this.scene=scene;
      if(flag==='修改'){
        this.getSpuList(this.page);
      }else if(flag==='添加'){
        this.getSpuList();
      } 
    },
    async deleteSpu(row){
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if(result.code===200){
        this.$message({type:'success',message:'删除成功'});
        this.getSpuList(this.records.length>1?this.page:this.page-1);
      }
    },
    addSku(row){
      this.scene=2;
      this.$refs.sku.getDate(this.category1Id,this.category2Id,row);
    },
    changeScenes(scene){
      this.scene=scene;
    },
    // 查看sku列表的回调
    async handle(spu){
      this.dialogTableVisible=true;
      this.spu=spu;
      let result = await this.$API.sku.reqSkuList(spu.id);
      if(result.code===200){
        this.skuList=result.data;
        this.loading=false;
      }
    },
    // 关闭dialog的回调
    close(done){
      // 解决了loading效果只有一次的问题
      this.loading=true;
      // 解决数据回显
      this.skuList=[];
      done();
    }
  },
};
</script>

<style>
</style>