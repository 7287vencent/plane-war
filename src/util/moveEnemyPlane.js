import { stage } from '../config/index'
console.log("stage", stage)
export const moveEnemyPlane = (enemyPlans) => {
  // const speed = 1 // 飞机移
  enemyPlans.forEach((plane, index) => {
    if (!plane.moveInfo) {
      plane.moveInfo = {}
      plane.moveInfo.dir = -1  // 移动方向
      plane.moveInfo.count = 0  // 移动次数
    }
    // 移动效果
    plane.y++
    plane.x += 1 * plane.moveInfo.dir // 1 可以修改，是飞机移动的速率
    plane.moveInfo.count++

    // 随机更改方向
    if (plane.count > 120) {
      const factor = Math.random() > 0.5 ? 1 : -1
      plane.moveInfo.dir = plane.moveInfo.dir * factor
      plane.moveInfo.count = 0
    }

    // 检测是否在 边界
    if (isArrivedLeftBorder(plane)) {
      plane.x = 0
      plane.moveInfo.dir = 1

    }
    if (isArrivedRightBorder(plane)) {

      plane.x = stage.width - plane.width
      plane.moveInfo.dir = -1
    }

  })
}

function isArrivedLeftBorder (enemyPlane) {
  return enemyPlane.x <= 0
}

function isArrivedRightBorder (enemyPlane) {
  return enemyPlane.width + enemyPlane.x >= stage.width
}