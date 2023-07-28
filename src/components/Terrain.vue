<script setup lang="ts">
import { inject, onUnmounted } from 'vue';
import * as Cesium from "cesium";
import * as dat from 'dat.gui';


const viewer = inject('viewer') as Cesium.Viewer;
// 地球照明效果
// viewer.scene.globe.enableLighting = true;

let terrain: Map<string, Function> = new Map();

// arcgis
const arcgis_terrain = await Cesium.ArcGISTiledElevationTerrainProvider.fromUrl("https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer", {
    token: "KED1aF_I4UzXOHy3BnhwyBHU4l5oY6rO6walkmHoYqGp4XyIWUd5YZUC1ZrLAzvV40pR6gBXQayh0eFA8m6vPg.."
});


terrain.set('arcgis_terrain', () => {
    viewer.terrainProvider = arcgis_terrain;
});

// Cesium
const cesium_terrain = Cesium.Terrain.fromWorldTerrain({
    requestWaterMask: true, // 请求水体效果所需要的海岸线数据
    requestVertexNormals: true, // 请求地形照明数据
})


terrain.set('cesium_terrain', () => {
    viewer.scene.setTerrain(cesium_terrain);
});

// EllipsoidTerrainProvider

const ellipsoid_terrain = new Cesium.EllipsoidTerrainProvider();

terrain.set('ellipsoid_terrain', () => {
    viewer.terrainProvider = ellipsoid_terrain;
});

// VR
const vr_terrain = new Cesium.Terrain(
    Cesium.VRTheWorldTerrainProvider.fromUrl(
        "http://www.vr-theworld.com/vr-theworld/tiles1.0.0/73/",
        {
            credit: "Terrain data courtesy VT MÄK",
        }
    )
)

terrain.set('vr_terrain', () => {
    viewer.scene.setTerrain(vr_terrain);
});


// 自定义高度
const customHeightmapWidth = 32;
const customHeightmapHeight = 32;
const custom_terrain = new Cesium.CustomHeightmapTerrainProvider(
    {
        width: customHeightmapWidth,
        height: customHeightmapHeight,
        callback: function (x, y, level) {
            const width = customHeightmapWidth;
            const height = customHeightmapHeight;
            const buffer = new Float32Array(width * height);

            for (let yy = 0; yy < height; yy++) {
                for (let xx = 0; xx < width; xx++) {
                    const u = (x + xx / (width - 1)) / Math.pow(2, level);
                    const v = (y + yy / (height - 1)) / Math.pow(2, level);

                    const heightValue = 4000 * (Math.sin(8000 * v) * 0.5 + 0.5);

                    const index = yy * width + xx;
                    buffer[index] = heightValue;
                }
            }

            return buffer;
        },
    }
);

terrain.set('custom_terrain', () => {
    viewer.terrainProvider = custom_terrain as any;
});

// Google
terrain.set('google_terrain', async () => {
    const geeMetadata = Cesium.GoogleEarthEnterpriseMetadata.fromUrl(
        new Cesium.Resource({
            url: "http://www.earthenterprise.org/3d",
            proxy: new Cesium.DefaultProxy("/proxy/"),
        })
    );

    viewer.scene.terrainProvider = Cesium.GoogleEarthEnterpriseTerrainProvider.fromMetadata(
        await geeMetadata, {}
    );
});

// 默认地形
viewer.terrainProvider = arcgis_terrain;



const options = {
    terrain: 'arcgis_terrain',
};

const gui = new dat.GUI();
gui.domElement.style = 'position:absolute;top:10px;left:10px;';

gui
    .add(options, 'terrain', {
        'ArcGISTerrainProvider': 'arcgis_terrain',
        'CesiumTerrainProvider': 'cesium_terrain',
        'EllipsoidTerrainProvider': 'ellipsoid_terrain',
        'VRTheWorldTerrainProvider': 'vr_terrain',
        'CustomHeightmapTerrainProvider': 'custom_terrain',
        'GoogleEarthEnterpriseTerrainProvider': 'google_terrain',
    })
    .name('地形选择')
    .onFinishChange((key: string) => {
        const func = terrain.get(key) as Function
        func();
    });



// 销毁
onUnmounted(() => {
    gui.destroy();
});
</script>

<template></template>

<style></style>
