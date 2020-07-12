import { defineComponent, h, computed, ref } from "@vue/runtime-core"

import StartPage from "./page/StartPage"
import GamePage from "./page/GamePage"
export default defineComponent({
  setup () {
    // 响应式的数据
    const currentPageName = ref("GamePage")

    // 计算属性
    const currentPage = computed(() => {
      if (currentPageName.value === 'StartPage') {
        return StartPage
      } else if (currentPageName.value === 'GamePage') {
        return GamePage
      }
    })

    return {
      currentPage,
      currentPageName
    }
  },
  render (ctx) {
    // console.log("ctx=>>>", ctx)
    return h("Container", [
      h(ctx.currentPage, {
        onChangePage (page) {
          console.log("page=>>", page, ctx)
          ctx.currentPageName = page
        }
      })])
  }
  // return h("Container", [h(GamePage)]);
})