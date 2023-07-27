<script setup lang="ts">
import { onMounted, provide, ref } from 'vue';
import * as Cesium from 'cesium';
const slotShow = ref(false);
onMounted(() => {
  // 设置地球默认区域为中国
  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
    90,
    -20,
    110,
    90
  );
  // 初始化viewer
  const viewer = new Cesium.Viewer('cesiumContainer', {
    orderIndependentTranslucency: false,
    contextOptions: {
      webgl: {
        alpha: true,
      }
    },
  });
  // 背景透明
  viewer.scene.skyBox.show = false;
  viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);

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
