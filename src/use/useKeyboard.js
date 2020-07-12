import { onMounted, onUnmounted } from "@vue/runtime-core"
/**
 * 
 * @param {*} map 注册鼠标事件，map里面包含了用户按下鼠标的事件 
 */
export const useKeyboard = (map) => {
  // 鼠标按下的 事件
  const handleKeydown = (e) => {
    const callbackObj = map[e.code]
    if (callbackObj && callbackObj.keydown) callbackObj.keydown(e)
  }
  // 鼠标 抬起的 事件
  const handleKeyup = (e) => {
    const callbackObj = mao[e.code]
    if (callbackObj && callbackObj.keyup) callbackObj.keyup(e)
  }

  // 利用生命周期 注册 事件
  onMounted(() => {
    window.addEventListener("keydown", handleKeydown)
    window.addEventListener("keyup", handleKeyup)
  })

  // 注意销毁事件
  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown)
    window.removeEventListener("keyup", handleKeyup)
  })
}