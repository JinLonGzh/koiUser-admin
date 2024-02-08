<template>
  <el-card class="main-card" style="height: 100vh">
    <!-- 标题 -->
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
      <el-tooltip effect="dark" content="刷新" placement="top">
        <el-button size="small" circle :icon="Refresh" @click="refresh"/>
      </el-tooltip>
      <!-- 条件筛选 -->
      <div style="margin-left:auto">
        <!-- 参数名 -->
        <el-input
            clearable
            v-model="menuName"
            :prefix-icon="Search"
            size="small"
            placeholder="请输入菜单名"
            style="margin-right:1rem;width: 180px;"
            @keyup.enter.native="listMenus"
        />
        <el-button
            type="primary"
            size="small"
            :icon="Search"
            @click="listMenus"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 权限列表 -->
    <el-table
        v-loading="loading"
        :data="menuList"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="菜单名" prop="name" width="160" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="权限标识" prop="permission"></el-table-column>
      <el-table-column label="菜单类型" prop="type">
        <template #default="scope">
          <el-tag type="info" v-show="scope.row.type === MenuTypeEnum.DIR">目录</el-tag>
          <el-tag type="success" v-show="scope.row.type === MenuTypeEnum.MENU">菜单</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="orderNum"></el-table-column>
      <el-table-column label="访问路径" prop="path" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="组件名称" prop="component" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="状态" prop="status" width="80">
        <template #default="scope">
          <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#F4F4F5"
              :active-value="0"
              :inactive-value="1"
              @change="changeStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <!-- 创建时间 -->
      <el-table-column prop="createTime" label="创建时间" align="center" width="200">
        <template #default="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <!-- 更新时间 -->
      <el-table-column prop="updateTime" label="更新时间" align="center" width="200">
        <template #default="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column fixed="right" label="操作" align="center" width="200">
        <template #default="scope">
          <el-button
              type="text"
              size="small"
              @click="openModel(scope.row, 1)"
              :disabled="scope.row.type != 1"
          >
            <i class="el-icon-plus" /> 新增
          </el-button>
          <el-button type="primary" size="small" @click="openModel(scope.row)">
            编辑
          </el-button>
          <el-popconfirm
              title="确定删除吗？"
              style="margin-left:10px"
              @confirm="deleteMenu(scope.row.id)"
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
    <!-- 添加或更新对话框 -->
    <el-dialog v-model="addOrUpdateFormVisible" :title="addOrUpdateFormTitle" width="30%">
      <el-form label-width="80px" size="default" :model="formData" :rules="rules" ref="ruleFormRef">

      </el-form>
    </el-dialog>

  </el-card>
</template>

<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";
import {inject, onMounted, ref} from "vue";
import {ProcessInterface} from "@/d.ts/modules/process";
import {CirclePlus, Refresh, Search} from "@element-plus/icons-vue";
import {MenuResp} from "@/d.ts/api/menu";
import api from "@/api";
import {MenuTypeEnum} from "@/config/constant.ts";

const route = useRoute();
const router = useRouter();
const $process = inject<ProcessInterface>("$process")!;

const addOrUpdateFormVisible = ref(false);
const addOrUpdateFormTitle = ref<string>("");
const loading = ref(true);

const menuList = ref<Array<MenuResp>>([]);

const menuName = ref<string>("");
const formData = ref({

})

onMounted(() => {
  listMenus();
})

const listMenus = () => {
  api.listMenus({
    keywords: menuName.value
  }).then(({ data }) => {
    menuList.value = data;
    loading.value = false;
  })
}

const openModel = (item: MenuResp | null, type: number) => {
  if (item != null) {
    addOrUpdateFormTitle.value = "修改菜单";

  } else {
    addOrUpdateFormTitle.value = "添加菜单";

  }
  addOrUpdateFormVisible.value = true;
}

const deleteMenu = (id: number) => {

}

const changeStatus = (menu: MenuResp) => {

}

const rules = {

}

const refresh = () => {
  loading.value = true;
  listMenus();
  $process.tipShow.success("刷新成功");
}
</script>

<style scoped lang="scss">

</style>