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

</script>

<style scoped>

</style>
