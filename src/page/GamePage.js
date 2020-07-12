import { defineComponent, h, reactive, toRefs, onMounted, onUnmounted } from "@vue/runtime-core"
import TWEEN from "@tweenjs/tween.js"
import Map from "../component/Map"
import Plane, { PlaneInfo } from "../component/Plane"
import EnemyPlane, { EmemyPlaneInfo } from '../component/EnemyPlane'
import { stage } from '../config/index'
import Bullet, { SelfBulletInfo, EnemyBulletInfo } from "../component/Bullet"
import { useKeyboardMove } from '../use/index'
import { getGame } from "../Game"
import { moveEnemyPlane } from '../util/moveEnemyPlane'
import { moveBullets } from '../util/moveBullets'
import { hitTestRectangle } from '../util/hitTestRectangle'
import { PAGE } from './index'
const game = getGame()
let hashCode = 0;
const createHashCode = () => {
  return hashCode++;
};

export default defineComponent({
  props: ["onNextPage"],
  setup (props, ctx) {
    // 初始化 飞机的数据
    const selfPlane = useCreatePlaneInfo({
      x: stage.width / 2 - 60,
      y: stage.height,
      speed: 7
    })
    // 创建我方子弹
    const selfBullets = reactive([]);
    // 创建 敌方 战机
    const enemyPlanes = useEnemyPlanes();
    // 创建 敌方 子弹
    const enemyPlaneBullets = reactive([]);
    // 我放子弹 的数据信息
    const handlePlaneAttack = ({ x, y }) => {
      const id = createHashCode();
      const width = SelfBulletInfo.width;
      const height = SelfBulletInfo.height;
      const rotation = SelfBulletInfo.rotation;
      const dir = SelfBulletInfo.dir;
      selfBullets.push({ x, y, id, width, height, rotation, dir });
    };
    // 敌方 子弹 的数据信息
    const handleEnemyPlaneAttack = ({ x, y }) => {
      const id = createHashCode();
      const width = EnemyBulletInfo.width;
      const height = EnemyBulletInfo.height;
      const rotation = EnemyBulletInfo.rotation;
      const dir = EnemyBulletInfo.dir;
      enemyPlaneBullets.push({ x, y, id, width, height, rotation, dir });
    };

    const handleGameOver = () => {
      props.onNextPage(PAGE.end);
    };
    useFighting({
      selfPlane,
      selfBullets,
      enemyPlanes,
      enemyPlaneBullets,
      gameOverCallback: handleGameOver
    })

    return {
      selfPlane,
      enemyPlanes,
      selfBullets,
      enemyPlaneBullets,
      handlePlaneAttack,
      handleEnemyPlaneAttack,
    }
  },
  render (ctx) {
    // 创建子弹
    const createBullet = (info, index) => {
      return h(Bullet, {
        key: "Bullet" + info.id,
        x: info.x,
        y: info.y,
        id: info.id,
        width: info.width,
        height: info.height,
        rotation: info.rotation,
        dir: info.dir,
        // onDestroy: ctx.handleBulletDestroy,
      });
    };

    // 创建敌方战机
    const createEnemyPlane = (info, index) => {
      return h(EnemyPlane, {
        key: "EnemyPlane" + index,
        x: info.x,
        y: info.y,
        height: info.height,
        width: info.width,
        onAttack: ctx.handleEnemyPlaneAttack,
      });
    }
    // 创建 我方 战机
    const createSelfPlane = () => {
      return h(Plane, {
        x: ctx.selfPlane.x,
        y: ctx.selfPlane.y,
        speed: ctx.selfPlane.speed,
        onAttack: ctx.handlePlaneAttack,
      });
    };

    return h("Container", [
      h(Map),
      createSelfPlane(),
      ...ctx.enemyPlanes.map(createEnemyPlane),
      ...ctx.selfBullets.map(createBullet),
      ...ctx.enemyPlaneBullets.map(createBullet),
    ])
  }
})
// 我方 战机 的数据
const useCreatePlaneInfo = ({ x, y, speed }) => {
  const selfPlane = reactive({
    x,
    y,
    speed,
    width: PlaneInfo.width,
    height: PlaneInfo.height
  })

  // 让飞机 移动起来
  const { x: selfPlaneX, y: selfPlaneY } = useKeyboardMove({ x, y, speed })

  // 让飞机开始进入的时候是 从底部缓缓进入 利用 tween
  // 缓动 入场
  var tween = new TWEEN.Tween({
    x,
    y
  }).to({ y: y - 350 }, 1000)
    .start()

  tween.onUpdate((obj) => {
    selfPlane.x = obj.x
    selfPlane.y = obj.y
  })

  const handleTicker = () => {
    TWEEN.update()
  }

  onMounted(() => {
    getGame().ticker.add(handleTicker)
  })

  onUnmounted(() => {
    getGame().ticker.remove(handleTicker)
  })

  selfPlane.x = selfPlaneX
  selfPlane.y = selfPlaneY
  return selfPlane
}

// 创建 敌方战机
const useEnemyPlanes = () => {
  // 生产战机
  const createEnemyPlaneData = (x) => {
    return {
      x,
      y: 0,
      width: EmemyPlaneInfo.width,
      height: EmemyPlaneInfo.height,
      life: EmemyPlaneInfo.life
    }
  }
  const enemyInterval = 600 // 战机创建的事件间隔
  const enemyPlanes = reactive([]) // 存储所有的战机

  setInterval(() => {
    const x = Math.floor((1 + stage.width) * Math.random()); // 敌方战机的 初始化 地点
    // const x = 100
    if (enemyPlanes.length < 2) {
      enemyPlanes.push(createEnemyPlaneData(x));
    }
  }, enemyInterval)

  return enemyPlanes

}


// 战斗逻辑
const useFighting = ({
  selfPlane,
  selfBullets,
  enemyPlanes,
  enemyPlaneBullets,
  gameOverCallback
}) => {

  const handleTicker = () => {
    moveBullets(selfBullets); // 我放 子弹 移动
    moveBullets(enemyPlaneBullets); // 敌方 子弹 移动
    moveEnemyPlane(enemyPlanes);  // 敌方飞机 移动

    // 下面是碰撞检测 
    // 先检测，我方 子弹 和敌方子弹，飞机 是否有碰撞
    selfBullets.forEach((selfBullet, selfBulletIndex) => {
      // 检测 我方 子弹 和 敌方 子弹 碰撞
      enemyPlaneBullets.forEach((enemyBullet, enemyBulletIndex) => {
        const isIntersect = hitTestRectangle(selfBullet, enemyBullet)
        if (isIntersect) {
          selfBullets.splice(selfBulletIndex, 1)
          enemyPlaneBullets.splice(enemyBulletIndex, 1)
        }
      })

      // 同理 检测 与 敌方飞机的碰撞
      enemyPlanes.forEach((enemyPlane, enemyPlaneIndex) => {
        const isIntersect = hitTestRectangle(selfBullet, enemyPlane);
        if (isIntersect) {
          selfBullets.splice(selfBulletIndex, 1);

          // 敌机需要减血
          enemyPlane.life--;
          if (enemyPlane.life <= 0) {
            // todo
            // 可以让实例发消息过来在销毁
            // 因为需要在销毁之前播放销毁动画
            enemyPlanes.splice(enemyPlaneIndex, 1);
          }
        }
      });
    })
    const hitSelfHandle = (enemyObject) => {
      const isIntersect = hitTestRectangle(selfPlane, enemyObject);
      if (isIntersect) {
        // 碰到我方飞机
        // 直接 game over
        // 跳转到结束页面
        // console.log("游戏结束")
        gameOverCallback && gameOverCallback();
      }
    };

    // 遍历敌军的子弹
    enemyPlaneBullets.forEach((enemyBullet, enemyBulletIndex) => {
      hitSelfHandle(enemyBullet);
    });

    // 遍历敌军
    // 我方和敌军碰撞也会结束游戏
    enemyPlanes.forEach((enemyPlane) => {
      hitSelfHandle(enemyPlane);
    });
  }

  onUnmounted(() => {
    game.ticker.remove(handleTicker);
  });

  onMounted(() => {
    game.ticker.add(handleTicker);
  });
}
