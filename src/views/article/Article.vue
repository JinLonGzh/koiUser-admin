<template>
  <el-card class="main-card" :key="componentKey">
    <div class="title">{{ route.name }}</div>
    <!-- 文章标题 -->
    <div class="article-title-container">
      <el-input
          v-model="article.articleTitle"
          size="default"
          placeholder="输入文章标题"
      />
      <el-button
          type="danger"
          size="default"
          class="save-btn"
          @click="saveArticleDraft"
          v-if="article.id == null || article.status === 2"
      >
        保存草稿
      </el-button>
      <el-button
          type="danger"
          size="default"
          @click="openModel"
          style="margin-left:10px"
      >
        发布文章
      </el-button>
    </div>
    <!-- 文章内容 -->
    <MdEditor
        ref="md"
        v-model="article.articleContent"
        @onUploadImg="onUploadImg"
    />
    <!-- 添加文章对话框 -->
    <el-dialog
        v-model="addOrEditVisible"
        title="发布文章"
        width="40%"
        top="3vh"
    >
      <!-- 文章数据 -->
      <el-form label-width="80px" size="default" :model="article">
        <!-- 文章分类 -->
        <el-form-item label="文章分类">
          <el-tag
              type="success"
              v-show="article.categoryName"
              style="margin:0 1rem 0 0"
              :closable="true"
              @close="removeCategory"
          >
            {{ article.categoryName }}
          </el-tag>
          <!-- 分类选项 -->
          <el-popover
              placement="bottom-start"
              width="460"
              trigger="click"
              v-if="!article.categoryName"
          >
            <div class="popover-title">分类</div>
            <!-- 搜索框 -->
            <el-autocomplete
                style="width:100%"
                v-model="article.categoryName"
                :fetch-suggestions="searchCategories"
                placeholder="请输入分类名搜索，enter可添加自定义分类"
                :trigger-on-focus="false"
                @keyup.enter.native="saveCategory"
                @select="handleSelectCategories"
            >
              <template #default="item">
                <div>{{ item.categoryName }}</div>
              </template>
            </el-autocomplete>
            <!-- 分类 -->
            <div class="popover-container">
              <div
                  v-for="item of categoryList"
                  :key="item.id"
                  class="category-item"
                  @click="addCategory(item.name)"
              >
                {{ item.name }}
              </div>
            </div>
            <template #reference>
              <el-button type="success" plain slot="reference" size="small">
                添加分类
              </el-button>
            </template>
          </el-popover>
        </el-form-item>
        <!-- 封面 -->
        <el-form-item label="上传封面">
          <el-upload
              class="upload-cover"
              drag
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              multiple
              :before-upload="beforeUpload"
              :on-success="uploadCover"
          >
            <el-icon class="el-icon--upload" v-if="article.articleCover == ''">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text" v-if="article.articleCover == ''">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <img
                v-else
                :src="article.articleCover"
                width="360px"
                height="180px"
            />
          </el-upload>
        </el-form-item>
        <!-- 置顶 -->
        <el-form-item label="置顶">
          <el-switch
              v-model="article.articleTop"
              active-color="#13ce66"
              inactive-color="#F4F4F5"
              :active-value="1"
              :inactive-value="0"
          />
        </el-form-item>
        <!-- 发布形式 -->
        <el-form-item label="发布形式">
          <el-radio-group v-model="article.status">
            <el-radio :label="0">公开</el-radio>
            <el-radio :label="1">私密</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addOrEditVisible = false">取 消</el-button>
        <el-button type="danger" @click="saveOrUpdateArticle">
          发 表
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">

import {UploadFilled} from '@element-plus/icons-vue'
import {useRoute} from "vue-router";
import {inject, onMounted, ref, watch} from "vue";
import api from "@/api";
import {ProcessInterface} from "@/d.ts/modules/process";
import {MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {OptionInterface} from "@/d.ts/api";

const componentKey = ref(0);
const route = useRoute();
const $process = inject<ProcessInterface>("$process")!;

const addOrEditVisible = ref(false);

const article = ref({
  id: null,
  articleTitle: new Date(),
  categoryId: null,
  categoryName: null,
  articleContent: "",
  articleCover: "",
  articleTop: 0,
  status: 0,
  viewCount: 0,
  createTime: "",
  updateTime: ""
});
const categoryList = ref<Array<OptionInterface>>([]);

onMounted(() => {
  const articleId = Number(route.query.id);
  if (articleId) {
    api.getArticleDetail(articleId).then(({data}) => {
      article.value = data;
    })
  } else {
    const sessionArticle = sessionStorage.getItem("article");
    if (sessionArticle) {
      article.value = JSON.parse(sessionArticle);
    }
  }
})

const listCategories = () => {
  api.getCategoryOption().then(({data}) => {
    categoryList.value = data;
  })
}

const saveArticleDraft = () => {
  $process.tipShow.success("成功");
}

const openModel = () => {
  listCategories();
  addOrEditVisible.value = true;
}

const onUploadImg = () => {

}

const removeCategory = () => {
  article.value.categoryName = null;
}

const searchCategories = () => {

}

const saveCategory = () => {

}

const handleSelectCategories = (item: string) => {
  console.log(item);
  // article.value.categoryName = item.categoryName;
}

const addCategory = (name: string) => {
  console.log(name);
}

const beforeUpload = () => {
  article.value.articleCover = '';
}

const uploadCover = () => {
  article.value.articleCover = '';
}

const saveOrUpdateArticle = () => {

}

watch(() => route.path,
    () => {
      article.value.id = null;
      article.value.articleTitle = new Date();
      article.value.categoryId = null;
      article.value.categoryName = null;
      article.value.articleContent = "";
      article.value.articleCover = "";
      article.value.articleTop = 0;
      article.value.status = 0;
      article.value.viewCount = 0;
      article.value.createTime = "";
      article.value.updateTime = "";
    }
);

</script>

<style scoped lang="scss">

.article-title-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  margin-top: 2.25rem;

  .save-btn {
    margin-left: 0.75rem;
    background: #fff;
    color: #f56c6c;
  }

  .popover-title {
    margin-bottom: 1rem;
    text-align: center;
  }

  .popover-container {
    margin-top: 1rem;
    height: 260px;
    overflow-y: auto;

    .category-item {
      cursor: pointer;
      padding: 0.6rem 0.5rem;
    }

    .category-item:hover {
      background-color: #f0f9eb;
      color: #67c23a;
    }
  }
}

</style>