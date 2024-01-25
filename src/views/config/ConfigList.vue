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
          :disabled="configIdList.length == 0"
          @click="deleteFormVisible = true"
      >
        批量删除
      </el-button>
      <el-tooltip effect="dark" content="刷新" placement="top">
        <el-button size="small" circle :icon="Refresh" @click="refresh"/>
      </el-tooltip>
      <!-- 条件筛选 -->
      <div style="margin-left:auto">
        <!-- 参数名 -->
        <el-input
            clearable
            v-model="configName"
            :prefix-icon="Search"
            size="small"
            placeholder="请输入配置名"
            style="margin-right:1rem;width: 180px;"
            @keyup.enter.native="searchConfigs"
        />
        <!-- 类型 -->
        <el-select
            clearable
            size="small"
            v-model="configType"
            filterable
            placeholder="请选择类型"
            style="margin-right:1rem;width: 180px;"
        >
          <el-option
              key="0"
              label="系统内置"
              value="0"
          />
          <el-option
              key="0"
              label="外部添加"
              value="1"
          />
        </el-select>
        <el-button
            type="primary"
            size="small"
            :icon="Search"
            @click="searchConfigs"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 表格展示 -->
    <el-table
        border
        :data="configList"
        @selection-change="selectionChange"
        v-loading="loading"
    >
      <!-- 表格列 -->
      <el-table-column type="selection" width="55"/>
      <!-- 配置键名 -->
      <el-table-column prop="configName" label="配置键名" align="center"/>
      <!-- 配置键 -->
      <el-table-column prop="configKey" label="配置键" align="center"/>
      <!-- 配置值 -->
      <el-table-column prop="configValue" label="配置值" align="center"/>
      <!-- 配置类型 -->
      <el-table-column prop="configType" label="配置类型" align="center">
        <template #default="scope">
          <el-tag type="danger" v-show="scope.row.configType === 0">系统内置</el-tag>
          <el-tag type="success" v-show="scope.row.configType === 1">外部添加</el-tag>
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
      <el-table-column fixed="right" label="操作" align="center" width="150">
        <template #default="scope">
          <el-button type="primary" size="small" @click="openModel(scope.row)">
            编辑
          </el-button>
          <el-popconfirm
              title="确定删除吗？"
              style="margin-left:10px"
              @confirm="deleteConfig(scope.row.id)"
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
    <!-- 添加或更新对话框 -->
    <el-dialog v-model="addOrUpdateFormVisible" :title="addOrUpdateFormTitle" width="30%">
      <el-form label-width="80px" size="default" :model="formData" :rules="rules" ref="ruleFormRef">
        <el-form-item label="配置名称" prop="configName">
          <el-input v-model="formData.configName" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="配置键名" prop="configKey">
          <el-input v-model="formData.configKey" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="配置值" prop="configValue">
          <el-input v-model="formData.configValue" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="配置类型" prop="configType">
          <el-radio-group v-model="formData.configType">
            <el-radio :label="0">系统内置</el-radio>
            <el-radio :label="1">外部添加</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addOrUpdateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditConfig(ruleFormRef)">
          确 定
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">

import {Search, Warning, Refresh, UploadFilled, CirclePlus, Delete} from '@element-plus/icons-vue'
import {useRoute, useRouter} from "vue-router";
import {inject, onMounted, ref, watch} from "vue";
import api from "@/api";
import {ProcessInterface} from "@/d.ts/modules/process";
import {WebsiteConfig} from "@/d.ts/api/websiteConfig";
import {FormInstance} from "element-plus";

const route = useRoute();
const router = useRouter();
const $process = inject<ProcessInterface>("$process")!;
const ruleFormRef = ref<FormInstance>()

const deleteFormVisible = ref(false);
const addOrUpdateFormVisible = ref(false);
const addOrUpdateFormTitle = ref<string>("");
const loading = ref(true);

const configList = ref<Array<WebsiteConfig>>([]);
const configIdList = ref<Array<number>>([]);

const configName = ref(null);
const configType = ref<number | null>(null);
const formData = ref({
  id: null as number | null,
  configName: "",
  configKey: "",
  configValue: "",
  configType: 0,
})

const pageNo = ref(1);
const pageSize = ref(10);
const count = ref(0);

onMounted(() => {
  listConfigPage();
})

const listConfigPage = () => {
  api.getConfigPage({
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    configName: configName.value,
    configType: configType.value
  }).then(({data}) => {
    configList.value = data.list;
    count.value = data.total;
    loading.value = false;
  })
}

const openModel = (item: WebsiteConfig | null) => {
  if (item != null) {
    addOrUpdateFormTitle.value = "修改分类";
    formData.value = JSON.parse(JSON.stringify(item));
  } else {
    addOrUpdateFormTitle.value = "添加分类";
    formData.value.id = null;
    formData.value.configName = "";
    formData.value.configKey = "";
    formData.value.configValue = "";
    formData.value.configType = 0;
  }
  addOrUpdateFormVisible.value = true;
}

const selectionChange = () => {
  configIdList.value = [];
  configList.value.forEach(item => {
    configIdList.value.push(item.id);
  });
}

const searchConfigs = () => {
  pageNo.value = 1;
  listConfigPage();
}

const deleteConfig = (id: number) => {
  if (id != null) {
    api.deleteConfig(id).then(() => {
      listConfigPage();
      $process.tipShow.success("删除成功");
    })
  }
}

const addOrEditConfig = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (formData.value.id == null) {
        // 添加
        api.addConfig({
          configName: formData.value.configName,
          configKey: formData.value.configKey,
          configValue: formData.value.configValue,
          configType: formData.value.configType,
        }).then(() => {
          listConfigPage();
          $process.tipShow.success("添加成功");
        })
      } else {
        // 修改
        api.updateConfig({
          id: formData.value.id,
          configName: formData.value.configName,
          configKey: formData.value.configKey,
          configValue: formData.value.configValue,
          configType: formData.value.configType,
        }).then(() => {
          listConfigPage();
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
  configName: [
    {required: true, message: '请输入配置名称', trigger: 'blur'},
  ],
  configKey: [
    {required: true, message: '请输入配置键名', trigger: 'blur'},
  ],
  configValue: [
    {required: true, message: '请输入配置值', trigger: 'blur'},
  ],
  configType: [
    {required: true, message: '请选择配置类型', trigger: 'change'},
  ],
};


watch([configName, configType], () => {
  pageNo.value = 1;
  listConfigPage();
});

const pageSizeChange = (size: number) => {
  pageSize.value = size;
  listConfigPage();
}

const pageNoChange = (current: number) => {
  pageNo.value = current;
  listConfigPage();
}

const refresh = () => {
  loading.value = true;
  listConfigPage();
  $process.tipShow.success("刷新成功");
}
</script>

<style scoped lang="scss">

.Config-status-menu {
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