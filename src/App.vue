<template>
  <router-view v-slot="{ Component }">
    <template v-if="Component">
      <Suspense>
        <component :is="Component"/>
      </Suspense>
    </template>
  </router-view>
</template>

<script setup lang="ts">

import {onBeforeMount} from "vue";
import {generaMenu} from "@/utils/menu.ts";

onBeforeMount(() => {
  generaMenu();
})

</script>

<style scoped>

</style>
