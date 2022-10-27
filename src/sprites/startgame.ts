import { startgameProxy,START_GAME } from "../core/proxy";

export default class StartGame extends Phaser.GameObjects.Container{
    private gamename!:Phaser.GameObjects.Image;
    private playing!:Phaser.GameObjects.Image;
    constructor(scene){
        //设置遮盖
        const mask=scene.add.graphics();
        mask.fillStyle(0x000000,0);
        mask.fillRect(0,0,scene.scale.width,scene.scale.height);
        
        super(scene,0,0,[mask]);

        this.gamename=scene.add.sprite(scene.scale.width/2,300,'gamename');
        this.add(this.gamename);
        this.playing=scene.add.sprite(scene.scale.width/2,700,'play').setInteractive();
        this.add(this.playing);
        this.gamename.setDepth(1);
        this.playing.setDepth(1);
        scene.add.existing(this);
        
        //鼠标弹起时才能发送事件
        this.playing.on('pointerup',()=>{
            //发送开始游戏事件
            startgameProxy.emit(START_GAME);
            
        })
       
    }

}