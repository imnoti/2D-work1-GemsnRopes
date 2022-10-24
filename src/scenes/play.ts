import { BodyType } from "matter";
import { startgameProxy,START_GAME } from "../core/proxy";
import{upadtescoreProxy,UPDATE_SCORE} from "../core/proxy";
import {timingProxy,TIMING } from "../core/proxy";
import BackGround from './background';
import StartGame from './startgame';
import Timer from './timer';
export default class PlayScene extends Phaser.Scene{
    private startmenu!:StartGame;
    private player!:Phaser.Physics.Matter.Sprite;
    private stores :Phaser.Physics.Matter.Image[]=[];
    private stars:Phaser.Physics.Matter.Image[]=[];
    private starsnum:number=3;
    private  STORE:number=2;
    private  STAR:number=1;
    private  PLAYER:number=0;
    private nonicollosion:number=1;
    private icollosion:number=2;
    private m_score=0;
    private rope;//绳子/约束
    private graphics!: Phaser.GameObjects.Graphics;
    private timerbar!:Timer;
    constructor(){
        super({key:"Play"});
    }
    create():void{
       
      //设置边界
        this.matter.world.setBounds(0,0,this.scale.width,1000);
        this.matter.world.createDebugGraphic();
        this.matter.world.drawDebug=false;
      
        this.scene.launch('BackGround');
        this.startmenu=new StartGame(this);//开始界面
        this.player=this.matter.add.sprite(this.scale.width/2,1000,'player').setScale(0.75,0.75);
        this.player.body.label=this.PLAYER;
        this.player.setCollisionGroup(this.icollosion);
        //添加石头
        for(let i=0;i<4;i++)
        {
          let store=this.matter.add.sprite(this.scale.width/8+this.scale.width/4*i,150,"store");
          store.setStatic(true);
          store.body.label=this.STORE;
          store.setCollisionGroup(this.icollosion);
          this.stores.push(store as never);
        }
        
        for(let i=0;i<this.starsnum;i++)
        {
          let star=this.matter.add.image(0,0,'star',i).setScale(0.75,0.75)
          star.setStatic(true);
          star.setVisible(false);
          star.setActive(false);
          star.setCollisionGroup(this.icollosion);
          star.body.label=this.STAR;
          this.stars.push(star as never);
        }
        
        this.randstar();
        this.rope=null;
        this.graphics = this.add.graphics();
        //matter中添加世界碰撞
        this.matter.world.on("collisionstart",this.IcollisionStart,this);
        //添加开始游戏的事件
        startgameProxy.on(START_GAME, this.StateMyGame,this);
        //当当前场景关闭时,取消监听
        this.events.on(Phaser.Scenes.Events.SHUTDOWN,()=>{
        startgameProxy.off(START_GAME, this.StateMyGame,this);
       });

      
        }

    update(): void {
       
        if(this.rope){
          this.graphics.clear();
          //更新绳子的长度
          this.rope.length-=4;
          this.matter.world.renderConstraint(this.rope,this.graphics,0x0000ff,1,2,1,1,1);
        }
      }

    //发射绳子事件
    fireHook(e):void
  {
    let index:number=(4-(this.scale.width-e.position.x)/(this.scale.width/4));
    if(index>=0&&index<1)
      index=0;
    else if(index>=1&&index<2)
      index=1;
    else if(index>=2&&index<3)
      index=2;
    else
      index=3;

    let body1=this.player.body as BodyType;
    let store=this.stores[index] as Phaser.Physics.Matter.Sprite;
    let body2=store.body as BodyType;
     //Calculate the distance between two stes of coordinates(points)
    let distance=Phaser.Math.Distance.Between(body1.position.x,body1.position.y,body2.position.x,body2.position.y)
   
    if(distance>=25)
    {
      this.rope=this.matter.add.constraint(body1,body2,distance,0);
      this.matter.world.renderConstraint(this.rope,this.graphics,0x0000ff,1,2,1,1,1);
    }
    else{
      this.player.setStatic(true);
    }

    }
    //释放绳子
    releaseHook():void
    {
      
      this.graphics.clear();
      if(this.rope){
        this.matter.world.removeConstraint(this.rope);
        this.rope=null;
      }
    }
    //游戏开始事件
   StateMyGame():void
   { 
     this.input.on('pointerdown',this.fireHook,this);
     this.input.on('pointerup',this.releaseHook,this);
     this.scene.launch('SCOREHUD');
     this.scene.bringToTop('SCOREHUD');
     this.timerbar=new Timer(this);
     timingProxy.emit(TIMING);
    
   }
  //随机出现宝石
   randstar():void
   {
    let index:number=Phaser.Math.RND.between(0,this.starsnum-1);
    let x:number=Phaser.Math.RND.between(0,this.scale.width-100);
    let y:number=Phaser.Math.RND.between(0,this.scale.height/3*2);
    this.stars[index].setCollisionGroup(this.icollosion);
    this.stars[index].setPosition(x,y);
    this.stars[index].setVisible(true);
    this.stars[index].setActive(true);
   }
   //碰撞事件的检测
   IcollisionStart(e,b1,b2):void{
    if(b2.label==this.STAR && b1.label==this.PLAYER){
      this.releaseHook();
    }
    if(b2.label==this.STAR&& b1.label==this.PLAYER)
    {
      b2.gameObject.active=false;
      b2.gameObject.visible=false;
      b2.collisionFilter.group = this.nonicollosion;
      b2.collisionFilter.mask = 0;
      this.m_score+=1;
      upadtescoreProxy.emit(UPDATE_SCORE,this.m_score);
      this.randstar();
    }
   }
   
}