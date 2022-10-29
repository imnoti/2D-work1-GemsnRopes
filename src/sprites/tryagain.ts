import {exitgameProxy,EXIT_GAME } from "../core/proxy";
import {resumegameProxy,RESUME_GAME } from "../core/proxy";
export default class TryAgain extends Phaser.GameObjects.Container{

    private tryagainImage!:Phaser.GameObjects.Image;
    private yesImage!:Phaser.GameObjects.Image;
    private noImage!:Phaser.GameObjects.Image;
    private backMask!:Phaser.GameObjects.Graphics;

    constructor(scene:Phaser.Scene){
        super(scene,0,0);
        this.backMask=scene.add.graphics();
        this.backMask.fillStyle(0x000000,0.5);
        this.backMask.fillRect(0,0,scene.scale.width,scene.scale.height);
        this.backMask.setDepth(3);

        this.add(this.backMask);
        this.tryagainImage=scene.add.image(scene.scale.width/2,scene.scale.height/3,'tryagain');

        this.add(this.tryagainImage);
        this.yesImage=scene.add.image(this.tryagainImage.x-200,this.tryagainImage.y+100,'yes').setOrigin(0,0).setInteractive();

        this.add(this.yesImage);
        this.noImage=scene.add.image(this.tryagainImage.x+66,this.tryagainImage.y+100,'no').setOrigin(0,0).setInteractive();
        this.add(this.noImage);
        //将存在的GameObject添加到该场景中
        scene.add.existing(this);
        this.setDepth(3);

        this.noImage.on('pointerup',()=>{
            exitgameProxy.emit(EXIT_GAME);
        })

        this.yesImage.on('pointerup',()=>{
            resumegameProxy.emit(RESUME_GAME);
        })
        
    }
}