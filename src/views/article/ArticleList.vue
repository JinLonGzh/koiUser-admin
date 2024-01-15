<template>
  <el-card class="main-card">
    <div class="title">{{ route.name }}</div>
    <!-- 文章状态 -->
    <div class="article-status-menu">
      <span>状态</span>
      <span @click="changeStatus('all')" :class="isActive('all')">全部</span>
      <span @click="changeStatus('public')" :class="isActive('public')">
        公开
      </span>
      <span @click="changeStatus('secret')" :class="isActive('secret')">
        私密
      </span>
      <span @click="changeStatus('draft')" :class="isActive('draft')">
        草稿
      </span>
    </div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <el-button
          type="danger"
          size="small"
          :icon="Delete"
          :disabled="articleIdList.length == 0"
          @click="deleteFormVisible = true"
      >
        批量删除
      </el-button>
      <el-button
          type="success"
          size="small"
          :icon="Upload"
          :disabled="articleIdList.length == 0"
          style="margin-right:1rem"
          @click="exportFormVisible = true"
      >
        批量导出
      </el-button>
      <el-dropdown>
        <el-button
            type="primary"
            size="small"
            :icon="Download"
            style="margin-right:1rem"
        >
          批量导入
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-upload
                  action="/api/admin/articles/import"
                  multiple
                  :limit="9"
                  :show-file-list="false"
                  :on-success="uploadArticle"
              >
                普通文章
              </el-upload>
            </el-dropdown-item>
            <el-dropdown-item
            >
              <el-upload
                  action="/api/admin/articles/import?type=hexo"
                  multiple
                  :limit="9"
                  :show-file-list="false"
                  :on-success="uploadArticle"
              >
                Hexo文章
              </el-upload>
            </el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 条件筛选 -->
      <div style="margin-left:auto">
        <!-- 分类 -->
        <el-select
            clearable
            size="small"
            v-model="categoryId"
            filterable
            placeholder="请选择分类"
            style="margin-right:1rem;width: 180px;"
        >
          <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
        <!-- 文章名 -->
        <el-input
            clearable
            v-model="keywords"
            :prefix-icon="Search"
            size="small"
            placeholder="请输入文章名"
            style="width:200px"
            @keyup.enter.native="searchArticles"
        />
        <el-button
            type="primary"
            size="small"
            :icon="Search"
            style="margin-left:1rem"
            @click="searchArticles"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 表格展示 -->
    <el-table
        border
        :data="articleList"
        @selection-change="selectionChange"
        v-loading="loading"
    >
      <!-- 表格列 -->
      <el-table-column type="selection" width="55"/>
      <!-- 文章封面 -->
      <el-table-column
          prop="articleCover"
          label="文章封面"
          width="180"
          align="center"
      >
        <template #default="scope">
          <el-image
              class="article-cover"
              :src="
              scope.row.articleCover
                ? scope.row.articleCover
                : 'https://static.talkxj.com/articles/c5cc2b2561bd0e3060a500198a4ad37d.png'
            "
          />
          <i
              v-if="scope.row.status == 0"
              class="iconfont el-icon-mygongkai article-status-icon"
          />
          <i
              v-if="scope.row.status == 1"
              class="iconfont el-icon-mymima article-status-icon"
          />
        </template>
      </el-table-column>
      <!-- 文章标题 -->
      <el-table-column prop="articleTitle" label="标题" align="center"/>
      <!-- 文章分类 -->
      <el-table-column
          prop="categoryName"
          label="分类"
          width="110"
          align="center"
      />
      <!-- 文章浏览量 -->
      <el-table-column
          prop="viewsCount"
          label="浏览量"
          width="70"
          align="center"
      >
        <template #default="scope">
          <span v-if="scope.row.viewCount">
            {{ scope.row.viewCount }}
          </span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <!-- 文章发表时间 -->
      <el-table-column
          prop="createTime"
          label="发表时间"
          width="200"
          align="center"
      >
        <template #default="scope">
          <el-icon style="margin-right:5px"><Clock /></el-icon>
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <!-- 文章更新时间 -->
      <el-table-column
          prop="updateTime"
          label="更新时间"
          width="200"
          align="center"
      >
        <template #default="scope">
          <el-icon style="margin-right:5px"><Clock /></el-icon>
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <!-- 文章置顶 -->
      <el-table-column prop="articleTop" label="置顶" width="80" align="center">
        <template #default="scope">
          <el-switch
              v-model="scope.row.articleTop"
              active-color="#13ce66"
              inactive-color="#F4F4F5"
              :active-value="1"
              :inactive-value="0"
              @change="changeTop(scope.row)"
          />
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column fixed="right" label="操作" align="center" width="150">
        <template #default="scope">
          <el-button
              type="primary"
              size="small"
              @click="editArticle(scope.row.id)"
          >
            编辑
          </el-button>
          <el-popconfirm
              title="确定删除吗？"
              style="margin-left:10px"
              @confirm="deleteArticle(scope.row.id)"
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
    <!-- 批量逻辑删除对话框 -->
    <el-dialog v-model="deleteFormVisible" width="30%">
      <div class="dialog-title-container" slot="title">
        <el-icon>
          <Warning style="color:#ff9900"/>
        </el-icon>
        提示
      </div>
      <div style="font-size:1rem">是否删除选中项？</div>
      <template #footer>
        <el-button @click="deleteFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteArticles()">
          确 定
        </el-button>
      </template>
    </el-dialog>
    <!-- 批量导出对话框 -->
    <el-dialog v-model="exportFormVisible" width="30%">
      <div class="dialog-title-container" slot="title">
        <el-icon>
          <Warning style="color:#ff9900"/>
        </el-icon>
        提示
      </div>
      <div style="font-size:1rem">是否导出选中文章？</div>
      <template #footer>
        <el-button @click="exportFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="exportArticles()">
          确 定
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">

import {Search, Download, Delete, Upload, Warning, Clock} from '@element-plus/icons-vue'
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref, watch} from "vue";
import api from "@/api";
import {ArticleDataInterface} from "@/d.ts/api/article";
import {OptionInterface} from "@/d.ts/api";
import {ArticleStatusEnum} from "@/config/constant.ts";

const route = useRoute();
const router = useRouter();

const activeStatus = ref("all");
const deleteFormVisible = ref(false);
const exportFormVisible = ref(false);
const loading = ref(true);

const articleList = ref<Array<ArticleDataInterface>>([]);
const articleIdList = ref<Array<number>>([]);
const categoryList = ref<Array<OptionInterface>>([]);

const keywords = ref(null);
const categoryId = ref<number | null>(null);
const status = ref<number | null>(null);

const pageNo = ref(1);
const pageSize = ref(10);
const count = ref(0);

onMounted(() => {
  listArticlePage();
  getCategoryOption();
})

const listArticlePage = () => {
  api.pageArticle({
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    keywords: keywords.value,
    categoryId: categoryId.value,
    status: status.value
  }).then(({data}) => {
    articleList.value = data.list;
    count.value = data.total;
    loading.value = false;
  })
}

const getCategoryOption = () => {
  api.getCategoryOption({keywords: null}).then(({data}) => {
    categoryList.value = data;
  })
}

const changeStatus = (key: string) => {
  switch (key) {
    case "all":
      status.value = null;
      break;
    case "public":
      status.value = ArticleStatusEnum.PUBLIC;
      break;
    case "secret":
      status.value = ArticleStatusEnum.SECRET;
      break;
    case "draft":
      status.value = ArticleStatusEnum.DRAFT;
      break;
  }
  pageNo.value = 1;
  activeStatus.value = key;
}
const isActive = (key: string) => {
  return activeStatus.value == key ? "active-status" : "status";
}

watch([categoryId, status], () => {
  pageNo.value = 1;
  listArticlePage();
});

const searchArticles = () => {
  pageNo.value = 1;
  listArticlePage();
}

const uploadArticle = () => {

}

const selectionChange = () => {
  articleIdList.value = [];
  articleList.value.forEach(item => {
    articleIdList.value.push(item.id);
  });
}

const changeTop = (article: ArticleDataInterface) => {
  api.updateArticleTop({
    id: article.id,
    top: article.articleTop
  }).then(() => {
    listArticlePage();
  })
}

const editArticle = (id: number) => {
  router.push({
    path: "/updateArticle",
    query: {
      id: id
    }
  });
}

const deleteArticle = (id: number) => {
  if (id != null) {
    api.deleteArticle(id).then(() => {
      listArticlePage();
    })
  }
}

const pageSizeChange = (size: number) => {
  pageSize.value = size;
  listArticlePage();
}

const pageNoChange = (current: number) => {
  pageNo.value = current;
  listArticlePage();
}

const deleteArticles = () => {
  deleteFormVisible.value = false;
}

const exportArticles = () => {
  exportFormVisible.value = false;
}
</script>

<style scoped lang="scss">

.article-status-menu {
  font-size: 14px;
  margin-top: 40px;
  color: #999;

  span {
    margin-right: 24px;
  }

  .status {
    cursor: pointer;
  }

  .active-status {
    cursor: pointer;
    color: #333;
    font-weight: bold;
  }
}
</style>