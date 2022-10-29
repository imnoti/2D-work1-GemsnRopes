import { startgameProxy,START_GAME } from "../core/proxy";

export default class StartGame extends Phaser.GameObjects.Container{
    private gamename!:Phaser.GameObjects.Image;
    private playing!:Phaser.GameObjects.Image;
    constructor(scene){
        //设置遮盖

        super(scene,0,0);

        this.gamename=scene.add.sprite(scene.scale.width/2,300,'gamename');
        this.add(this.gamename);
        this.playing=scene.add.sprite(scene.scale.width/2,700,'play').setInteractive();
        this.add(this.playing);
        scene.add.existing(this);
        this.setDepth(3);
        //鼠标弹起时才能发送事件
        this.playing.on('pointerup',()=>{
            //发送开始游戏事件
            startgameProxy.emit(START_GAME);
        })
    
    }

}