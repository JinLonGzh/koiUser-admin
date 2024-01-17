<template>
  <el-card class="main-card">
    <div class="title">{{ route.name }}</div>
    <!-- 文章状态 -->
    <div class="status-menu">
      <span>状态</span>
      <span @click="changeStatus('ALL')" :class="isActive('ALL')">全部</span>
      <span @click="changeStatus('ENABLE')" :class="isActive('ENABLE')">公开</span>
      <span @click="changeStatus('DISABLE')" :class="isActive('DISABLE')">私密</span>
      <!-- 刷新按钮 -->
      <el-tooltip effect="dark" content="刷新" placement="top">
        <el-button size="small" circle :icon="Refresh" @click="refresh"/>
      </el-tooltip>
    </div>
    <el-empty v-if="talkList.length == 0" description="暂无说说"/>
    <!-- 说说列表 -->
    <div class="talk-item" v-for="item of talkList" :key="item.id">
      <!-- 时间 -->
      <div class="time">
        <span>创建时间：{{ item.createTime }} </span>
        <span class="separator">|</span>
        <span>更新时间：{{ item.updateTime }}</span>
        <span class="separator">|</span>
        <span>浏览量：{{ item.viewCount }}</span>
        <span class="top" v-if="item.talkTop == 1">
          <el-icon><Star/></el-icon> 置顶
        </span>
        <span class="secret" v-if="item.status == 1">
          <el-icon><Lock/></el-icon> 私密
        </span>
      </div>
      <!-- 操作 -->
      <div class="operation">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="dropdown-link">
            <el-icon><More/></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="'1,' + item.id">
                <el-icon>
                  <Edit/>
                </el-icon>
                编辑
              </el-dropdown-item>
              <el-dropdown-item :command="'2,' + item.id">
                <el-icon>
                  <Delete/>
                </el-icon>
                删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- 说说信息 -->
      <MdPreview class="talk-content" :modelValue="item.content" />
      <!-- 图片列表 -->
      <el-row :gutter="4" class="talk-images" v-if="item.imageList">
        <el-col
            :md="8"
            :cols="6"
            v-for="(img, index) of item.imageList"
            :key="index"
        >
          <el-image
              class="images-items"
              :src="img"
              :preview-src-list="previewList"
          />
        </el-col>
      </el-row>
    </div>
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
    <!-- 删除对话框 -->
    <el-dialog v-model="deleteFormVisible" width="30%">
      <template #header="{ close, titleId, titleClass }">
        <el-icon>
          <Warning style="color:#ff9900"/>
        </el-icon>
        提示
      </template>
      <div style="font-size:1rem">是否删除该说说？</div>
      <template #footer>
        <el-button @click="deleteFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteTalk">
          确 定
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">

import {More, Refresh, Warning, Edit, Delete, Star, Lock} from '@element-plus/icons-vue';
import { MdPreview } from 'md-editor-v3';
import {useRoute, useRouter} from "vue-router";
import {ProcessInterface} from "@/d.ts/modules/process";
import {inject, onMounted, ref, watch} from "vue";
import {TalkDataInterface} from "@/d.ts/api/talk";
import api from "@/api";
import {CommonStatusEnum} from "@/config/constant.ts";

const route = useRoute();
const router = useRouter();
const $process = inject<ProcessInterface>("$process")!;

const activeStatus = ref("ALL");
const deleteFormVisible = ref(false);

const talkList = ref<Array<TalkDataInterface>>([]);
const previewList = ref<string[]>([]);

const status = ref<number | null>(null);
const talkId = ref<number | null>(null);

const pageNo = ref(1);
const pageSize = ref(10);
const count = ref(0);

onMounted(() => {
  listTalkPage();
})

const listTalkPage = () => {
  api.pageTalk({
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    status: status.value
  }).then(({data}) => {
    talkList.value = data.list;
    count.value = data.total;
    talkList.value.forEach(item => {
      if (item.imageList) {
        previewList.value.push(...item.imageList);
      }
    });
  });
};

const changeStatus = (key: string) => {
  switch (key) {
    case "ALL":
      status.value = null;
      break;
    case "ENABLE":
      status.value = CommonStatusEnum.ENABLE
      break;
    case "DISABLE":
      status.value = CommonStatusEnum.DISABLE;
      break;
  }
  pageNo.value = 1;
  activeStatus.value = key;
}
const isActive = (key: string) => {
  return activeStatus.value == key ? "active-status" : "status";
}

watch([status], () => {
  pageNo.value = 1;
  listTalkPage();
});

const deleteTalk = () => {
  if (talkId.value) {
    api.deleteTalk(talkId.value).then(() => {
      listTalkPage();
      deleteFormVisible.value = false;
      $process.tipShow.success("删除成功");
    })
  }
}

const pageSizeChange = (size: number) => {
  pageSize.value = size;
  listTalkPage();
}

const pageNoChange = (current: number) => {
  pageNo.value = current;
  listTalkPage();
}


const refresh = () => {
  listTalkPage();
  $process.tipShow.success("刷新成功");
}

const handleCommand = (command: string) => {
  let arr = command.split(",");
  talkId.value = Number(arr[1]);
  switch (arr[0]) {
    case "1":
      router.push({
        path: "/update-talk",
        query: {
          id: talkId.value
        }
      });
      break;
    case "2":
      deleteFormVisible.value = true;
      break;
  }
}

</script>

<style scoped lang="scss">

.status-menu {
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

.talk-item {
  padding: 16px 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 3px 8px 6px rgb(7 17 27 / 6%);
  transition: all 0.3s ease 0s;

  &:hover {
    box-shadow: 0 5px 10px 8px rgba(7, 17, 27, 0.16);
    transform: translateY(-3px);
  }

  &:not(:first-child) {
    margin-top: 20px;
  }

  .operation {
    display: flex;
    align-items: center;
    justify-content: right;

    .dropdown-link {
      margin-top: 10px;
      cursor: pointer;
      color: var(--el-color-primary);
      display: flex;
      align-items: center;
    }
  }

  .time {
    color: #999;
    margin-top: 2px;
    font-size: 12px;

    .top {
      color: #ff7242;
      margin-left: 10px;
    }

    .secret {
      color: #999;
      margin-left: 10px;
    }
  }

  .talk-content {
    margin-top: 8px;
    font-size: 14px;
    white-space: pre-line;
    word-wrap: break-word;
    word-break: break-all;
  }

  .talk-images {
    margin-top: 8px;

    .images-items {
      cursor: pointer;
      object-fit: cover;
      height: 200px;
      border-radius: 4px;
    }
  }
}

</style>