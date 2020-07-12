import { defineComponent, h, reactive, toRefs, onMounted, onUnmounted } from "@vue/runtime-core"
import TWEEN from "@tweenjs/tween.js"
import Map from "../component/Map"
import plane from "../component/Plane"
import Bullet from "../component/Bullet"
import { useKeyboardMove } from '../use/index'
import { getGame } from "../Game"
export default defineComponent({
  setup (props, ctx) {
    // 初始化 飞机的数据
    const plane = useCreatePlaneInfo({ x: 150, y: 1000, speed: 7 })

    // 子弹的数据
    const bullets = reactive([])

    // 飞机 发射子弹 的事件
    const handleAttack = (info) => {
      // 把 props 添加 进入 bullets中
      bullets.push({ x: info.x + 100, y: info.y })
    }

    // 发射子弹 ，让子弹动起来
    getGame().ticker.add(() => {
      moveBullets(bullets)
      // console.log(bullets.length);ç

    })


    return {
      plane,
      bullets,
      handleAttack
    }
  },
  render (ctx) {

    const renderBullets = () => {
      return ctx.bullets.map((info) => {
        return h(Bullet, { x: info.x, y: info.y })
      })
    }

    return h("Container", [
      h(Map),
      h(plane, {
        x: ctx.plane.x,
        y: ctx.plane.y,
        onAttack: ctx.handleAttack
      }),
      ...renderBullets()
    ])
  }
})

const useCreatePlaneInfo = ({ x, y, speed }) => {
  const planeInfo = reactive({
    x: x,
    y: y,
    width: 257,
    height: 364
  })

  // 让飞机 移动起来
  const { x: selfPlaneX, y: selfPlaneY } = useKeyboardMove({ x: planeInfo.x, y: planeInfo.y, speed: 7 })

  // 让飞机开始进入的时候是 从底部缓缓进入 利用 tween
  // 缓动 入场
  var tween = new TWEEN.Tween({
    x,
    y
  }).to({ y: y - 550 }, 1000)
    .start()

  tween.onUpdate((obj) => {
    planeInfo.x = obj.x
    planeInfo.y = obj.y
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

  planeInfo.x = selfPlaneX
  planeInfo.y = selfPlaneY
  return planeInfo
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
