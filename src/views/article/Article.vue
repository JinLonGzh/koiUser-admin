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
          @click="saveOrUpdateArticleDraft"
          v-if="article.id == null || article.status === ArticleStatusEnum.DRAFT"
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
        @onUploadImg="onUploadMdImg"
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
              title="分类"
              v-if="!article.categoryName"
          >
            <!-- 分类 -->
            <div class="popover-container">
              <div
                  v-for="item of categoryList"
                  :key="item.id"
                  class="category-item"
                  @click="addCategory(item)"
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
              :show-file-list="false"
              drag
              action="/admin-api/system/file/upload-cover"
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
import {useRoute, useRouter} from "vue-router";
import {inject, onMounted, ref, watch} from "vue";
import api from "@/api";
import {ProcessInterface} from "@/d.ts/modules/process";
import {MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {CommonResult, OptionInterface} from "@/d.ts/api";
import {ArticleStatusEnum} from "@/config/constant.ts";
import {useStore} from "@/store";
import axios from "axios";

const componentKey = ref(0);
const route = useRoute();
const router = useRouter();
const store = useStore();
const $process = inject<ProcessInterface>("$process")!;

const addOrEditVisible = ref(false);
const autoSave = ref(false);

const article = ref({
  id: null as number | null,
  articleTitle: "",
  categoryId: null as number | null,
  categoryName: null as string | null,
  articleContent: "",
  articleCover: "" as string,
  articleTop: 0,
  status: 0,
  viewCount: 0,
  createTime: null as string | null,
  updateTime: null as string | null
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
  api.getCategoryOption({
    keywords: null
  }).then(({data}) => {
    categoryList.value = data;
  })
}

const saveOrUpdateArticleDraft = () => {
  if (article.value.articleTitle.trim() == "") {
    $process.tipShow.error("文章标题不能为空");
    return false;
  }
  if (article.value.articleContent.trim() == "") {
    $process.tipShow.error("文章内容不能为空");
    return false;
  }
  article.value.status = ArticleStatusEnum.DRAFT;
  if (article.value.id == null) {
    // 添加
    api.addArticle({
      articleTitle: article.value.articleTitle,
      categoryId: article.value.categoryId,
      articleCover: article.value.articleCover,
      articleContent: article.value.articleContent,
      articleTop: article.value.articleTop,
      articleStatus: article.value.status
    }).then(() => {
      $process.tipShow.success("保存草稿成功");
      afterPublish();
    })
  } else {
    // 更新
    console.log("更新草稿");
  }

}

const saveOrUpdateArticle = () => {
  if (article.value.articleTitle.trim() == "") {
    $process.tipShow.error("文章标题不能为空");
    return false;
  }
  if (article.value.articleContent.trim() == "") {
    $process.tipShow.error("文章内容不能为空");
    return false;
  }
  if (article.value.categoryId == null) {
    $process.tipShow.error("文章分类不能为空");
    return false;
  }
  if (article.value.articleCover.trim() == "") {
    $process.tipShow.error("文章封面不能为空");
    return false;
  }
  if (article.value.id == null) {
    // 添加
    api.addArticle({
      articleTitle: article.value.articleTitle,
      categoryId: article.value.categoryId,
      articleCover: article.value.articleCover,
      articleContent: article.value.articleContent,
      articleTop: article.value.articleTop,
      articleStatus: article.value.status
    }).then(() => {
      $process.tipShow.success("发表文章成功");
      afterPublish();
    })
  } else {
    // 更新
    api.updateArticle({
      id: article.value.id,
      articleTitle: article.value.articleTitle,
      categoryId: article.value.categoryId,
      articleCover: article.value.articleCover,
      articleContent: article.value.articleContent,
      articleTop: article.value.articleTop,
      articleStatus: article.value.status
    }).then(() => {
      $process.tipShow.success("更新文章成功");
      afterPublish();
    })
  }

}

const afterPublish = () => {
  if (article.value.id === null) {
    store.removeTab("发布文章");
  } else {
    store.removeTab("修改文章");
  }
  sessionStorage.removeItem("article");
  router.push({path: "/article-list"});
}

const openModel = () => {
  listCategories();
  addOrEditVisible.value = true;
}

const onUploadMdImg = async (files: any, callback: any) => {
  const res = await Promise.all(
      files.map((file: any) => {
        return new Promise((rev, rej) => {
          const form = new FormData();
          form.append('file', file);

          axios
              .post('/admin-api/system/file/upload-md', form, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
              .then((res) => rev(res))
              .catch((error) => rej(error));
        });
      })
  );

  callback(res.map((item) => {
    return item.data.data;
  }));
};

const removeCategory = () => {
  article.value.categoryName = null;
}

const addCategory = (category: OptionInterface) => {
  article.value.categoryId = category.id;
  article.value.categoryName = category.name;
}

const beforeUpload = () => {

}

const uploadCover = (response: CommonResult) => {
  console.log(response);
  article.value.articleCover = response.data;
}

watch(() => route.path,
    () => {
      article.value.id = null;
      article.value.articleTitle = "";
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


</style>