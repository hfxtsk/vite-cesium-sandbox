<script setup lang="ts">
import { inject, onUnmounted } from 'vue';
import * as Cesium from "cesium";
import * as turf from '@turf/turf';

const viewer = inject('viewer') as Cesium.Viewer;

const cable = [
    [119.822875, 29.517443, 480],
    [119.825911, 29.521375, 580],
]

const aTree = [119.822975, 29.521203, 360];

const units = { units: 'kilometers' } as object;

// 一棵树
const t1 = turf.point(aTree.slice(0, 2));
// 一根线 和 2个端点
const l1 = turf.lineString([cable[0].slice(0, 2), cable[1].slice(0, 2)]);

const l11 = turf.point(cable[0].slice(0, 2));
const l12 = turf.point(cable[1].slice(0, 2));

// 最短距离， 水平距离
var a = turf.pointToLineDistance(t1, l1, units);
// a点和线的某一端点长度
var c = turf.distance(t1, l11, units);
// b点距离线的某一端点距离
var b = Math.sqrt(c * c - a * a);

console.log('a>>>>>', a * 1000);
console.log('b>>>>>', b * 1000);
console.log('c>>>>>', c * 1000);

// 直线距离点位置
const pb = turf.lineSliceAlong(l1, 0, b, units).geometry.coordinates[1];

console.log('水平点所在的位置>>>>>', pb);

// 光缆长度
const c11 = turf.distance(l11, l12, units);

// 高度差
const hDiff = Math.abs(cable[0][2] - cable[1][2]);
// 最小高度
const hMin = Math.min(cable[0][2], cable[1][2]);
// 最大高度
const hMax = Math.max(cable[0][2], cable[1][2]);

// cable[0][2] > cable[1][2]
// const bHHH = (1 - b / c11) * hDiff + hMin;
const bH = cable[0][2] > cable[1][2] ? hMax - (b / c11) * hDiff : b / c11 * hDiff + hMin;

console.log("高度差>>>>", hDiff);
console.log("最小高度>>>>", hMin);

// 结果
const ad = bH - aTree[2];
const bd = a * 1000;
const cd = Math.sqrt(bd * bd + ad * ad);

console.log("水平距离>>>>", bd);
console.log("竖直距离>>>>", ad);
console.log("直线距离>>>>", cd);

const result = `水平距离: ${bd.toFixed(1)}米，竖直距离: ${ad.toFixed(1)}米，直线距离: ${cd.toFixed(1)}米`

const aCartesian = Cesium.Cartesian3.fromDegrees(aTree[0], aTree[1], aTree[2]);
const bCartesian = Cesium.Cartesian3.fromDegrees(pb[0], pb[1], aTree[2]);
const cCartesian = Cesium.Cartesian3.fromDegrees(pb[0], pb[1], bH);

const bPoint = {
    position: bCartesian,
    name: '水平距离点',
    point: {
        show: true,
        pixelSize: 10, // 像素大小
        heightReference: Cesium.HeightReference.NONE,
        color: Cesium.Color.BLACK,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 0,
        scaleByDistance: new Cesium.NearFarScalar(1.0e3, 10.0, 2.0e3, 1.0),
        translucencyByDistance: new Cesium.NearFarScalar(
            1.0e3,
            1.0,
            1.5e6,
            0.5
        ),
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        //   1.0e3,
        //   2.0e3
        // ),
        // 获取或设置与相机的距离，在深度处禁用深度测试，例如，以防止剪切地形。
        // 设置为零时，将始终应用深度测试。设置为Number.POSITIVE_INFINITY时，永远不会应用深度测试。
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
}

const cPoint = {
    position: cCartesian,
    name: '直线距离点',
    point: {
        show: true,
        pixelSize: 10, // 像素大小
        heightReference: Cesium.HeightReference.NONE,
        color: Cesium.Color.BLUE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 0,
        scaleByDistance: new Cesium.NearFarScalar(1.0e3, 10.0, 2.0e3, 1.0),
        translucencyByDistance: new Cesium.NearFarScalar(
            1.0e3,
            1.0,
            1.5e6,
            0.5
        ),
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        //   1.0e3,
        //   2.0e3
        // ),
        // 获取或设置与相机的距离，在深度处禁用深度测试，例如，以防止剪切地形。
        // 设置为零时，将始终应用深度测试。设置为Number.POSITIVE_INFINITY时，永远不会应用深度测试。
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
}

const treePoint = {
    position: aCartesian,
    name: '我是一颗树',
    label: {
        text: result,
        font: '14px sans-serif',
        pixelOffset: new Cesium.Cartesian2(0, 20)
    },
    point: {
        show: true,
        pixelSize: 10, // 像素大小
        heightReference: Cesium.HeightReference.NONE,
        color: Cesium.Color.GREEN,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 0,
        scaleByDistance: new Cesium.NearFarScalar(1.0e3, 10.0, 2.0e3, 1.0),
        translucencyByDistance: new Cesium.NearFarScalar(
            1.0e3,
            1.0,
            1.5e6,
            0.5
        ),
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        //   1.0e3,
        //   2.0e3
        // ),
        // 获取或设置与相机的距离，在深度处禁用深度测试，例如，以防止剪切地形。
        // 设置为零时，将始终应用深度测试。设置为Number.POSITIVE_INFINITY时，永远不会应用深度测试。
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
}


var cablePolyline = {
    name: "我是一根电缆",
    id: 'polyline',
    label: {
        text: "电缆",
        font: '18px sans-serif'
    },
    polyline: {
        show: true,

        // 定义线条的 Cartesian3 位置的数组
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            ...cable[0],
            ...cable[1]
        ]),
        clampToGround: false, // 是否贴地
        width: 5,
        // 如果arcType不是ArcType.NONE，则指定每个纬度和经度之间的角距离
        // granularity: Cesium.Math.RADIANS_PER_DEGREE,

        material: Cesium.Color.RED,
        // 线低于地形时用于绘制折线的材质
        // depthFailMaterial: Cesium.Color.WHITE,

        // 折线段必须遵循的线型
        // arcType: Cesium.ArcType.GEODESIC,
        shadows: Cesium.ShadowMode.DISABLED, // 折线是投射还是接收光源的阴影

        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        //   1.0e3,
        //   2.0e3
        // ),

        // 在地面上时将对地形，3D tiles还是对两者进行分类  type:ClassificationType  default:ClassificationType.BOTH
        // TERRAIN 将仅对地形进行分类;CESIUM_3D_TILE 将仅对3D Tiles进行分类;BOTH	将同时对Terrain和3D Tiles进行分类。
        // classificationType: Cesium.ClassificationType.BOTH,

        // 指定用于订购地面几何形状的z索引。仅在多边形为常数且未指定高度或拉伸高度的情况下才有效  type:ConstantProperty
        // zIndex: 0,
    },
};

var resultPolygon = {
    name: result,
    id: 'resultPolygon',
    polygon: {
        show: true,
        // 指定PolygonHierarchy
        hierarchy: [
            aCartesian,
            bCartesian,
            cCartesian,
        ],
        // height: 0, // 多边形相对于椭球面的高度
        // heightReference: Cesium.HeightReference.NONE,
        // extrudedHeight: 0, // 多边形的凸出面相对于椭球面的高度
        // extrudedHeightReference: Cesium.HeightReference.NONE,
        stRotation: 0.0, // 多边形纹理从北方逆时针旋转
        granularity: Cesium.Math.RADIANS_PER_DEGREE, // 每个纬度和经度点之间的角距离
        fill: true,
        material: Cesium.Color.BLUE.withAlpha(0.1),
        outline: true,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 5.0,
        perPositionHeight: true, // 是否使用每个位置的高度

        closeTop: true, // 如果为false，则将挤出的多边形顶部留空
        closeBottom: true, // 如果为false，则将挤出的多边形的底部保留为开放状态

        // 多边形边缘必须遵循的线型    type:ArcType 定义连接顶点应采用的路径。
        // NONE 与椭圆表面不符的直线;GEODESIC 遵循测地路径;RHUMB	遵循大黄蜂或恶魔般的道路。
        arcType: Cesium.ArcType.GEODESIC,
        shadows: Cesium.ShadowMode.DISABLED,
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        //   1.0e3,
        //   2.0e3
        // ),
        // 在地面上时将对地形，3D tiles还是对两者进行分类  type:ClassificationType  default:ClassificationType.BOTH
        // TERRAIN 将仅对地形进行分类;CESIUM_3D_TILE 将仅对3D Tiles进行分类;BOTH	将同时对Terrain和3D Tiles进行分类。
        classificationType: Cesium.ClassificationType.BOTH,
        // 指定用于订购地面几何形状的z索引。仅在多边形为常数且未指定高度或拉伸高度的情况下才有效  type:ConstantProperty
        zIndex: 0,
    },
}


var wall = {
    name: "电缆所在的面",
    id: "wall",
    wall: {
        show: true,

        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            ...cable[0],
            ...cable[1]
        ]),

        // 用于墙底而不是地球表面的高度数组
        // minimumHeights: [1000.0, 1000.0],
        // 用于墙顶的高度数组，而不是每个位置的高度
        // maximumHeights: [],

        granularity: Cesium.Math.RADIANS_PER_DEGREE, // 指定矩形上各点之间的角度距离
        fill: true,
        material: Cesium.Color.RED.withAlpha(0.3),

        outline: false,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1.0,

        shadows: Cesium.ShadowMode.DISABLED,
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        //   1.0e3,
        //   2.0e3
        // ),
    },
};

// Model
var position = Cesium.Cartesian3.fromDegrees(
    aTree[0], aTree[1], aTree[2] - 20
);
var heading = Cesium.Math.toRadians(135);
var pitch = 0;
var roll = 0;
var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
var orientation = Cesium.Transforms.headingPitchRollQuaternion(
    position,
    hpr
);

var treeModel = {
    name: "树模型",
    id: "tree-model",
    position: position,
    orientation: orientation,
    model: {
        show: true,
        uri: "http://192.168.0.19:4000/prod-oss/profile/upload/f7436d1e57da37152bcb8f11c2f78900/tree.glb",
        scale: 1.0,
        // minimumPixelSize: 128, // 模型的最小最小像素大小，而不考虑缩放
        // maximumScale: 20000, // 模型的最大比例尺大小。 minimumPixelSize的上限
        incrementallyLoadTextures: true, // 确定在加载模型后纹理是否可以继续流入
        runAnimations: true, // 是否应启动模型中指定的glTF动画
        clampAnimations: true, // glTF动画是否应在没有关键帧的持续时间内保持最后一个姿势
        shadows: Cesium.ShadowMode.DISABLED,
        heightReference: Cesium.HeightReference.NONE,
        silhouetteColor: Cesium.Color.RED, // 轮廓的颜色
        silhouetteSize: 0.0, // 轮廓的宽度
        color: Cesium.Color.WHITE, // 模型的颜色

        // 目标颜色和图元的源颜色之间混合的不同模式
        // HIGHLIGHT 将源颜色乘以目标颜色;REPLACE 将源颜色替换为目标颜色;MIX 将源颜色和目标颜色混合在一起
        colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
        // 用于指定 colorBlendMode 为 MIX 时的颜色强度。值0.0会产生模型的着色，而值1.0会导致纯色，介于两者之间的任何值都会导致两者混合
        colorBlendAmount: 0.5,
        imageBasedLightingFactor: new Cesium.Cartesian2(1.0, 1.0), // 指定基于漫反射和镜面反射的图像照明的贡献
        lightColor: undefined, // 为模型着色时指定浅色的属性。如果 undefined ，则使用场景的浅色。
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        //   1.0e3,
        //   2.0e3
        // ),
    },
} as any;


var towerModel = {
    name: "电线塔模型",
    id: "tower-model-1",
    position: Cesium.Cartesian3.fromDegrees(
        aTree[0], aTree[1], aTree[2] - 20
    )/* Cesium.Cartesian3.fromDegrees(
        cable[0][0], cable[0][1], cable[0][2] - 40
    ) */,
    model: {
        show: true,
        uri: "http://192.168.0.19:4000/prod-oss/profile/upload/d0c96b4c9849ba5c3dd57ede23a2c91c/tower.glb",
        scale: 1.0,

    },
} as any;


const entityCollection = new Cesium.EntityCollection();

// 创建一个EntityCluster对象
const cluster = new Cesium.EntityCluster(entityCollection);
// 设置聚合的显示样式
cluster.clusterBillboards = true; // 是否显示聚合标记
cluster.clusterLabels = true; // 是否显示聚合标签
cluster.clusterPoints = true; // 是否显示聚合标签

// 将聚合添加到场景中
viewer.scene.primitives.add(cluster);


// entityCollection.add(viewer.entities.add(treePoint));
entityCollection.add(viewer.entities.add(bPoint));
entityCollection.add(viewer.entities.add(cPoint));
entityCollection.add(viewer.entities.add(resultPolygon));
entityCollection.add(viewer.entities.add(wall));
entityCollection.add(viewer.entities.add(cablePolyline));
entityCollection.add(viewer.entities.add(treeModel));
// entityCollection.add(viewer.entities.add(towerModel));

viewer.flyTo(entityCollection);

// 销毁
onUnmounted(() => {
});
</script>

<template></template>

<style></style>
