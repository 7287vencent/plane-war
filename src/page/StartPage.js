import { defineComponent, h } from "@vue/runtime-core"

import startPageImg from "../../assets/start_page.jpg"

import startBtn from "../../assets/startBtn.png"

import { PAGE } from './index'
export default defineComponent({
  props: ["onNextPage"],
  setup (props, ctx) {
    const handleGoToGame = () => {
      // console.log("开始游戏")
      props.onNextPage(PAGE.game);
    };

    return {
      handleGoToGame,
    };
  },
  render (ctx) {
    // 显示一张图片 
    return h("Container", [
      h("Sprite", {
        texture: startPageImg,
        key: "1",
      }),
      h("Sprite", {
        texture: startBtn,
        x: 227,
        y: 512,
        key: "2",
        interactive: true,
        buttonMode: true,
        on: {
          pointertap: ctx.handleGoToGame,
        },
      })
    ])

  }
})