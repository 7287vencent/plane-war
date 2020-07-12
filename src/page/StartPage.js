import { defineComponent, h } from "@vue/runtime-core"

import startPageImg from "../../assets/start_page.jpg"

import startBtn from "../../assets/startBtn.png"

export default defineComponent({
  render (ctx) {
    // 显示一张图片 
    return h("Container", [
      h("Sprite", {
        texture: startPageImg
      }),
      h("Sprite", {
        texture: startBtn,
        x: 227,
        y: 512,
        interactive: true,
        onClick () {
          console.log('click', ctx);
          // 子组件 向 父组件 传递参数
          ctx.$emit("changePage", "GamePage")
        }
      })
    ])

  }
})