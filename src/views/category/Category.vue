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
          <el-icon style="margin-right:5px"><Clock /></el-icon>
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <!-- 分类更新时间 -->
      <el-table-column prop="updateTime" label="更新时间" align="center" width="200">
        <template #default="scope">
          <el-icon style="margin-right:5px"><Clock /></el-icon>
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
      <el-form label-width="80px" size="small" :model="formDate">
        <el-form-item label="分类名">
          <el-input v-model="formDate.categoryName" style="width:220px"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addOrUpdateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditCategory">
          确 定
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import api from "@/api";
import {CategoryDataInterface} from "@/d.ts/api/category";
import {CirclePlus, Delete, Search, Clock} from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();

const deleteFormVisible = ref(false);
const addOrUpdateFormVisible = ref(false);
const addOrUpdateFormTitle = ref("");
const loading = ref(true);

const categoryIdList = ref<Array<number>>([]);
const categoryList = ref<Array<CategoryDataInterface>>([]);
const formDate = ref({
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

const openModel = (item: CategoryDataInterface) => {
  if (item != null) {
    formDate.value = JSON.parse(JSON.stringify(item));
    addOrUpdateFormTitle.value = "修改分类";
  } else {
    formDate.value.id = null;
    formDate.value.categoryName = "";
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

}

const addOrEditCategory = () => {

}

const pageSizeChange = (size: number) => {
  pageSize.value = size;
  listCategory();
}

const pageNoChange = (current: number) => {
  pageNo.value = current;
  listCategory();
}


</script>

<style scoped lang="scss">

</style>