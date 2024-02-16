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
          @click="openModel(null, MenuTypeEnum.DIR, null)"
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
      <el-table-column label="组件路径" prop="component" width="200" :show-overflow-tooltip="true"></el-table-column>
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
              type="primary" link
              size="small"
              @click="openModel(null, MenuTypeEnum.MENU, scope.row.id)"
              :disabled="scope.row.type != 1"
          >
            <i class="el-icon-plus"/> 新增
          </el-button>
          <el-button type="primary" size="small" @click="openModel(scope.row, scope.row.type, null)">
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
        <!-- 菜单类型 -->
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio :label="1">目录</el-radio>
            <el-radio :label="2">菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 菜单名称 -->
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="formData.name" style="width:220px"/>
        </el-form-item>
        <el-form-item label="上级目录" v-show="formData.type === MenuTypeEnum.MENU" prop="parentId">
          <el-tree-select
              v-model="formData.parentId"
              :data="directoryOptions"
              placeholder="选择上级目录"
          />
        </el-form-item>
        <!-- 组件路径 -->
        <el-form-item label="组件路径" v-show="formData.type === MenuTypeEnum.MENU" prop="component">
          <el-input v-model="formData.component" style="width:220px"/>
        </el-form-item>
        <!-- 权限标识 -->
        <el-form-item label="权限标识" v-show="formData.type === MenuTypeEnum.MENU" prop="permission">
          <el-input v-model="formData.permission" style="width:220px"/>
        </el-form-item>
        <!-- 路由地址 -->
        <el-form-item label="访问路径" prop="path">
          <el-input v-model="formData.path" style="width:220px"/>
        </el-form-item>
        <!-- 显示排序 -->
        <el-form-item label="显示排序" prop="orderNum">
          <el-input-number
              v-model="formData.orderNum"
              controls-position="right"
              :min="0"
              :max="100"
          />
        </el-form-item>
        <!-- 显示状态 -->
        <el-form-item label="显示状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="0">显示</el-radio>
            <el-radio :label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addOrUpdateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditMenu(ruleFormRef)">
          确 定
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";
import {computed, inject, onMounted, ref} from "vue";
import {ProcessInterface} from "@/d.ts/modules/process";
import {CirclePlus, Refresh, Search} from "@element-plus/icons-vue";
import {MenuResp} from "@/d.ts/api/menu";
import api from "@/api";
import {MenuTypeEnum} from "@/config/constant.ts";
import {FormInstance} from "element-plus";

const route = useRoute();
const router = useRouter();
const $process = inject<ProcessInterface>("$process")!;
const ruleFormRef = ref();

const addOrUpdateFormVisible = ref(false);
const addOrUpdateFormTitle = ref<string>("");
const loading = ref(true);

const menuList = ref<Array<MenuResp>>([]);

const menuName = ref<string>("");
const formData = ref({
  id: null as number | null,
  name: "",
  permission: "",
  type: 1,
  orderNum: 0,
  parentId: null as number | null,
  path: "",
  component: "",
  icon: "",
  status: 0
})
const directoryOptions = computed(() => {
  return menuList.value.filter(item => item.type === MenuTypeEnum.DIR).map(item => {
    return {
      value: item.id,
      label: item.name,
    }
  });
})

onMounted(() => {
  listMenus();
})

const listMenus = () => {
  api.listMenus({
    keywords: menuName.value
  }).then(({data}) => {
    menuList.value = data;
    loading.value = false;
  })
}

const openModel = (item: MenuResp | null, type: number, parentId: number | null) => {
  formData.value.type = type;
  if (item != null) {
    addOrUpdateFormTitle.value = "修改";
    const data = {
      id: item.id,
      name: item.name,
      permission: item.permission,
      type: item.type,
      orderNum: item.orderNum,
      parentId: item.parentId,
      path: item.path,
      component: item.component,
      icon: item.icon,
      status: item.status
    }
    if (type === MenuTypeEnum.DIR) {
      formData.value = {...data};
    } else if (type === MenuTypeEnum.MENU) {
      formData.value = {...data};
    }
  } else {
    addOrUpdateFormTitle.value = "新增";
    formData.value = {
      id: null,
      name: "",
      permission: "",
      type: formData.value.type,
      orderNum: 0,
      parentId: parentId,
      path: "",
      component: "Layout",
      icon: "",
      status: 0
    };
  }

  addOrUpdateFormVisible.value = true;
}

const addOrEditMenu = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (formData.value.id == null) {
        // 添加
        api.addMenu({
          name: formData.value.name,
          permission: formData.value.permission,
          type: formData.value.type,
          orderNum: formData.value.orderNum,
          parentId: formData.value.parentId,
          path: formData.value.path,
          component: formData.value.component,
          icon: "icon"
        }).then(() => {
          $process.tipShow.success("添加成功");
          listMenus();
        })
      } else {
        // 修改
        api.updateMenu({
          id: formData.value.id,
          name: formData.value.name,
          permission: formData.value.permission,
          type: formData.value.type,
          orderNum: formData.value.orderNum,
          parentId: formData.value.parentId,
          path: formData.value.path,
          component: formData.value.component,
          icon: "icon"
        }).then(() => {
          $process.tipShow.success("修改成功");
          listMenus();
        })
      }
      addOrUpdateFormVisible.value = false;
    }
  })
}
const deleteMenu = (id: number) => {
  api.deleteMenu(id).then(() => {
    $process.tipShow.success("删除成功");
    listMenus();
  })
}

const changeStatus = (menu: MenuResp) => {

}

const rules = {
  type: [{
    required: true,
    message: '请选择菜单类型',
    trigger: 'change'
  }],
  name: [{
    required: true,
    message: '请输入菜单名称',
    trigger: 'blur'
  }],
  parentId: [{
    required: false,
    message: '请选择上级目录',
    trigger: 'change',
  }],
  component: [{
    required: true,
    message: '请输入组件路径',
    trigger: 'blur',
  }],
  permission: [{
    required: true,
    message: '请输入权限标识',
    trigger: 'blur'
  }],
  path: [{
    required: true,
    message: '请输入访问路径',
    trigger: 'blur'
  }],
  orderNum: [{
    required: true,
    message: '请输入显示排序',
    trigger: 'blur',
    type: 'number',
  }],
  status: [{
    required: true,
    message: '请选择显示状态',
    trigger: 'change'
  }]
};

const refresh = () => {
  loading.value = true;
  listMenus();
  $process.tipShow.success("刷新成功");
}
</script>

<style scoped lang="scss">

</style>