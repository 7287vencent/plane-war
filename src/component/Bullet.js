// 子弹
import { defineComponent, h } from "@vue/runtime-core"

import bulletImg from "../../assets/bullet.png"

export default defineComponent({
  props: ["x", "y"],
  setup (props) {

  },
  render (ctx) {
    return h("Container", { x: ctx.x, y: ctx.y }, [
      h("Sprite", { texture: bulletImg })
    ])
  }
})