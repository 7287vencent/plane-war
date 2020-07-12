import { defineComponent, h, toRefs, onMounted, onUnmounted, reactive } from "@vue/runtime-core"

import planeImg from "../../assets/plane.png"

export default defineComponent({
  props: ["x", "y"],

  setup (props, ctx) {
    console.log("plane props", props, ctx)
    // 为了防止 响应式数据丢失
    const { x, y } = toRefs(props)
    // console.log("x", x, y)

    // 飞机 按下 空格 发射 子弹 
    const handleAttack = (e) => {
      if (e.code === "Space") {
        // 发送消息 在 setup 中 不需要 $
        ctx.emit("attack", {
          x: props.x,
          y: props.y
        })
      }
    }

    // 注意 销毁 

    onMounted(() => {
      window.addEventListener("keydown", handleAttack)
    })

    onUnmounted(() => {
      window.removeEventListener("keydown".handleAttack())
    })
    return {
      x,
      y
    }
  },

  render (ctx) {
    return h("Container", { x: ctx.x, y: ctx.y }, [
      h("Sprite", { texture: planeImg })
    ])
  },
})