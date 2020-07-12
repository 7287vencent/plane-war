import * as PIXI from "pixi.js"

// mount 需要 根容器

// 初始化

const game = new PIXI.Application({
  width: 750,
  height: 1080,
})

document.body.appendChild(game.view)

export function getCanvasRootContainer () {
  return game.stage
}

export function getGame () {
  return game
}
