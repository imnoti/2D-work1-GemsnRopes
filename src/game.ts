import 'phaser';
import { GameConfig } from './config';

export class MyGame extends Phaser.Game{
  //用与访问和调用一个对象的父对象上的函数
  constructor(config: Phaser.Types.Core.GameConfig){
    super(config)
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(GameConfig);
});
