<script setup lang="ts">
import { inject, onUnmounted } from 'vue';
import * as Cesium from "cesium";
import * as dat from 'dat.gui';


const viewer = inject('viewer') as Cesium.Viewer;

const imageryLayers = viewer.imageryLayers;
console.log(viewer.baseLayerPicker.viewModel.imageryProviderViewModels);


let imagery: Map<string, Cesium.ImageryProvider> = new Map();

// arcgis
const arcgis_img = await Promise.resolve(Cesium.ArcGisMapServerImageryProvider.fromUrl(
    "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
))
imageryLayers.addImageryProvider(arcgis_img);

imagery.set('arcgis_img', arcgis_img);

// 腾讯影像
const tx_img = new Cesium.UrlTemplateImageryProvider({
    url: 'https://p2.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=229',
    customTags: {
        sx: function (_imageryProvider: any, x: any, _y: any, _level: any) {
            return x >> 4;
        },
        sy: function (_imageryProvider: any, _x: any, y: any, _level: any) {
            return ((1 << _level) - y) >> 4;
        }
    }
});

imagery.set('tx_img', tx_img);

// 天地图影像底图
const tdt_key = "0bea42c0d814d9efba1ecf0b03a669c7";
const tdt_img = new Cesium.WebMapTileServiceImageryProvider({
    url: "http://{s}.tianditu.com/img_w/wmts?tk=" + tdt_key,
    layer: 'img',
    style: 'default',
    tileMatrixSetID: 'w',
    format: 'tiles',
    maximumLevel: 18,
    subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"]
})

// 天地图影像注记
const tdt_cia = new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://{s}.tianditu.gov.cn/cia_w/wmts?tk=' + tdt_key,
    layer: 'cia',
    style: 'default',
    tileMatrixSetID: 'w',
    format: 'tiles',
    maximumLevel: 18,
    subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"]
})

// 天地图矢量底图
const tdt_vec = new Cesium.WebMapTileServiceImageryProvider({
    url: "http://{s}.tianditu.gov.cn/vec_w/wmts?tk=" + tdt_key,
    layer: 'vec',
    style: 'default',
    tileMatrixSetID: 'w',
    format: 'tiles',
    maximumLevel: 18,
    subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"]
})

// 天地图矢量注记
const tdt_cva = new Cesium.WebMapTileServiceImageryProvider({
    url: 'http://{s}.tianditu.gov.cn/cva_w/wmts?tk=' + tdt_key,
    layer: 'cva',
    style: 'default',
    tileMatrixSetID: 'w',
    format: 'tiles',
    maximumLevel: 18,
    subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"]
})

imagery.set('tdt_img', tdt_img);
imagery.set('tdt_cia', tdt_cia);
imagery.set('tdt_vec', tdt_vec);
imagery.set('tdt_cva', tdt_cva);

// 高德矢量
const gd_vec = new Cesium.UrlTemplateImageryProvider({
    url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    minimumLevel: 3,
    maximumLevel: 18
})

// 高德影像
const gd_img = new Cesium.UrlTemplateImageryProvider({
    url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    minimumLevel: 3,
    maximumLevel: 18
})

// 高德注记
const gd_cva = new Cesium.UrlTemplateImageryProvider({
    url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
    minimumLevel: 3,
    maximumLevel: 18
})

imagery.set('gd_vec', gd_vec);
imagery.set('gd_img', gd_img);
imagery.set('gd_cva', gd_cva);

// 星图影像
const xt_key = "82455ef06c72bb3a35bbb4d7d05fd9eceb96a94dc942a056b8feb0e5928ed96f";
const xt_img = new Cesium.UrlTemplateImageryProvider({
    url: "https://tiles{s}.geovisearth.com/base/v1/img/{z}/{x}/{y}?token=" + xt_key,
    minimumLevel: 3,
    maximumLevel: 18,
    subdomains: "123"
})

// 星图注记
const xt_cia = new Cesium.UrlTemplateImageryProvider({
    url: "https://tiles{s}.geovisearth.com/base/v1/cia/{z}/{x}/{y}?token=" + xt_key,
    minimumLevel: 3,
    maximumLevel: 18,
    subdomains: "123"
})

// 星图电子
const xt_vec = new Cesium.UrlTemplateImageryProvider({
    url: "https://tiles{s}.geovisearth.com/base/v1/vec/{z}/{x}/{y}?token=" + xt_key,
    minimumLevel: 3,
    maximumLevel: 18,
    subdomains: "123"
})

imagery.set('xt_img', xt_img);
imagery.set('xt_cia', xt_cia);
imagery.set('xt_vec', xt_vec);


// 默认底图
imageryLayers.addImageryProvider(xt_img);

// 谷歌
// Bing
// 百度
// 

const options = {
    imagery: 'xt_img', // 自转
};

const gui = new dat.GUI();
gui.domElement.style = 'position:absolute;top:10px;left:10px;';

// 图层选择
gui
    .add(options, 'imagery', {
        '星图影像': 'xt_img', '星图注记': 'xt_cia', '星图电子': 'xt_vec',
        '高德电子': 'gd_vec', '高德影像': 'gd_img', '高德注记': 'gd_cva',
        '天地图影像': 'tdt_img', '天地图影像标注': 'tdt_cia', '天地图电子': 'tdt_vec', '天地图电子标注': 'tdt_cva',
        '腾讯影像': 'tx_img', "ArcGis电子+街道": "arcgis_img"
    })
    .name('图层选择')
    .onFinishChange((key: string) => {
        const provider = imagery.get(key) as Cesium.ImageryProvider
        // 判断图层是否存在
        let raiseImageryLayer = null;
        for (var i = 0; i < imageryLayers.length; i++) {
            var layer = imageryLayers.get(i);
            if (layer.imageryProvider == provider) {
                // 如果Imagery存在，则将其置顶
                raiseImageryLayer = layer;
            }
        }

        if (raiseImageryLayer) {
            imageryLayers.raiseToTop(raiseImageryLayer)
        } else {
            imageryLayers.addImageryProvider(provider);
        }
    });



// 销毁
onUnmounted(() => {
    gui.destroy();
});
</script>

<template></template>

<style></style>
