<template>
  <div>
    <el-card>
      <el-table style="width: 100%" border :data="records">
        <el-table-column type="index" label="序号" width="80px" align="center">
        </el-table-column>
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="skuDesc" label="描述" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="120px">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(KG)" width="80px">
        </el-table-column>
        <el-table-column prop="price" label="价格(元)" width="100px">
        </el-table-column>
        <el-table-column label="操作" width="width">
          <template slot-scope="{ row }">
            <el-button
              type="success"
              icon="el-icon-top"
              size="mini"
              title="上架"
              v-if="row.isSale === 0"
              @click="onSale(row)"
            ></el-button>
            <el-button
              icon="el-icon-bottom"
              size="mini"
              title="下架"
              v-else
              @click="cancelSale(row)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="info"
              icon="el-icon-info"
              size="mini"
              @click="getSkuInfo(row)"
            ></el-button>
            <el-popconfirm :title="`确定删除${row.skuName}吗？`" @onConfirm="deleteSku(row)">
             <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              slot="reference"
              style="margin-left:10px"
            ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination
      @current-change="getSkuList"
      @size-change="handleSizeChange"
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            style="margin-right: 10px"
            v-for="attr in skuInfo.skuAttrValueList"
            :key="attr.id"
            >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="450px">
            <el-carousel-item
              v-for="skuImage in skuInfo.skuImageList"
              :key="skuImage.id"
            >
              <img :src="skuImage.imgUrl" style="width: 100%; height: 450px" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      records: [],
      // 点击详情获得的sku详情
      skuInfo: {},
      drawer: false,
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    async getSkuList(pager = 1) {
      this.page = pager;
      let { page, limit } = this;
      let result = await this.$API.sku.reqSku(page, limit);
      if (result.code === 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 改变了每页展示多少条数据
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    // 点击向上的箭头，表示上架
    async onSale(sku) {
      let result = await this.$API.sku.reqOnSale(sku.id);
      if (result.code === 200) {
        // 上架成功，把该sku的状态改为1
        // 0代表是下架的状态，1代表正在上架状态，所以应该显示向下的箭头
        sku.isSale = 1;
        this.$message("上架成功");
      }
    },
    async cancelSale(sku) {
      let result = await this.$API.sku.reqCancelSale(sku.id);
      if (result.code === 200) {
        // 下架成功，把该sku的售卖状态设为0
        sku.isSale = 0;
        this.$message("下架成功");
      }
    },
    async getSkuInfo(sku) {
      this.drawer = true;
      let result = await this.$API.sku.reqSkuInfo(sku.id);
      if (result.code === 200) {
        this.skuInfo = result.data;
      }
    },
    async deleteSku(sku) {
      let result = await this.$API.sku.reqDeleteSku(sku.id);
      if (result.code === 200) {
        this.$message("删除成功");
        this.getSkuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
  },
};
</script>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px;
}
/* >>>深度选择器，代表即使加了scoped也可以影响子组件的样式 */
/* >>>.el-carousel__button{
    width:10px;
    hei   ght: 10px;
    background: red;
    border-radius: 50%;
  } */
</style>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
</style>