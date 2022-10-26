import { gameOptions } from "../consts/options";
import {gamefailedProxy,GAME_FAILED } from "../core/proxy";

//计时器
export default class Timer extends Phaser.GameObjects.Container{
    private timeleft!:number;
    private energyContainer!:Phaser.GameObjects.Sprite;
    private energybar!:Phaser.GameObjects.Sprite;
    private energyMask!:Phaser.GameObjects.Sprite;
    private gameTime!:Phaser.Time.TimerEvent;
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene){
        super(scene);
        this.scene=scene;
        this.timeleft=gameOptions.initialTime;
        this.energyContainer=scene.add.sprite(scene.scale.width/2,1128,"energycontainer");
        this.add(this.energyContainer);
        this.energybar=scene.add.sprite(this.energyContainer.x+46,this.energyContainer.y,'energybar');
        this.add(this.energybar);
        this.energyMask=scene.add.sprite(this.energybar.x,this.energybar.y,'energybar');
        this.add(this.energyMask);
        this.energyMask.visible=false;
        this.energybar.mask=new Phaser.Display.Masks.BitmapMask(scene,this.energyMask);
        scene.add.existing(this);
        this.timing();
    }
    timing():void{
         //a boring timer
         this.gameTime=this.scene.time.addEvent({
            //The  dalay in ms at which this TimerEvent fires
            delay:100,
            callback:this.mytimerbar,
            //The scope in which the callback will be called
            //调用回调的作用域,
            callbackScope:this,
            loop:true
            });
    }

    mytimerbar():void
  {
    this.timeleft--;
    //修改遮盖的长度
   
    let stepWidth:number=this.energyMask.displayWidth/gameOptions.initialTime;
    this.energyMask.x-=stepWidth;
    if(this.timeleft<=0){
      this.gameTime.paused=true;
      gamefailedProxy.emit(GAME_FAILED);
      
    };
  }
 public stoptimer():void{
    this.gameTime.paused=true;
  }
  public starttimer():void{
    this.gameTime.paused=false;
  }
}