<script setup lang="ts">
import { inject, onUnmounted } from 'vue';
import * as Cesium from "cesium";
import * as dat from 'dat.gui';

const viewer = inject('viewer') as Cesium.Viewer;
// 地球照明效果
// viewer.scene.globe.enableLighting = true;

let entities: Map<string, Cesium.Entity.ConstructorOptions> = new Map();

const options = {
  entities: 'billboard_xtsk',
};

const billboard_xtsk = {
  id: 'billboard_xtsk',
  position: Cesium.Cartesian3.fromDegrees(117.207287, 31.857432),
  billboard: {
    image: "https://cdn.hfxtsk.cn/hfxtsk/logo/2.png",
    show: true, // default
    scale: 2.0, // default: 1.0
    //像素偏移    type: Cartesian2    default:Cartesian2.ZERO
    pixelOffset: new Cesium.Cartesian2(0, -50),
    //眼睛偏移    type: Cartesian3    default:Cartesian3.ZERO
    eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),

    // 水平对齐方式  type: HorizontalOrigin  default:HorizontalOrigin.CENTER
    // CENTER 原点在对象的水平中心；LEFT 原点在对象的左侧；RIGHT 原点在对象的右侧
    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    // 垂直对齐方式  type: VerticalOrigin  default:VerticalOrigin.CENTER
    // CENTER 原点位于 BASELINE 和 TOP 之间的垂直中心；BOTTOM 原点在对象的底部；
    // BASELINE 如果对象包含文本，则原点位于文本的基线，否则原点位于对象的底部；TOP 原点在对象的顶部
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER 垂直对齐位置 参考Cesium.VerticalOrigin

    // 获取或设置此广告牌的高度参考    type: HeightReference    default:HeightReference.NONE
    // NONE 位置绝对；CLAMP_TO_GROUND 位置固定在地形上；RELATIVE_TO_GROUND 位置高度是指地形上方的高度
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,

    // 颜色  type: Color  default:Color.WHITE
    color: Cesium.Color.WHITE,
    // 获取或设置以弧度为单位的旋转角度  type: number  default:0
    rotation: Cesium.Math.PI_OVER_FOUR,
    // 获取或设置世界空间中的对齐轴  type:Cartesian3  default:Cartesian3.ZERO
    alignedAxis: Cesium.Cartesian3.ZERO,
    width: 100, // default: undefined
    height: 25, // default: undefined

    // 根据广告牌与相机的距离获取或设置广告牌的近和远缩放属性  type:NearFarScalar
    scaleByDistance: new Cesium.NearFarScalar(1.0e3, 2.0, 2.0e3, 1.0),
    // 根据广告牌到相机的距离，获取或设置广告牌的近和远半透明属性  type:NearFarScalar
    translucencyByDistance: new Cesium.NearFarScalar(
      1.0e3,
      1.0,
      1.5e6,
      0.5
    ),
    // 根据广告牌与摄像头的距离，获取或设置广告牌的近像素偏移量和远像素偏移量缩放属性  type:NearFarScalar
    pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
      1.0e3,
      1.0,
      1.5e6,
      0.0
    ),

    // 设置1000米和2000米之间可见  type:DistanceDisplayCondition
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
    // 获取或设置与相机的距离，在深度处禁用深度测试，例如，以防止剪切地形。
    // 设置为零时，将始终应用深度测试。设置为Number.POSITIVE_INFINITY时，永远不会应用深度测试。
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
  },
} as Cesium.Entity.ConstructorOptions;

entities.set('billboard_xtsk', billboard_xtsk)


const box = {
  name: "这是一个盒子",
  id: "box",
  position: Cesium.Cartesian3.fromDegrees(117.207287, 31.857432, 300000.0),
  box: {
    show: true,
    dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0), // Cartesian3类型，用于指定框的长度，宽度和高度
    // 指定距实体位置的高度是相对于什么的高度。 default: HeightReference.NONE
    // NONE	位置绝对；CLAMP_TO_GROUND	位置固定在地形上；RELATIVE_TO_GROUND 位置高度是指地形上方的高度。
    heightReference: Cesium.HeightReference.NONE,
    fill: true,
    // MaterialProperty|Color  default:Color.WHITE
    material: Cesium.Color.RED.withAlpha(0.5),
    outline: true,
    // type:Property|Color  default:Color.BLACK
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 1.0,

    // type:ShadowMode  default:ShadowMode.DISABLED
    // DISABLED	对象不投射或接收阴影；ENABLED	对象投射并接收阴影；CAST_ONLY	对象仅投射阴影；RECEIVE_ONLY 该对象仅接收阴影。
    shadows: Cesium.ShadowMode.DISABLED,
    // type:DistanceDisplayCondition
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
  },
} as Cesium.Entity.ConstructorOptions;

entities.set('box', box)

// Corridor 走廊
const corridor = {
  name: "这是一个走廊",
  id: 'corridor',
  corridor: {
    // show: true,
    // 指定定义走廊中心线的 Cartesian3 位置的数组  type: Cartesian3
    positions: Cesium.Cartesian3.fromDegreesArray([
      117.207287,
      31.857432,
      114.207287,
      31.857432,
      117.207287,
      28.857432,
    ]),
    width: 200000.0,
    height: 200000.0,
    heightReference: Cesium.HeightReference.NONE,
    extrudedHeight: 100000.0,
    extrudedHeightReference: Cesium.HeightReference.NONE,

    // 拐角的样式  type:CornerType  default:CornerType.ROUNDED
    // ROUNDED	角有光滑的边缘；MITERED	拐角点是相邻边的交点；BEVELED	角被修剪
    cornerType: Cesium.CornerType.ROUNDED,
    granularity: Cesium.Math.RADIANS_PER_DEGREE, // 每个纬度和经度之间的距离
    fill: true,
    // 材质  type:MaterialProperty|Color  default:Color.WHITE
    material: Cesium.Color.BLUE.withAlpha(0.5),
    outline: true, // height or extrudedHeight must be set for outlines to display
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 1.0,
    shadows: Cesium.ShadowMode.DISABLED,
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
    // 走廊在地面上时将对地形，3D tiles还是对两者进行分类  type:ClassificationType  default:ClassificationType.BOTH
    // TERRAIN 将仅对地形进行分类;CESIUM_3D_TILE 将仅对3D Tiles进行分类;BOTH	将同时对Terrain和3D Tiles进行分类。
    classificationType: Cesium.ClassificationType.BOTH,
  },
} as Cesium.Entity.ConstructorOptions;
entities.set('corridor', corridor);

// cylinder-圆柱&圆锥
const cylinder = {
  name: "cylinder-圆柱&圆锥",
  id: 'cylinder',
  position: Cesium.Cartesian3.fromDegrees(117.207287, 31.857432, 200000.0),
  cylinder: {
    // show: true,
    length: 400000.0, // 圆柱体长度
    topRadius: 200000.0, // 圆柱体顶部半径
    bottomRadius: 200000.0, // 圆柱体底部半径
    heightReference: Cesium.HeightReference.NONE,
    fill: true,
    material: Cesium.Color.GREEN.withAlpha(0.5),
    outline: true,
    outlineColor: Cesium.Color.DARKGREEN,
    outlineWidth: 1.0,
    numberOfVerticalLines: 16, // 沿轮廓的周长绘制的垂直线的数量
    shadows: Cesium.ShadowMode.DISABLED,
    slices: 128, // 圆柱周围的边缘数量
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
  },
} as Cesium.Entity.ConstructorOptions;
entities.set('cylinder', cylinder);


const ellipse = {
  name: "ellipse 椭圆或拉伸的椭圆",
  id: 'ellipse',
  position: Cesium.Cartesian3.fromDegrees(117.207287, 31.857432, 100000.0),
  ellipse: {
    show: true,
    semiMajorAxis: 300000.0, // 长半轴距离
    semiMinorAxis: 150000.0, // 短半轴距离

    height: 20000.0,
    heightReference: Cesium.HeightReference.NONE,
    extrudedHeight: 20000.0,
    extrudedHeightReference: Cesium.HeightReference.NONE,

    // rotation: Cesium.Math.toRadians(45), // 从北方逆时针旋转
    stRotation: 0.0, // 纹理从北方逆时针旋转
    granularity: Cesium.Math.RADIANS_PER_DEGREE, // 椭圆上各点之间的角距离
    material: Cesium.Color.BLUE.withAlpha(0.5),
    fill: true,
    outline: true,
    outlineColor: Cesium.Color.DARKGREEN,
    outlineWidth: 1.0,
    numberOfVerticalLines: 16, // 沿轮廓的周长绘制的垂直线的数量
    shadows: Cesium.ShadowMode.DISABLED,
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),

    // 在地面上时将对地形，3D tiles还是对两者进行分类  type:ClassificationType  default:ClassificationType.BOTH
    // TERRAIN 将仅对地形进行分类;CESIUM_3D_TILE 将仅对3D瓷砖进行分类;BOTH	将同时对Terrain和3D Tile进行分类。
    classificationType: Cesium.ClassificationType.BOTH,
  },
} as Cesium.Entity.ConstructorOptions;
entities.set('ellipse', ellipse);


var ellipsoid = {
  name: "Spheres and Ellipsoids",
  id: 'ellipsoid',
  position: Cesium.Cartesian3.fromDegrees(117.207287, 31.857432, 300000.0),
  ellipsoid: {
    show: true,
    radii: new Cesium.Cartesian3(200000.0, 200000.0, 300000.0), // 椭球半径
    // innerRadii: new Cesium.Cartesian3(0.0, 0.0, 0.0), // 椭球内部半径
    minimumClock: 0.0, // 最小时钟角度
    maximumClock: 2 * Math.PI, // 最大时钟角度
    minimumCone: 0.0, // 最小圆锥角
    maximumCone: Math.PI, // 最大圆锥角
    heightReference: Cesium.HeightReference.NONE,
    fill: true,
    material: Cesium.Color.BLUE.withAlpha(0.5),
    outline: true,
    outlineColor: Cesium.Color.YELLOW,
    outlineWidth: 1.0,

    stackPartitions: 64, // 延纬度线切割的次数
    slicePartitions: 64, // 延经度线切割的次数
    subdivisions: 128, // 每个轮廓环的样本数，确定曲率的粒度

    shadows: Cesium.ShadowMode.DISABLED,
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
  },
} as Cesium.Entity.ConstructorOptions;
entities.set('ellipsoid', ellipsoid);


//
var label = {
  name: "label",
  id: "label",
  position: Cesium.Cartesian3.fromDegrees(
    117.207287, 31.857432,
    30.0
  ),
  label: {
    show: true,
    text: "星图时空",
    font: "24px Helvetica",
    // FILL	填充；OUTLINE 只显示边框；FILL_AND_OUTLINE 既有填充又有边框
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    scale: 1.0,
    showBackground: true,
    backgroundColor: Cesium.Color.BLUE,
    backgroundPadding: new Cesium.Cartesian2(7, 5),
    pixelOffset: Cesium.Cartesian2.ZERO,
    eyeOffset: Cesium.Cartesian3.ZERO,
    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    verticalOrigin: Cesium.VerticalOrigin.CENTER,
    heightReference: Cesium.HeightReference.NONE,
    fillColor: Cesium.Color.SKYBLUE,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 2,
    translucencyByDistance: new Cesium.NearFarScalar(
      1.0e3,
      1.0,
      1.5e6,
      0.5
    ),
    pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
      1.0e3,
      1.0,
      1.5e6,
      0.0
    ),
    scaleByDistance: new Cesium.NearFarScalar(1.0e3, 2.0, 2.0e3, 1.0),
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
  },
} as Cesium.Entity.ConstructorOptions;

entities.set('label', label);


// Model
var position = Cesium.Cartesian3.fromDegrees(
  117.207287, 31.857432,
  0.0
);
var heading = Cesium.Math.toRadians(135);
var pitch = 0;
var roll = 0;
var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
var orientation = Cesium.Transforms.headingPitchRollQuaternion(
  position,
  hpr
);

var url = "//data.mars3d.cn/gltf/mars/jingche/jingche.gltf";
var model = {
  name: "model",
  id: "model",
  position: position,
  orientation: orientation,
  model: {
    show: true,
    uri: url,
    scale: 1.0,
    minimumPixelSize: 128, // 模型的最小最小像素大小，而不考虑缩放
    maximumScale: 20000, // 模型的最大比例尺大小。 minimumPixelSize的上限
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

entities.set('model', model);

// tileset 3D Tiles瓦片集
var tileset = {
  name: "文庙",
  // position: Cesium.Cartesian3.fromDegrees(117.207287, 31.857432, 80.6),
  tileset: {
    show: true,
    uri: "//data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
  },
};

entities.set('tileset', tileset);

//TODO 路径

const property = new Cesium.SampledPositionProperty()
property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD

let tempTime

// 起点
tempTime = viewer.clock.currentTime // 飞行开始时间
property.addSample(tempTime, Cesium.Cartesian3.fromDegrees(117.172852, 31.862736, 50))

// 移动到的第1个目标点
tempTime = Cesium.JulianDate.addSeconds(tempTime, 120, new Cesium.JulianDate())
property.addSample(tempTime, Cesium.Cartesian3.fromDegrees(117.251461, 31.856011, 50))

// 移动到的第2个目标点
tempTime = Cesium.JulianDate.addSeconds(tempTime, 120, new Cesium.JulianDate())
property.addSample(tempTime, Cesium.Cartesian3.fromDegrees(117.265321, 31.876336, 50))

tempTime = Cesium.JulianDate.addSeconds(tempTime, 600, new Cesium.JulianDate())
property.addSample(tempTime, Cesium.Cartesian3.fromDegrees(117.160215, 31.890639, 50))

var path = {
  position: property,
  name: "path",
  id: "path",
  path: {
    show: true,
    leadTime: 0,
    trailTime: 60,
    width: 10,
    resolution: 1,
    material: new Cesium.PolylineGlowMaterialProperty({
      glowPower: 0.3,
      taperPower: 0.3,
      color: Cesium.Color.PALEGOLDENROD,
    }),
  },

};


entities.set('path', path);

// plane平面

var plane = {
  name: "Blue plane",
  id: "plane",
  position: Cesium.Cartesian3.fromDegrees(117.172852, 31.862736, 300.0),
  plane: {
    show: true,
    // 用于指定平面的法线和距离
    plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_X, 0.0),
    dimensions: new Cesium.Cartesian2(400000.0, 300000.0), // 指定平面的宽度和高度
    fill: true,
    material: Cesium.Color.BLUE,
    outline: false,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 1.0,
    shadows: Cesium.ShadowMode.DISABLED,
    // type:DistanceDisplayCondition
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
  },
};

entities.set('plane', plane);


const point = {
  position: Cesium.Cartesian3.fromDegrees(117.172852, 31.862736),
  point: {
    show: true,
    pixelSize: 10, // 像素大小
    heightReference: Cesium.HeightReference.NONE,
    color: Cesium.Color.YELLOW,
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
entities.set('point', point);

// 多边形

var polygon = {
  name: "Red polygon on surface",
  id: 'polygon',
  polygon: {
    show: true,
    // 指定PolygonHierarchy
    hierarchy: Cesium.Cartesian3.fromDegreesArray([
      117.168977, 31.808851,
      117.222692, 31.794368,
      117.21305, 31.780667,
      117.193277, 31.772651,
      117.194464, 31.799512,
    ]),
    height: 0, // 多边形相对于椭球面的高度
    heightReference: Cesium.HeightReference.NONE,
    // extrudedHeight: 0, // 多边形的凸出面相对于椭球面的高度
    // extrudedHeightReference: Cesium.HeightReference.NONE,
    stRotation: 0.0, // 多边形纹理从北方逆时针旋转
    granularity: Cesium.Math.RADIANS_PER_DEGREE, // 每个纬度和经度点之间的角距离
    fill: true,
    material: Cesium.Color.RED,
    outline: false,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 1.0,
    perPositionHeight: false, // 是否使用每个位置的高度

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
entities.set('polygon', polygon);


// 

var polyline = {
  name: "Red line on terrain",
  id: 'polyline',
  polyline: {
    show: true,

    // 定义线条的 Cartesian3 位置的数组
    positions: Cesium.Cartesian3.fromDegreesArray([
      117.085964, 31.818930,
      117.135452, 31.854045,
      117.136125, 31.805614,
      117.182766, 31.821714
    ]),

    width: 5,
    // 如果arcType不是ArcType.NONE，则指定每个纬度和经度之间的角距离
    // granularity: Cesium.Math.RADIANS_PER_DEGREE,

    material: Cesium.Color.RED,
    // 线低于地形时用于绘制折线的材质
    // depthFailMaterial: Cesium.Color.WHITE,

    // 折线段必须遵循的线型
    // arcType: Cesium.ArcType.GEODESIC,

    clampToGround: true, // 是否贴地

    shadows: Cesium.ShadowMode.DISABLED, // 折线是投射还是接收光源的阴影

    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),

    // 在地面上时将对地形，3D tiles还是对两者进行分类  type:ClassificationType  default:ClassificationType.BOTH
    // TERRAIN 将仅对地形进行分类;CESIUM_3D_TILE 将仅对3D Tiles进行分类;BOTH	将同时对Terrain和3D Tiles进行分类。
    classificationType: Cesium.ClassificationType.BOTH,

    // 指定用于订购地面几何形状的z索引。仅在多边形为常数且未指定高度或拉伸高度的情况下才有效  type:ConstantProperty
    // zIndex: 0,
  },
};

entities.set('polyline', polyline);


function computeCircle(radius: any) {
  var positions = [];
  for (var i = 0; i < 360; i++) {
    var radians = Cesium.Math.toRadians(i);
    positions.push(
      new Cesium.Cartesian2(
        radius * Math.cos(radians),
        radius * Math.sin(radians)
      )
    );
  }
  return positions;
}

var polylineVolume = {
  name: "Red tube with rounded corners",
  id: 'polylineVolume',
  polylineVolume: {
    show: true,

    // 定义线带的 Cartesian3 位置的数组
    positions: Cesium.Cartesian3.fromDegreesArray([
      117.203467, 31.738612,
      117.237232, 31.731689,
      117.242478, 31.755429,
      117.222618, 31.762567
    ]),

    // 指定 Cartesian2 位置的数组，这些位置定义了要拉伸的形状
    shape: computeCircle(50.0),

    // 拐角的样式  type:CornerType
    // ROUNDED	拐角有光滑的边缘;MITERED 拐角点是相邻边的交点;BEVELED	拐角被修剪。
    cornerType: Cesium.CornerType.ROUNDED,

    // 如果arcType不是ArcType.NONE，则指定每个纬度和经度之间的角距离
    // granularity: Cesium.Math.RADIANS_PER_DEGREE,

    fill: true,

    material: Cesium.Color.RED,

    outline: false,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 1.0,

    shadows: Cesium.ShadowMode.DISABLED, // 体积是投射还是接收光源的阴影

    // type:DistanceDisplayCondition
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
  },
};

entities.set('polylineVolume', polylineVolume);


var rectangle = {
  name: "Red translucent rectangle",
  id: "rectangle",
  rectangle: {
    show: true,

    coordinates: Cesium.Rectangle.fromDegrees(115.203467, 20.738612, 117.203467, 31.738612),

    // height: 0, // 矩形相对于椭球面的高度
    // heightReference: Cesium.HeightReference.NONE,

    // extrudedHeight: 0, // 矩形的拉伸面相对于椭球面的高度
    // extrudedHeightReference: Cesium.HeightReference.NONE,

    rotation: 0.0, // 矩形从北方向顺时针方向的旋转
    stRotation: 0.0, // 矩形纹理从北方逆时针旋转
    granularity: Cesium.Math.RADIANS_PER_DEGREE, // 指定矩形上各点之间的角度距离
    fill: true,
    material: Cesium.Color.RED.withAlpha(0.5),

    outline: false,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 1.0,

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
};

entities.set('rectangle', rectangle);


var wall = {
  name: "Red wall at height",
  id: "wall",
  wall: {
    show: true,

    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
      117.227362, 31.859836, 200000.0,
      117.268495, 32.866797, 200000.0,
    ]),

    // 用于墙底而不是地球表面的高度数组
    minimumHeights: [100000.0, 100000.0],
    // 用于墙顶的高度数组，而不是每个位置的高度
    // maximumHeights: [],

    granularity: Cesium.Math.RADIANS_PER_DEGREE, // 指定矩形上各点之间的角度距离
    fill: true,
    material: Cesium.Color.RED,

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

entities.set('wall', wall);

// 默认Entity
viewer.entities.add(billboard_xtsk);




const entityCollection = new Cesium.EntityCollection();


// 创建一个EntityCluster对象
const cluster = new Cesium.EntityCluster(entityCollection);
// 设置聚合的显示样式
cluster.clusterBillboards = true; // 是否显示聚合标记
cluster.clusterLabels = true; // 是否显示聚合标签
cluster.clusterPoints = true; // 是否显示聚合标签

// 将聚合添加到场景中
viewer.scene.primitives.add(cluster);


const gui = new dat.GUI();
gui.domElement.style = 'position:absolute;top:10px;left:10px;';

gui
  .add(options, 'entities', {
    'billboard-星图时空': 'billboard_xtsk',
    'box-盒子': 'box',
    'corridor-走廊': 'corridor',
    'cylinder-圆柱&圆锥': 'cylinder',
    'ellipse-椭圆': 'ellipse',
    'ellipsoid-椭球体': 'ellipsoid',
    'label-标签': 'label',
    'model-模型': 'model',
    'tileset-瓦片集': 'tileset',
    'path-路径': 'path',
    'plane-面': 'plane',
    'point-点': 'point',
    'polygon-多边形': 'polygon',
    'polylineVolume-多线段柱体': 'polylineVolume',
    'rectangle-矩形': 'rectangle',
    'wall-墙': 'wall',
  })
  .name('Entity')
  .onFinishChange((key: string) => {
    const entityOptions = entities.get(key) as Cesium.Entity.ConstructorOptions

    let entity = viewer.entities.values.find(entity => entity.id === entityOptions.id) as Cesium.Entity;
    if (!entity) {
      entity = viewer.entities.add(entityOptions);
      entityCollection.add(entity)
    }
    // viewer.zoomTo(entity);
    viewer.flyTo(entity);

    console.log("entities>>>>", viewer.entities)
  });



// 销毁
onUnmounted(() => {
  gui.destroy();
});
</script>

<template></template>

<style></style>
