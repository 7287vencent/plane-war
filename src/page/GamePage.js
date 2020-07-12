import { defineComponent, h, reactive, toRefs, onMounted, onUnmounted } from "@vue/runtime-core"

import Map from "../component/Map"
import plane from "../component/Plane"
import Bullet from "../component/Bullet"
import { useKeyboardMove } from '../use/index'
import { getGame } from "../Game"
export default defineComponent({
  setup (props, ctx) {
    // 初始化 飞机的数据
    const plane = useCreatePlaneInfo()

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

const useCreatePlaneInfo = () => {
  const planeInfo = reactive({
    x: 150,
    y: 150,
    width: 257,
    height: 364
  })

  // 让飞机 移动起来
  const { x, y } = useKeyboardMove({ x: planeInfo.x, y: planeInfo.y, speed: 7 })

  // 让飞机开始进入的时候是 从底部缓缓进入

  planeInfo.x = x
  planeInfo.y = y
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
