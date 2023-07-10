<script setup lang="ts">
import { inject, reactive, onUnmounted } from 'vue';
import * as Cesium from 'cesium';
import * as dat from 'dat.gui';

const options = reactive({
  geocoder: true, // 查找位置
  homeButton: true, // 首页位置
  sceneModePicker: true, // 视角的模式
  baseLayerPicker: true, // 图层选择器
  navigationHelpButton: true, // 导航帮助
  animation: true, // 动画器件
  creditDisplay: true, // 版权
  timeline: true, // 时间轴
  fullscreen: true // 全屏
});

const viewer = inject('viewer') as Cesium.Viewer;

const gui = new dat.GUI();
gui.domElement.style = 'position:absolute;top:10px;left:10px;';

// 查找位置
gui
  .add(options, 'geocoder')
  .name('查找位置')
  .onFinishChange((value: boolean) => {
    const geocoder = viewer!.geocoder.container as HTMLElement;
    geocoder!.style.display = value ? 'inline-block' : 'none';
  });

// 首页按钮，点击之后将视图跳转到默认全球视角
gui
  .add(options, 'homeButton')
  .name('首页')
  .onChange((value: boolean) => {
    const homeButton = viewer!.homeButton.container.querySelector(
      '.cesium-home-button'
    ) as HTMLElement;
    homeButton!.style.display = value ? 'inline-block' : 'none';
  });

// 视角的模式
gui
  .add(options, 'sceneModePicker')
  .name('视角模式')
  .onChange((value: boolean) => {
    const sceneModePicker = viewer!.sceneModePicker.container.querySelector(
      '.cesium-sceneModePicker-wrapper'
    ) as HTMLElement;
    sceneModePicker!.style.display = value ? 'inline-block' : 'none';
  });

// 图层选择器
gui
  .add(options, 'baseLayerPicker')
  .name('图层选择')
  .onChange((value: boolean) => {
    const baseLayerPicker = (
      viewer!.baseLayerPicker.container.querySelector(
        '.cesium-baseLayerPicker-selected'
      ) as HTMLElement
    )?.parentElement;
    baseLayerPicker!.style.display = value ? 'inline-block' : 'none';
  });

// 导航帮助
gui
  .add(options, 'navigationHelpButton')
  .name('导航帮助')
  .onChange((value: boolean) => {
    const navigationHelpButton =
      viewer!.navigationHelpButton.container.querySelector(
        '.cesium-navigationHelpButton-wrapper'
      ) as HTMLElement;
    navigationHelpButton!.style.display = value ? 'inline-block' : 'none';
  });

// 动画器件
gui
  .add(options, 'animation')
  .name('动画器件')
  .onChange((value: boolean) => {
    const animation = viewer!.animation.container as HTMLElement;
    animation!.style.display = value ? 'inline-block' : 'none';
  });

// 展示商标版权和数据归属
gui
  .add(options, 'creditDisplay')
  .name('版权')
  .onFinishChange((value: boolean) => {
    viewer!.creditDisplay.container.style.display = value
      ? 'inline-block'
      : 'none';
  });

// 时间轴
gui
  .add(options, 'timeline')
  .name('时间轴')
  .onChange((value: boolean) => {
    const animation = viewer!.timeline.container as HTMLElement;
    animation!.style.display = value ? 'inline-block' : 'none';
  });

// 全屏按钮
gui
  .add(options, 'fullscreen')
  .name('全屏')
  .onChange((value: boolean) => {
    viewer!.fullscreenButton.viewModel.isFullscreenEnabled = value;
  });

// 销毁
onUnmounted(() => {
  gui.destroy();
});
</script>

<template></template>

<style></style>
