<template>
  <div class="index">
    <el-container class="layout-container">
      <!-- 导航栏 -->
      <el-aside width="auto">
        <SideBar :user-menu-list="store.userMenuList"/>
      </el-aside>
      <el-container class="main-container">
        <el-header height="84px" style="padding:0">
          <NavBar :key="$route.fullPath"/>
        </el-header>
        <!-- 内容 -->
        <el-main style="background:#F7F9FB">
          <div class="fade-transform-box">
            <router-view v-slot="{ Component }">
              <transition name="fade-transform" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">

import NavBar from "@/components/layout/components/NavBar.vue";
import SideBar from "@/components/layout/components/SideBar.vue";
import {useStore} from "@/store";

const store = useStore();
</script>

<style scoped lang="scss">

.index {


  .layout-container {

    .main-container {
      transition: margin-left 0.45s;
      margin-left: 210px;
      min-height: 100vh;

      .fade-transform-box {
        position: relative;
        top: 0;
        bottom: 0;
        width: 100%;
        overflow: hidden;
      }
    }

  }
}


.hideSideBar {
  margin-left: 64px;
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s ease 0s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}


</style>