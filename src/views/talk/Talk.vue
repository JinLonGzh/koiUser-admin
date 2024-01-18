<template>
  <el-card class="main-card">
    <div class="title">{{ route.name }}</div>
    <div class="talk-container">
      <MdEditor
          ref="md"
          v-model="talk.content"
          @onUploadImg="onUploadMdImg"
      />
      <!-- 操作菜单 -->
      <div class="operation-wrapper">
        <div class="left-wrapper">
          <!-- 图片上传 -->
          <el-upload
              action="/api/admin/talks/images"
              multiple
              :before-upload="beforeUpload"
              :on-success="upload"
              :show-file-list="false"
          >
            <el-icon class="operation-btn">
              <upload-filled/>
            </el-icon>
          </el-upload>
        </div>
        <div class="right-wrapper">
          <!-- 是否置顶 -->
          <el-switch
              style="margin-right:16px"
              v-model="talk.talkTop"
              inactive-text="置顶"
              :active-value="1"
              :inactive-value="0"
          />
          <!-- 说说状态 -->
          <el-dropdown
              trigger="click"
              @command="handleCommand"
              style="margin-right:16px"
          >
            <span class="talk-status">
              {{ dropdownTitle }}
              <el-icon class="el-icon--right">
                <arrow-down/>
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                    v-for="(item, index) of statusList"
                    :key="index"
                    :command="item.status"
                >
                  {{ item.desc }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button
              type="primary"
              size="default"
              @click="saveOrUpdateTalk"
              :disabled="talk.content == ''"
          >
            发布
          </el-button>
        </div>
      </div>
      <!-- 图片上传 -->
      <el-upload
          class="talk-image-upload"
          v-show="uploadList.length > 0"
          action="/api/admin/talks/images"
          list-type="picture-card"
          :file-list="uploadList"
          multiple
          :before-upload="beforeUpload"
          :on-success="upload"
          :on-remove="handleRemove"
      >
        <el-icon>
          <Plus/>
        </el-icon>
      </el-upload>
    </div>
  </el-card>

</template>

<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";
import {MdEditor} from "md-editor-v3";
import 'md-editor-v3/lib/style.css';
import api from "@/api";
import {computed, inject, onMounted, ref} from "vue";
import {UploadFilled, ArrowDown, Plus} from "@element-plus/icons-vue";
import {UploadUserFile} from "element-plus";
import {ProcessInterface} from "@/d.ts/modules/process";
import {useStore} from "@/store";

const route = useRoute();
const router = useRouter();
const store = useStore();
const $process = inject<ProcessInterface>("$process")!;

const talk = ref({
  id: null as number | null,
  content: "",
  imageList: [],
  talkTop: 0,
  status: 0,
  viewCount: 0,
  createTime: null as string | null,
  updateTime: null as string | null,
});
const uploadList = ref<Array<UploadUserFile>>([]);
const statusList = ref([
  {status: 0, desc: "公开"},
  {status: 1, desc: "私密"}
])

onMounted(() => {
  const talkId = Number(route.query.id);
  if (talkId) {
    api.getTalkDetail(talkId).then(({data}) => {
      talk.value = data;
      if (talk.value.imageList.length > 0) {
        talk.value.imageList.forEach(item => {
          uploadList.value.push({
            name: new Date().toDateString(),
            url: item
          });
        });
      }
    })
  }
})

const onUploadMdImg = () => {

}

const beforeUpload = (rawFile: any) => {
  console.log(rawFile.size);
}

const upload = (response: any) => {
  console.log(response.data)
}

const handleCommand = (command: number) => {
  talk.value.status = command;
}

const saveOrUpdateTalk = () => {
  if (talk.value.id) {
    // 更新
    api.updateTalk({
      id: talk.value.id,
      content: talk.value.content,
      images: JSON.stringify(uploadList.value.map(item => item.url)),
      talkTop: talk.value.talkTop,
      status: talk.value.status,
    }).then(() => {
      $process.tipShow.success("更新成功");
      afterPublish();
    })
  } else {
    // 创建
    api.addTalk({
      content: talk.value.content,
      images: JSON.stringify(uploadList.value.map(item => item.url)),
      talkTop: talk.value.talkTop,
      status: talk.value.status,
    }).then(() => {
      $process.tipShow.success("发布成功");
      afterPublish();
    })
  }
}

const afterPublish = () => {
  if (talk.value.id === null) {
    store.removeTab("发布说说");
  } else {
    store.removeTab("修改文章");
  }
  router.push({path: "/talk-list"});
}

const handleRemove = (file: UploadUserFile) => {
  uploadList.value.forEach((item, index) => {
    if (item.url == file.url) {
      uploadList.value.splice(index, 1);
    }
  });
}

const dropdownTitle = computed(() => {
  let desc = "";
  statusList.value.forEach(item => {
    if (item.status == talk.value.status) {
      desc = item.desc;
    }
  });
  return desc;
})

</script>

<style scoped lang="scss">

.talk-container {
  margin-top: 40px;

  .operation-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;

    .left-wrapper {
      display: flex;
      width: 50%;

      .operation-btn {
        cursor: pointer;
        color: #838383;
        font-size: 20px;
        margin-right: 12px;
      }
    }

    .right-wrapper {
      display: flex;
      width: 50%;
      justify-content: flex-end;
      align-items: center;

      .talk-status {
        cursor: pointer;
        font-size: 14px;
      }
    }
  }

  .talk-image-upload {
    margin-top: 8px;
  }
}

</style>