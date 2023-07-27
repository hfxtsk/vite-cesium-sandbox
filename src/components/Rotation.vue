<script setup lang="ts">
import { inject, reactive, onUnmounted } from 'vue';
import * as Cesium from 'cesium';
import * as dat from 'dat.gui';

const options = reactive({
    rotation: true, // 自转
});

const viewer = inject('viewer') as Cesium.Viewer;

const gui = new dat.GUI();
gui.domElement.style = 'position:absolute;top:10px;left:10px;';

let previousTime = viewer.clock.currentTime.secondsOfDay;

const onTickCallback = () => {
    let spinRate = 1;
    let currentTime = viewer.clock.currentTime.secondsOfDay;
    let delta = (currentTime - previousTime) / 1000;
    previousTime = currentTime;
    viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate * delta);
}

// 自转
gui
    .add(options, 'rotation')
    .name('地球自转')
    .onFinishChange((value: boolean) => {
        if (value) {
            viewer.clock.onTick.addEventListener(onTickCallback);
        } else {
            viewer.clock.onTick.removeEventListener(onTickCallback);
        }
    });

//旋转
viewer.clock.multiplier = 120;//速度
viewer.clock.shouldAnimate = true;
viewer.clock.onTick.addEventListener(onTickCallback);

/* window.addEventListener('mouseover', () => {
    viewer.clock.onTick.removeEventListener(onTickCallback);
})

window.addEventListener('mouseout', () => {
    viewer.clock.onTick.addEventListener(onTickCallback);
})
 */

// 销毁
onUnmounted(() => {
    gui.destroy();
});
</script>

<template></template>

<style></style>
