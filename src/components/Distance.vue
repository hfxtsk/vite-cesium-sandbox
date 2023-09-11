<script setup lang="ts">
import { inject, onUnmounted, onMounted } from 'vue';
import * as Cesium from "cesium";
import treeJson from '../assets/tree.json';
import { calcDistance } from './Distance'

const viewer = inject('viewer') as Cesium.Viewer;

// Cesium地形
const cesium_terrain = Cesium.Terrain.fromWorldTerrain({
    requestWaterMask: true, // 请求水体效果所需要的海岸线数据
    requestVertexNormals: true, // 请求地形照明数据
})
viewer.scene.setTerrain(cesium_terrain);

// 电线塔集合 
const towers = [[116.065971, 30.226721, 17.6], [116.06541, 30.225581, 18.6], [116.064921, 30.224908, 27.2], [116.064018, 30.224538, 35.7], [116.063097, 30.224283, 44.2], [116.062609, 30.224058, 41.9], [116.063154, 30.22338, 62.2], [116.063703, 30.223069, 83.9], [116.063713, 30.222109, 101.2], [116.062952, 30.220749, 93.3]];

// 高度偏移20米，电线杆的高度
const towerLineOffset = 20;

towers.forEach(t => {
    t[2] += towerLineOffset
})


// const units = { units: 'kilometers' } as object;

const calcResult = (aTree: number[], towers: number[][]) => {

    viewer.dataSources.getByName("myEntity").forEach(d => {
        d.entities.removeAll();
    })

    const dataSource = calcDistance(aTree, towers);

    viewer.dataSources.add(dataSource);
    // 定位至
    viewer.flyTo(dataSource);
}

// Model
/* var heading = Cesium.Math.toRadians(135);
var pitch = 0;
var roll = 0;
var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
var orientation = Cesium.Transforms.headingPitchRollQuaternion(
    position,
    hpr
);

 */


const towerDegrees: Array<number> = [];

towers.forEach(t => {
    towerDegrees.push(t[0]);
    towerDegrees.push(t[1]);
    towerDegrees.push(t[2]);
})

// 树 + 电线
const dataSource2 = new Cesium.CustomDataSource('myEntity2');

const entityCollection2 = dataSource2.entities;

var towerPolyline = {
    name: "高压电缆",
    label: {
        text: "电缆",
        font: '18px sans-serif'
    },
    polyline: {
        show: true,

        // 定义线条的 Cartesian3 位置的数组
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(towerDegrees),
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


// 所有的树木
console.log('treeJson>>>', treeJson);

type TreeType = {
    "序号": number,
    "模型编号": string,
    "经度": number,
    "纬度": number,
    "海拔": number,
    "树高度/m": number,
    "海拔高度/m": number,
}
const trees = treeJson.Sheet1 as Array<TreeType>;


onMounted(() => {

    // 电线塔
    for (let i = 0; i < towerDegrees.length; i = i + 3) {
        // const position = tower.geometry;
        entityCollection2.add(
            {
                name: `电线塔${i / 3}`,
                position: Cesium.Cartesian3.fromDegrees(
                    towerDegrees[i], towerDegrees[i + 1], towerDegrees[i + 2] - towerLineOffset
                )/* Cesium.Cartesian3.fromDegrees(
        cable[0][0], cable[0][1], cable[0][2] - 40
    ) */,
                model: {
                    show: true,
                    uri: "http://cdn.hfxtsk.cn/gltf/tower/gltf2.gltf",
                    scale: 1.0,
                    heightReference: Cesium.HeightReference.NONE,
                },
            })
    }

    // 电线

    viewer.flyTo(entityCollection2.add(towerPolyline));

    // 所有的树模型
    trees.forEach(tree => {
        entityCollection2.add({
            id: "tree-" + tree.序号,
            position: Cesium.Cartesian3.fromDegrees(
                tree.经度, tree.纬度, tree["海拔"]
            ),
            model: {
                show: true,
                uri: "http://cdn.hfxtsk.cn/gltf/tree.glb",
                scale: tree['树高度/m'] / 5.6,
                // minimumPixelSize: 128, // 模型的最小最小像素大小，而不考虑缩放
                // maximumScale: 20000, // 模型的最大比例尺大小。 minimumPixelSize的上限
                incrementallyLoadTextures: true, // 确定在加载模型后纹理是否可以继续流入
                runAnimations: true, // 是否应启动模型中指定的glTF动画
                clampAnimations: true, // glTF动画是否应在没有关键帧的持续时间内保持最后一个姿势
                shadows: Cesium.ShadowMode.DISABLED,
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
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
        });


    })

    // 添加拾取事件
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction((movement: any) => {
        var pickedEntity = pickEntity(viewer, movement.position) as Cesium.Entity;
        console.log("pickEntity>>>>", pickedEntity);

        if (pickedEntity && pickedEntity.id.startsWith("tree")) {

            const tree = trees.find(t => t.序号 == Number(pickedEntity.id.replace("tree-", "")))
            console.log("tree>>>>", tree);
            const atree = [tree?.经度, tree?.纬度, Number(tree?.['海拔高度/m']) + Number(tree?.['树高度/m'] || 0)] as number[];
            calcResult(atree, towers);
        }

        // var pickedEntities = drillPickEntities(viewer, movement.position);
        // console.log("drillPickEntities>>>>", pickedEntities);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    const pickEntity = (viewer: Cesium.Viewer, windowPosition: any) => {
        var picked = viewer.scene.pick(windowPosition);
        if (Cesium.defined(picked)) {
            var id = Cesium.defaultValue(picked.id, picked.primitive.id);
            if (id instanceof Cesium.Entity) {
                return id;
            }
        }
        return undefined;
    }

    const drillPickEntities = (viewer: Cesium.Viewer, windowPosition: any) => {
        var i;
        var entity;
        var picked;
        var pickedPrimitives = viewer.scene.drillPick(windowPosition);
        var length = pickedPrimitives.length;
        var result = [];
        var hash: any = {};

        for (i = 0; i < length; i++) {
            picked = pickedPrimitives[i];
            entity = Cesium.defaultValue(picked.id, picked.primitive.id);
            if (
                entity instanceof Cesium.Entity &&
                !Cesium.defined(hash[entity.id])
            ) {
                result.push(entity);
                hash[entity.id] = true;
            }
        }
        return result;
    }

    viewer.dataSources.add(dataSource2);
})


/* viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(116.06611344, 30.22700452, 21.81319),
}); */

// 销毁
onUnmounted(() => {
    viewer.dataSources.removeAll();
});
</script>

<template></template>

<style></style>
