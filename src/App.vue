<script setup lang="ts">
import { onMounted } from 'vue';
import { Viewer } from 'cesium';
onMounted(() => {
  const viewer = new Viewer('cesiumContainer', { infoBox: false });
  console.log(viewer);
});
</script>

<template>
  <div id="cesiumContainer"></div>
</template>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
