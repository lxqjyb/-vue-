<template>
  <div>
    <!-- 按钮组件 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 表格组件 -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" style="width: 120px; height: 100px" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; textalign: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->,sizes, total"
      :total="total"
      :pager-count="7"
      @current-change="getTradeMark"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 对话框
        :visible.sync- 控制对话框显示与隐藏
     -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- action：设置上传图片接口地址 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    var validateName = (rule, value, callback) => {
      // 自定义校验规则
      if (value.length < 2 || value.length > 10) {
        callback(new Error("长度在 2 到 10 个字"));
      } else {
        callback();
      }
    };
    return {
      // 当前第几页
      page: 1,
      // 当前页数展示数据条数
      limit: 3,
      // 总共数据条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 对话框显示与隐藏属性
      dialogFormVisible: false,
      // 收集品牌信息
      tmForm: {
        logoUrl: "",
        tmName: "",
      },
      // 表单验证规则
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // 自定义校验规则
          { validator: validateName, trigger: "change" },
        ],
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  mounted() {
    this.getTradeMark();
  },
  methods: {
    // 获取品牌列表数据
    async getTradeMark(pager = 1) {
      this.page = pager;
      let { page, limit } = this;
      let result = await this.$API.tradeMark.reqTradeMark(page, limit);
      if (result.code === 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    //  切换分页器的某一页展示的数据时会触发
    handleSizeChange(limit) {
      this.limit = limit;
      this.getTradeMark();
    },
    // 点击添加按钮
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true;
      // 清除数据
      this.tmForm = { logoUrl: "", tmName: "" };
    },
    // 点击修改按钮
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      this.tmForm = { ...row };
    },
    // 上传图片相关的回调
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加或修改品牌
    addOrUpdateTradeMark() {
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false;
          // 发请求
          let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code === 200) {
            // 弹出信息
            this.$message({
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            // 在服务器里添加或者修改品牌成功后，需要再次获取品牌列表
            this.getTradeMark(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteTradeMark(row) {
      this.$confirm(`确认删除${row.tmName}吗?`, "删除品牌", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 重新获取页面数据
            this.getTradeMark(this.list.length>1?this.page:this.page-1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style> 