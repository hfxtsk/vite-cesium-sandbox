<script setup lang="ts">
import { inject, onUnmounted } from 'vue';
import * as Cesium from "cesium";
import * as dat from 'dat.gui';


const viewer = inject('viewer') as Cesium.Viewer;
// 地球照明效果
// viewer.scene.globe.enableLighting = true;

let vec: Map<string, Function> = new Map();

const options = {
    vec: 'geojson_ah',
};

const geojson_ah = () => {
    const ah = Cesium.GeoJsonDataSource.load(
        "https://geojson.cn/api/data/340000.json"
    )
    viewer.dataSources.add(ah);
    // 设置相机位置和视角
    viewer.zoomTo(ah);
}
vec.set('geojson_ah', geojson_ah)
geojson_ah();

const kml_country = () => {
    const countryboundary = Cesium.KmlDataSource.load(
        "//data.mars3d.cn/file/kml/countryboundary.kml",
        {
            camera: viewer.scene.camera,
            canvas: viewer.scene.canvas,
        }
    )
    viewer.dataSources.add(countryboundary);

}

vec.set('kml_country', kml_country)

// 海上安全警告
const kmz_navwarn = () => {
    const navwarn = Cesium.KmlDataSource.load(
        "//data.mars3d.cn/file/kml/NAVWARN.kmz",
        {
            camera: viewer.scene.camera,
            canvas: viewer.scene.canvas,
        }
    )
    viewer.dataSources.add(navwarn);
    // 设置相机位置和视角
    viewer.zoomTo(navwarn);
}

vec.set('kmz_navwarn', kmz_navwarn)

// 加载czml
const czml_car = () => {
    const car = Cesium.CzmlDataSource.load("//data.mars3d.cn/file/czml/car.czml")
    viewer.dataSources.add(car);
    // 设置相机位置和视角
    viewer.zoomTo(car);
}

vec.set('czml_car', czml_car)

const gui = new dat.GUI();
gui.domElement.style = 'position:absolute;top:10px;left:10px;';

gui
    .add(options, 'vec', {
        'GeoJSON-安徽': 'geojson_ah',
        'KML-国境线': 'kml_country',
        'KMZ-海上安全警告': 'kmz_navwarn',
        'CZML-车辆': 'czml_car',
    })
    .name('矢量数据')
    .onFinishChange((key: string) => {
        const func = vec.get(key) as Function
        func();
    });



// 销毁
onUnmounted(() => {
    gui.destroy();
});
</script>

<template></template>

<style></style>
