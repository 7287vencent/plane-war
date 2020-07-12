import enemyImagePath from '../../assets/enemy.png'
import { defineComponent, h, onMounted, onUnmounted, ref, watch } from '@vue/runtime-core'

export const EmemyPlaneInfo = {
  width: 308,
  height: 207,
  life: 3,
}

export default defineComponent({
  props: ['x', 'y'],
  setup (props, ctx) {
    const x = ref(props.x)
    const y = ref(props.y)

    watch(props, (newProps) => {
      x.value = newProps.x
      y.value = newProps.y
    })

    // 使用 攻击
    useAttack(ctx, x, y)
    return {
      x,
      y
    }
  },
  render (ctx) {
    return h("Sprite", {
      x: ctx.x,
      y: ctx.y,
      texture: enemyImagePath,
    });
  }
})

const useAttack = (ctx, x, y) => {
  // 发射子弹
  const attackInterval = 2000
  let intervalId

  onMounted(() => {
    intervalId = setInterval(() => {
      ctx.emit('attack', {
        x: x.value + 105,
        y: y.value + 200,
      })
    }, attackInterval)
  })

  onUnmounted(() => {
    clearInterval(intervalId)
  })
}