import { getGame } from '../Game'
import { ref, onMounted, onUnmounted } from '@vue/runtime-core'
const game = getGame()

/*
  思维逻辑:
  1. 先监听 keyDown 和 keyUp 两个键盘事件，并且在 onMounted 时候，启用 game 对象 的 ticker事件执行动画
  2. 利用 栈(moveCommand) 
  3. 当 键盘(keyDown) 按下去的时候 检测 栈中是否有这个事件，如果不存在的话，就添加进入栈，否则不操作
  4. 当 键盘(keyup) 抬起的时候，就把栈当中的 当前抬起事件 删除
  5. 动画事件 handleTicker 一直会执行，按照键盘的指令执行
/*



/**
 * 
 * @param {*} param0 
 */

const commandType = {
  upAndDown: "upAndDown",
  leftAndRight: "leftAndRight"
}

export const useKeyboardMove = ({ x, y, speed }) => {
  // 响应式变量 x, y
  const moveX = ref(x)
  const moveY = ref(y)

  // 记录移动命令 
  const moveCommand = []

  const downCommand = {
    type: commandType.upAndDown,
    id: 1,
    dir: 1
  }

  const upCommand = {
    type: commandType.upAndDown,
    id: 2,
    dir: -1
  }

  const leftCommand = {
    type: commandType.leftAndRight,
    id: 3,
    dir: -1
  }

  const rightCommand = {
    type: commandType.leftAndRight,
    id: 4,
    dir: 1
  }
  // 判断是否在栈中
  const isEmptyCommand = (command) => {
    const id = command.id
    const result = moveCommand.findIndex((c) => c.id === id)
    if (result) return true
    return false
  }
  // 移除栈中的事件
  const removeCommand = (command) => {
    const id = command.id
    const index = moveCommand.findIndex((c) => c.id === id)
    moveCommand.splice(index, 1)
  }

  const findUpAndDownCommand = () => {
    return moveCommand.find((c) => c.type === commandType.upAndDown)
  }

  const findLeftAndRightCommand = () => {
    return moveCommand.find((c) => c.type === commandType.leftAndRight)
  }

  // 一直执行的动画事件
  // 先在栈中 查找 是否存在扎个命令
  const handleTicker = () => {
    const upAndDownCommand = findUpAndDownCommand()
    if (upAndDownCommand) {
      moveY.value += speed * upAndDownCommand.dir
    }

    const leftAndRightCommand = findLeftAndRightCommand()
    if (leftAndRightCommand) {
      moveX.value += speed * leftAndRightCommand.dir
    }
  }

  // 键盘 事件的四种状态
  const commandMap = {
    ArrowUp: upCommand,
    ArrowDown: downCommand,
    ArrowLeft: leftCommand,
    ArrowRight: rightCommand
  }

  // 键盘按下的事件
  const handleKeyDown = (e) => {
    const command = commandMap[e.code]
    // 检测是否在栈中
    if (command && isEmptyCommand(command)) {
      // 插入栈头部
      moveCommand.unshift(command)
    }
  }

  // 键盘 抬起的事件
  const handleKeyUp = (e) => {
    const command = commandMap[e.code]
    if (command) {
      removeCommand(command)
    }
  }

  // 第一步
  onMounted(() => {
    game.ticker.add(handleTicker)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
  })

  onUnmounted(() => {
    game.ticker.remove(handleTicker)
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  })

  return {
    x: moveX,
    y: moveY
  }
}