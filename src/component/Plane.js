import { defineComponent, h, toRefs, onMounted, onUnmounted, reactive, ref } from "@vue/runtime-core"

import planeImg from "../../assets/plane.png"
import { getGame } from '../Game'
import { useKeyboard } from '../use/index'
const game = getGame()
export const PlaneInfo = {
  width: 258,
  height: 364
}

export default defineComponent({
  props: ["x", "y"],

  setup (props, ctx) {
    console.log("plane props", props, ctx)
    // 为了防止 响应式数据丢失
    const { x, y } = toRefs(props)
    // console.log("x", x, y)

    useAttackHandler(x, y, ctx)
    // 注意 销毁 

    // onMounted(() => {
    //   window.addEventListener("keydown", useAttackHandler)
    // })

    // onUnmounted(() => {
    //   window.removeEventListener("keydown", useAttackHandler)
    // })
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

const useAttackHandler = (x, y, ctx) => {
  let isAttack = false
  // 攻击 时间间隔
  let ATTACK_INTERVAL = 10
  let startTime = 0;

  const handleTicker = () => {
    if (isAttack) {
      startTime++;
      if (startTime > ATTACK_INTERVAL) {
        emitAttack();
        startTime = 0;
      }
    }
  };

  onMounted(() => {
    game.ticker.add(handleTicker);
  });

  onUnmounted(() => {
    game.ticker.remove(handleTicker);
  });

  const emitAttack = () => {
    ctx.emit("attack", {
      x: x.value + 110,
      y: y.value + 0,
    });
  };

  const startAttack = () => {
    isAttack = true;
    startTime = 100;
  };
  const stopAttack = () => {
    isAttack = false;
  };

  useKeyboard({
    Space: {
      keydown: startAttack,
      keyup: stopAttack,
    },
  });
}