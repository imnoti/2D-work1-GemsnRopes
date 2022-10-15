import { startgameProxy,START_GAME } from "../core/proxy";
export default class StartGame extends Phaser.GameObjects.Container{
    constructor(scene){
        //设置遮盖
        const mask=scene.add.graphics();
        mask.fillStyle(0x000000,0);
        mask.fillRect(0,0,scene.scale.width,scene.scale.height);
        
        super(scene,0,0,[mask]);

        var gamename=scene.add.sprite(scene.scale.width/2,300,'gamename');
        var playing=scene.add.sprite(scene.scale.width/2,700,'play').setInteractive();
        gamename.setDepth(12);
        playing.setDepth(12);
        scene.add.existing(this);

        playing.on('pointerdown',()=>{
            mask.setActive(false);
            mask.setVisible(false);
            playing.setActive(false);
            playing.setVisible(false);
            gamename.setActive(false);
            gamename.setVisible(false);
        })
       
    }

}