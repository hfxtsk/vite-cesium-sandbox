import * as Cesium from "cesium";
import * as turf from "@turf/turf";

const units = { units: "kilometers" } as object;
/**
 *
 * @param tPoint 目标点
 * @param tLine 目标线
 * @returns
 */
export const calcDistance = (
  tPoint: number[],
  tLine: number[][]
): Cesium.DataSource => {
  // 一棵树
  const tTarget = turf.point(tPoint.slice(0, 2));

  const linePoints: Array<turf.Feature> = [];

  tLine.forEach((t) => {
    linePoints.push(turf.point([t[0], t[1]]));
  });

  const towerFeatureCollection = turf.featureCollection(
    linePoints
  ) as turf.helpers.FeatureCollection<
    turf.helpers.Point,
    turf.helpers.Properties
  >;

  const nearest = turf.nearestPoint(tTarget, towerFeatureCollection);

  const nearestCoord = nearest.geometry.coordinates;

  // a点和线的某一端点长度
  const nearestDistance = turf.distance(tTarget, nearest, units);
  // 附近
  console.log("附近的点", nearest, nearestDistance * 1000);

  const nearestIndex = tLine.findIndex(
    (t) => t[0] == nearestCoord[0] && t[1] == nearestCoord[1]
  );

  // 某一段电缆
  let cable = [];

  if (nearestIndex == 0) {
    // 起点
    cable.push(tLine[0], tLine[1]);
  } else if (nearestIndex == tLine.length) {
    // 终点
    cable.push(tLine[tLine.length - 2], tLine[tLine.length - 1]);
  } else {
    // 继续计算
    const cable1 = [tLine[nearestIndex], tLine[nearestIndex + 1]];
    const cable2 = [tLine[nearestIndex - 1], tLine[nearestIndex]];

    var d1 = turf.pointToLineDistance(tTarget, turf.lineString(cable1), units);
    var d2 = turf.pointToLineDistance(tTarget, turf.lineString(cable2), units);

    cable = d1 > d2 ? cable2 : cable1;
  }

  console.log("附近的点", nearestIndex, cable);

  // 一根线 和 2个端点
  const l1 = turf.lineString([cable[0].slice(0, 2), cable[1].slice(0, 2)]);

  const l11 = turf.point(cable[0].slice(0, 2));
  const l12 = turf.point(cable[1].slice(0, 2));

  // 最短距离， 水平距离
  var a = turf.pointToLineDistance(tTarget, l1, units);
  // a点和线的某一端点长度
  var c = turf.distance(tTarget, l11, units);
  // b点距离线的某一端点距离
  var b = Math.sqrt(c * c - a * a);

  console.log("a>>>>>", a * 1000);
  console.log("b>>>>>", b * 1000);
  console.log("c>>>>>", c * 1000);

  // 直线距离点位置
  const pb = turf.lineSliceAlong(l1, 0, b, units).geometry.coordinates[1];

  console.log("水平点所在的位置>>>>>", pb);

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
  const bH =
    cable[0][2] > cable[1][2]
      ? hMax - (b / c11) * hDiff
      : (b / c11) * hDiff + hMin;

  console.log("高度差>>>>", hDiff);
  console.log("最小高度>>>>", hMin);

  // 结果
  const ad = bH - tPoint[2];
  const bd = a * 1000;
  const cd = Math.sqrt(bd * bd + ad * ad);

  console.log("水平距离>>>>", bd);
  console.log("竖直距离>>>>", ad);
  console.log("直线距离>>>>", cd);

  const result = `水平距离: ${bd.toFixed(1)}米，竖直距离: ${ad.toFixed(
    1
  )}米，直线距离: ${cd.toFixed(1)}米`;

  const aCartesian = Cesium.Cartesian3.fromDegrees(
    tPoint[0],
    tPoint[1],
    tPoint[2]
  );
  const bCartesian = Cesium.Cartesian3.fromDegrees(pb[0], pb[1], tPoint[2]);
  const cCartesian = Cesium.Cartesian3.fromDegrees(pb[0], pb[1], bH);

  const treePoint = {
    position: aCartesian,
    name: "结果展示",
    label: {
      text: result,
      font: "14px sans-serif",
      pixelOffset: new Cesium.Cartesian2(0, 20),
      scaleByDistance: new Cesium.NearFarScalar(1.0e3, 1.5, 2.0e3, 1.0),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    /* point: {
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
        }, */
  };

  var cablePolyline = {
    name: "我是一根电缆",
    id: "polyline",
    label: {
      text: "电缆",
      font: "18px sans-serif",
    },
    polyline: {
      show: true,

      // 定义线条的 Cartesian3 位置的数组
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        ...cable[0],
        ...cable[1],
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
    id: "resultPolygon",
    polygon: {
      show: true,
      // 指定PolygonHierarchy
      hierarchy: [aCartesian, bCartesian, cCartesian],
      // height: 0, // 多边形相对于椭球面的高度
      // heightReference: Cesium.HeightReference.NONE,
      // extrudedHeight: 0, // 多边形的凸出面相对于椭球面的高度
      // extrudedHeightReference: Cesium.HeightReference.NONE,
      stRotation: 0.0, // 多边形纹理从北方逆时针旋转
      granularity: Cesium.Math.RADIANS_PER_DEGREE, // 每个纬度和经度点之间的角距离
      fill: true,
      material: Cesium.Color.YELLOW.withAlpha(0.1),
      outline: true,
      outlineColor: Cesium.Color.YELLOW,
      outlineWidth: 4.0,
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
  };

  var wall = {
    name: "电缆所在的面",
    id: "wall",
    wall: {
      show: true,

      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        ...cable[0],
        ...cable[1],
      ]),

      // 用于墙底而不是地球表面的高度数组
      // minimumHeights: [1000.0, 1000.0],
      // 用于墙顶的高度数组，而不是每个位置的高度
      // maximumHeights: [],

      granularity: Cesium.Math.RADIANS_PER_DEGREE, // 指定矩形上各点之间的角度距离
      fill: true,
      material: Cesium.Color.RED.withAlpha(0.2),
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,

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

  const dataSource = new Cesium.CustomDataSource("myEntity");

  const entityCollection = dataSource.entities;

  entityCollection.add(treePoint);
  // entityCollection.add(bPoint);
  // entityCollection.add(cPoint);
  entityCollection.add(resultPolygon);
  entityCollection.add(wall);
  entityCollection.add(cablePolyline);

  return dataSource;
};
