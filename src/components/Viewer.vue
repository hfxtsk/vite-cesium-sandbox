<script setup lang="ts">
import { onMounted, provide, ref } from 'vue';
import * as Cesium from 'cesium';
const slotShow = ref(false);
onMounted(() => {
  // 初始化viewer
  const viewer = new Cesium.Viewer('cesiumContainer', {});
  // 将viewer传递给子组件
  provide('viewer', viewer);
  // 加载子组件
  slotShow.value = true;
});
</script>

<template>
  <div id="cesiumContainer"></div>
  <slot v-if="slotShow"></slot>
</template>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
