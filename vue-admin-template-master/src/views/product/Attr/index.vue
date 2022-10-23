<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150px">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 10px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150px">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="编辑"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
                @click="deleteAttr(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
                size="mini"
              ></el-input>
              <span v-else @click="toEdit(row, $index)">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 平台售卖属性的数据
      attrList: [],
      isShowTable: true,
      // 收集新增属性|修改属性的数据
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
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
        this.getAttrList();
      }
    },
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //这里是属性值对应的属性名的id，由于是添加属性，而id都是服务器数据库给的，所以现在还没有id,修改属性就有id
        valueName: "",
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 添加属性按钮的回调
    addAttr() {
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    updateAttr(row) {
      this.isShowTable = false;
      // 将选中的属性赋值给attrInfo
      // 由于数据结构中存在对象里面套数组，数组里面又套对象，因此需要深拷贝解决这类问题
      // 调用lodash插件里面的cloneDeep函数可以实现深拷贝
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    toLook(row) {
      if (row.valueName.trim() === "") {
        this.$message("请输入正常的属性值");
        return;
      }
      // 判断添加或修改的属性值是否重复
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        if (row != item) {
          return row.valueName === item.valueName;
        }
      });
      if (isRepeat) {
        this.$message("属性值不能重复");
        return;
      }
      row.flag = false;
    },
    toEdit(row, index) {
      row.flag = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 气泡确认框确定按钮的回调
    deleteAttrValue(index){
      this.attrInfo.attrValueList.splice(index,1);
    },
    // 保存按钮：进行添加属性或者修改属性的操作
    async addOrUpdateAttr(){
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item)=>{
        if(item.valueName!=''){
          delete item.flag;
          return true;
        }
      });
      if(this.attrInfo.attrValueList.length){
        let result = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        if(result.code===200){
        this.isShowTable = true
        this.$message({type:'seccess',message:'保存成功'})
        this.getAttrList()
        }
      }else{
        this.$message({type:'warning',message:'属性值不能为空'})
      }  
    },
    deleteAttr(row){
      this.$confirm(`确定删除${row.attrName}吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let result = await this.$API.attr.reqDeleteAttr(row.id)
          if(result.code===200){
            this.$message({
            type: 'success',
            message: '删除成功!'
            });
            this.getAttrList();
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
};
</script>

<style>
</style>