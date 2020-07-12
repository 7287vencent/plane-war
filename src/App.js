import { defineComponent, h, computed, ref } from "@vue/runtime-core"

// import StartPage from "./page/StartPage"
// import GamePage from "./page/GamePage"
import { PAGE, getPageComponent } from './page/index'
export default defineComponent({
  setup () {
    // 响应式的数据
    const currentPageName = ref(PAGE.start)

    // 计算属性
    const currentPage = computed(() => {
      return getPageComponent(currentPageName.value);
    })
    const handleNextPage = (nextPage) => {
      currentPageName.value = nextPage;
    };
    return {
      currentPage,
      handleNextPage
    }
  },
  render (ctx) {
    // console.log("ctx=>>>", ctx)
    return h("Container", [
      h(ctx.currentPage, {
        onNextPage: ctx.handleNextPage,
      })])
  }
  // return h("Container", [h(GamePage)]);
})