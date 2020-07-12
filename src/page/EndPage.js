import { PAGE } from './index'

import endPageAsset from '../../assets/end_page.jpg'
import restartBtn from '../../assets/restartBtn.png'
import { defineComponent, h } from '@vue/runtime-core'

export default defineComponent({
  props: ["onNextPage"],
  setup (props, ctx) {
    const handleGoToGame = () => {
      props.onNextPage(PAGE.game);
    };

    return {
      handleGoToGame,
    };
  },
  render (ctx) {
    return h("Container", [
      h("Sprite", {
        texture: endPageAsset,
        key: "1",
      }),
      h("Sprite", {
        x: 230,
        y: 515,
        texture: restartBtn,
        key: "2",
        on: {
          pointertap: ctx.handleGoToGame,
        },
        interactive: true,
        buttonMode: true,
      }),
    ]);
  },
})