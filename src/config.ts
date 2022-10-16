import 'phaser';
import BackGround from './scenes/background';
import Boot from './scenes/boot';
import Play from './scenes/play';


export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Gemsn Ropes',
  version: '2.0',
  width:750,
  height: 1334,
  scale:{
    //The Width and height are automatically adjust to
    //fit inside the given target area,while keeping the aspect ratio
    mode:Phaser.Scale.FIT,
    autoCenter:Phaser.Scale.CENTER_BOTH
  },
  type: Phaser.AUTO,
  parent: 'game',
  scene: [Boot,BackGround,Play],
  backgroundColor: '#003412',
  physics: {
    default: "matter",
    matter: {
        gravity: {
            y: 2
        },
        debug: true
    }
},
  render: { pixelArt: false, antialias: true }
};

