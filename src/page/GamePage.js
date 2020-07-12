import { defineComponent, h, reactive, toRefs, onMounted, onUnmounted } from "@vue/runtime-core"
import TWEEN from "@tweenjs/tween.js"
import Map from "../component/Map"
import Plane, { PlaneInfo } from "../component/Plane"
import EnemyPlane, { EmemyPlaneInfo } from '../component/EnemyPlane'
import { stage } from '../config/index'
import Bullet from "../component/Bullet"
import { useKeyboardMove } from '../use/index'
import { getGame } from "../Game"
import { moveEnemyPlane } from '../util/moveEnemyPlane'
export default defineComponent({
  setup (props, ctx) {
    // 初始化 飞机的数据
    const selfPlane = useCreatePlaneInfo({
      x: stage.width / 2 - 60,
      y: stage.height,
      speed: 7
    })
    // 创建 敌方 战机
    const enemyPlanes = useEnemyPlanes();
    // 子弹的数据
    const bullets = reactive([])

    // 飞机 发射子弹 的事件
    const handleAttack = (info) => {
      // 把 props 添加 进入 bullets中
      bullets.push({ x: info.x + 100, y: info.y })
    }



    // 发射子弹 ，让子弹动起来
    getGame().ticker.add(() => {
      // moveBullets(bullets)
      // moveEnemyPlane(enemyPlanes)
      // console.log(bullets.length);ç

    })


    return {
      selfPlane,
      enemyPlanes,
      bullets,
      handleAttack
    }
  },
  render (ctx) {
    // 子弹的逻辑
    const renderBullets = () => {
      return ctx.bullets.map((info) => {
        return h(Bullet, { x: info.x, y: info.y })
      })
    }

    // 创建敌方战机
    const createEnemyPlane = (info, index) => {
      return h(EnemyPlane, {
        key: "EnemyPlane" + index,
        x: info.x,
        y: info.y,
        height: info.height,
        width: info.width,
        // onAttack: ctx.handleEnemyPlaneAttack,
      });
    }

    return h("Container", [
      h(Map),
      h(Plane, {
        x: ctx.selfPlane.x,
        y: ctx.selfPlane.y,
        onAttack: ctx.handleAttack
      }),
      ...renderBullets(),
      ...ctx.enemyPlanes.map(createEnemyPlane)
    ])
  }
})
// 我方 战机 的数据
const useCreatePlaneInfo = ({ x, y, speed }) => {
  const selfPlane = reactive({
    x,
    y,
    speed,
    width: PlaneInfo.width,
    height: PlaneInfo.height
  })

  // 让飞机 移动起来
  const { x: selfPlaneX, y: selfPlaneY } = useKeyboardMove({ x, y, speed })

  // 让飞机开始进入的时候是 从底部缓缓进入 利用 tween
  // 缓动 入场
  var tween = new TWEEN.Tween({
    x,
    y
  }).to({ y: y - 350 }, 1000)
    .start()

  tween.onUpdate((obj) => {
    selfPlane.x = obj.x
    selfPlane.y = obj.y
  })

  const handleTicker = () => {
    TWEEN.update()
  }

  onMounted(() => {
    getGame().ticker.add(handleTicker)
  })

  onUnmounted(() => {
    getGame().ticker.remove(handleTicker)
  })

  selfPlane.x = selfPlaneX
  selfPlane.y = selfPlaneY
  return selfPlane
}

// 创建 敌方战机
const useEnemyPlanes = () => {
  // 生产战机
  const createEnemyPlaneData = (x) => {
    return {
      x,
      y: 0,
      width: EmemyPlaneInfo.width,
      height: EmemyPlaneInfo.height,
      life: EmemyPlaneInfo.life
    }
  }
  const enemyInterval = 2000 // 战机创建的事件间隔
  const enemyPlanes = reactive([]) // 存储所有的战机

  // setInterval(() => {
  // const x = Math.floor((1 + stage.width) * Math.random()); // 敌方战机的 初始化 地点
  const x = 100
  enemyPlanes.push(createEnemyPlaneData(x));
  // }, enemyInterval)

  return enemyPlanes

}

// 子弹动起来的函数
const moveBullets = (bullets) => {
  const speed = 5
  bullets.forEach((bullet, index) => {
    bullet.y -= speed
    if (bullet.y < 0) {
      removeBullets(bullets, index)
    }

  })
}

// 删除 销毁的子弹
const removeBullets = (bullets, index) => {
  bullets.splice(index, 1)
}
