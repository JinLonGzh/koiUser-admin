<template>
  <el-card class="main-card">
    <div class="title">{{ route.name }}</div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <el-button
          type="primary"
          size="small"
          :icon="CirclePlus"
          @click="openModel(null)"
      >
        新增
      </el-button>
      <el-button
          type="danger"
          size="small"
          :icon="Delete"
          :disabled="categoryIdList.length == 0"
          @click="deleteFormVisible = true"
      >
        批量删除
      </el-button>
      <!-- 刷新按钮 -->
      <el-tooltip effect="dark" content="刷新" placement="top">
        <el-button size="small" circle :icon="Refresh" @click="refresh" />
      </el-tooltip>
      <!-- 条件筛选 -->
      <div style="margin-left:auto">
        <el-input
            v-model="keywords"
            prefix-icon="el-icon-search"
            size="small"
            placeholder="请输入分类名"
            style="width:200px"
            @keyup.enter.native="searchCategories"
        />
        <el-button
            type="primary"
            size="small"
            :icon="Search"
            style="margin-left:1rem"
            @click="searchCategories"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 表格展示 -->
    <el-table
        border
        :data="categoryList"
        @selection-change="selectionChange"
        v-loading="loading"
    >
      <!-- 表格列 -->
      <el-table-column type="selection" width="55"/>
      <!-- 分类名 -->
      <el-table-column prop="categoryName" label="分类名" align="center"/>
      <!-- 公开文章量 -->
      <el-table-column prop="publicArticleCount" label="公开文章量" align="center"/>
      <!-- 私密文章量 -->
      <el-table-column prop="secretArticleCount" label="私密文章量" align="center"/>
      <!-- 草稿文章量 -->
      <el-table-column prop="draftArticleCount" label="草稿文章量" align="center"/>
      <!-- 分类创建时间 -->
      <el-table-column prop="createTime" label="创建时间" align="center" width="200">
        <template #default="scope">
          <el-icon style="margin-right:5px">
            <Clock/>
          </el-icon>
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <!-- 分类更新时间 -->
      <el-table-column prop="updateTime" label="更新时间" align="center" width="200">
        <template #default="scope">
          <el-icon style="margin-right:5px">
            <Clock/>
          </el-icon>
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column fixed="right" label="操作" width="160" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="openModel(scope.row)">
            编辑
          </el-button>
          <el-popconfirm
              title="确定删除吗？"
              style="margin-left:1rem"
              @confirm="deleteCategory(scope.row.id)"
          >
            <template #reference>
              <el-button size="small" type="danger" slot="reference">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
        class="pagination-container"
        background
        @size-change="pageSizeChange"
        @current-change="pageNoChange"
        :current-page="pageNo"
        :page-size="pageSize"
        :total="count"
        :page-sizes="[10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
    />
    <!-- 添加编辑对话框 -->
    <el-dialog v-model="addOrUpdateFormVisible" :title="addOrUpdateFormTitle" width="30%">
      <el-form label-width="80px" size="default" :model="formData" :rules="rules" ref="ruleFormRef">
        <el-form-item label="分类名" prop="categoryName">
          <el-input v-model="formData.categoryName" style="width:220px"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addOrUpdateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditCategory(ruleFormRef)">
          确 定
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {inject, onMounted, ref} from "vue";
import api from "@/api";
import {CategoryDataInterface} from "@/d.ts/api/category";
import {CirclePlus, Delete, Search, Clock, Refresh} from "@element-plus/icons-vue";
import {ProcessInterface} from "@/d.ts/modules/process";
import {FormInstance} from "element-plus";

const route = useRoute();
const router = useRouter();
const $process = inject<ProcessInterface>("$process")!;
const ruleFormRef = ref<FormInstance>()

const deleteFormVisible = ref(false);
const addOrUpdateFormVisible = ref(false);
const addOrUpdateFormTitle = ref("");
const loading = ref(true);

const categoryIdList = ref<Array<number>>([]);
const categoryList = ref<Array<CategoryDataInterface>>([]);
const formData = ref({
  id: null,
  categoryName: ""
})

const keywords = ref(null);

const pageNo = ref(1);
const pageSize = ref(10);
const count = ref(0);

onMounted(() => {
  listCategory();
})

const listCategory = () => {
  api.getCategoryList({
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    keywords: keywords.value
  }).then(({data}) => {
    categoryList.value = data.list;
    count.value = data.total;
    loading.value = false;
  })
}

const openModel = (item: CategoryDataInterface | null) => {
  if (item != null) {
    formData.value = JSON.parse(JSON.stringify(item));
    addOrUpdateFormTitle.value = "修改分类";
  } else {
    formData.value.id = null;
    formData.value.categoryName = "";
    addOrUpdateFormTitle.value = "添加分类";
  }
  addOrUpdateFormVisible.value = true;
}

const selectionChange = (selection: Array<CategoryDataInterface>) => {
  categoryIdList.value = [];
  selection.forEach(item => {
    categoryIdList.value.push(item.id);
  });
}

const searchCategories = () => {
  pageNo.value = 1;
  listCategory();
}

const deleteCategory = (id: number) => {
  api.deleteCategory(id).then(() => {
    listCategory();
    $process.tipShow.success("删除成功");
  })
}

const addOrEditCategory = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (formData.value.id == null) {
        // 添加
        api.addCategory({
          categoryName: formData.value.categoryName
        }).then(() => {
          listCategory();
          $process.tipShow.success("添加成功");
        })
      } else {
        // 修改
        api.updateCategory({
          id: formData.value.id,
          categoryName: formData.value.categoryName
        }).then(() => {
          listCategory();
          $process.tipShow.success("修改成功");
        })
      }
      addOrUpdateFormVisible.value = false;
    } else {
      $process.tipShow.warn("请填写完整信息");
    }
  })
}

const rules = {
  categoryName: [
    {required: true, message: '请输入分类名', trigger: 'blur'}
  ]
};

const pageSizeChange = (size: number) => {
  pageSize.value = size;
  listCategory();
}

const pageNoChange = (current: number) => {
  pageNo.value = current;
  listCategory();
}

const refresh = () => {
  loading.value = true;
  listCategory();
  $process.tipShow.success("刷新成功");
}

</script>

<style scoped lang="scss">

</style>