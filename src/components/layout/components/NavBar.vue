<template>
  <div>
    <!-- 导航栏 -->
    <div class="nav-bar">
      <!-- 面包屑导航 -->
      <el-breadcrumb>
        <el-breadcrumb-item v-for="item of breadcrumbList" :key="item.path">
          <span v-if="item.redirect">{{ item.name }}</span>
          <router-link v-else :to="item.path">{{ item.name }}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 右侧菜单 -->
      <div class="right-menu">
        <!-- 全屏按钮 -->
        <div class="screen-full" @click="fullScreen">
          <i class="iconfont el-icon-myicwindowzoom48px" />
        </div>
        <!-- 用户选项 -->
        <el-dropdown @command="handleCommand">
          <el-avatar :size="40" :src="store.avatar" />
          <i class="el-icon-caret-bottom" />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="setting">
              <i class="el-icon-s-custom" />个人中心
            </el-dropdown-item>
            <el-dropdown-item command="logout" divided>
              <i class="iconfont el-icon-mytuichu" />退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 历史标签栏 -->
    <div class="tabs-view-container">
      <div class="tabs-wrapper">
        <span
            :class="isActive(item)"
            v-for="item of store.tabList"
            :key="item.path"
            @click="goTo(item)"
        >
          {{ item.name }}
          <i
              class="el-icon-close"
              v-if="item.path != '/'"
              @click.stop="removeTab(item)"
          />
        </span>
      </div>
      <div class="tabs-close-item" style="float:right" @click="closeAllTab">
        全部关闭
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {resetRouter} from '@/router';
import {useStore} from "@/store";
import {RouteLocationMatched, useRoute, useRouter} from "vue-router";

const store = useStore();
const router = useRouter();
const route = useRoute();

// const isSearch = ref(false);
const fullscreen = ref(false);
const breadcrumbList = ref<Array<RouteLocationMatched>>([]);


onMounted(() => {
  let matched: RouteLocationMatched[] = router.currentRoute.value.matched.filter(item => item.name) as RouteLocationMatched[];
  const first = matched[0];
  if (first && first.name !== '首页') {
    matched = [{ path: '/', name: '首页' }, ...matched];
  }
  breadcrumbList.value = matched;
  store.saveTab(router.currentRoute.value);
});

const goTo = (tab: RouteLocationMatched) => {
  router.push({ path: tab.path });
};

const removeTab = (tab: RouteLocationMatched) => {
  store.removeTab(tab);
  if (tab.path === route.path) {
    const tabList = store.tabList;
    router.push({ path: tabList[tabList.length - 1].path });
  }
};

const trigger = () => {
  store.trigger();
};

const handleCommand = (command: string) => {
  if (command === 'setting') {
    router.push({ path: '/setting' });
  }
  if (command === 'logout') {
    console.log("注销");
    store.logout();
    store.resetTab();
    // resetRouter();
    router.push({ path: '/login' });
  }
};

const closeAllTab = () => {
  store.resetTab();
  router.push({ path: '/' });
};

const fullScreen = () => {
  let element = document.documentElement;
  if (fullscreen.value) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }
  fullscreen.value = !fullscreen.value;
};

const isActive = (tab: RouteLocationMatched) => {
  return tab.path === route.path ? 'tabs-view-item-active' : 'tabs-view-item';
};

const isFold = () => {
  return store.collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold';
};
</script>

<style scoped lang="scss">

.nav-bar {
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-right: 30px;
  height: 50px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hambuger-container {
    font-size: 1.25rem;
    cursor: pointer;
    margin-right: 24px;
  }

  .right-menu {
    margin-left: auto;
    display: flex;
    align-items: center;

    .screen-full {
      cursor: pointer;
      margin-right: 1rem;
      font-size: 1.25rem;
    }
  }

}

.tabs-view-container {
  display: flex;
  position: relative;
  padding-left: 10px;
  padding-right: 10px;
  height: 33px;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tabs-wrapper {
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    width: 95%;
  }

  .tabs-close-item {
    position: absolute;
    right: 10px;
    display: inline-block;
    cursor: pointer;
    height: 25px;
    line-height: 25px;
    border: 1px solid #d8dce5;
    color: #495060;
    background: #fff;
    padding: 0 8px;
    font-size: 12px;
    margin-top: 4px;
    margin-left: 5px;

  }

  .tabs-view-item {
    display: inline-block;
    cursor: pointer;
    height: 25px;
    line-height: 25px;
    border: 1px solid #d8dce5;
    color: #495060;
    background: #fff;
    padding: 0 8px;
    font-size: 12px;
    margin-top: 4px;
    margin-left: 5px;
  }

  .tabs-view-item-active {
    display: inline-block;
    cursor: pointer;
    height: 26px;
    line-height: 26px;
    padding: 0 8px;
    font-size: 12px;
    margin-top: 4px;
    margin-left: 5px;
    background-color: #42b983;
    color: #fff;
    border-color: #42b983;
  }
  .tabs-view-item-active:before {
    content: "";
    background: #fff;
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: relative;
    margin-right: 2px;
  }
}

*::-webkit-scrollbar {
  width: 0.5rem;
  height: 6px;
}
*::-webkit-scrollbar-thumb {
  border-radius: 0.5rem;
  background-color: rgba(144, 147, 153, 0.3);
}

</style>