import {nogameProxy,NO_GAME } from "../core/proxy";
export default class GameFail extends Phaser.GameObjects.Container{

    private tryagainImage!:Phaser.GameObjects.Image;
    private yesImage!:Phaser.GameObjects.Image;
    private noImage!:Phaser.GameObjects.Image;
    private backMask!:Phaser.GameObjects.Graphics;

    constructor(scene:Phaser.Scene){
        super(scene,0,0);
        this.backMask=scene.add.graphics();
        this.backMask.fillStyle(0x000000,0.5);
        this.backMask.fillRect(0,0,scene.scale.width,scene.scale.height);
        this.backMask.setDepth(1);

        this.add(this.backMask);
        this.tryagainImage=scene.add.image(scene.scale.width/2,scene.scale.height/3,'tryagain');
        this.tryagainImage.setDepth(2);

        this.add(this.tryagainImage);
        this.yesImage=scene.add.image(this.tryagainImage.x-200,this.tryagainImage.y+100,'yes').setOrigin(0,0).setInteractive();
        this.yesImage.setDepth(2);

        this.add(this.yesImage);
        this.noImage=scene.add.image(this.tryagainImage.x+66,this.tryagainImage.y+100,'no').setOrigin(0,0).setInteractive();
        this.add(this.noImage);
        this.noImage.setDepth(2);
        scene.matter.add.
        //将存在的GameObject添加到该场景中
        scene.add.existing(this);

        this.noImage.on('pointerup',()=>{
            nogameProxy.emit(NO_GAME);
        })
    }
}