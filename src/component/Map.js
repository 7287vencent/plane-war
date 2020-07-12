import { defineComponent, h, ref } from "@vue/runtime-core"

import mapImg from "../../assets/map.jpg"
import { getGame } from "../Game"

export default defineComponent({
  setup () {
    // 让 地图 动起来
    const mapHeight = 1080

    const mapY1 = ref(0)
    const mapY2 = ref(-mapHeight)

    // 速率
    const speed = 5
    getGame().ticker.add(() => {
      mapY1.value += speed
      mapY2.value += speed
      // console.log("1111",)
      if (mapY1.value >= mapHeight) {
        mapY1.value = -mapHeight
      }
      if (mapY2.value >= mapHeight) {
        mapY2.value = -mapHeight
      }
    })
    return {
      mapY1,
      mapY2
    }
  },
  render (ctx) {
    return h("Container", [
      h("Sprite", { texture: mapImg, y: ctx.mapY1 }),
      h("Sprite", { texture: mapImg, y: ctx.mapY2 })
    ])
  }
})