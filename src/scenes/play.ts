import { gameOptions } from "../consts/options";
import { BodyType } from "matter";
import { startgameProxy,START_GAME } from "../core/proxy";
import{upadtescoreProxy,UPDATE_SCORE} from "../core/proxy";
import {timingProxy,TIMING } from "../core/proxy";
import {timerstopProxy,TIMER_STOP } from "../core/proxy";
import {gamefailedProxy,GAME_FAILED } from "../core/proxy";
import {nogameProxy,NO_GAME } from "../core/proxy";
import BackGround from './background';
import StartGame from '../sprites/startgame';
import GameFail from '../sprites/gamefail';
import Timer from './timer';
import SEffect from "../sprites/specialEffects";

export default class PlayScene extends Phaser.Scene{
    private startmenu!:StartGame;
    private player!:Phaser.Physics.Matter.Sprite;
    private stores :Phaser.Physics.Matter.Image[]=[];
    private stars:Phaser.Physics.Matter.Image[]=[];
    private m_score;
    private target_score;
    private rope;//绳子/约束
    private graphics!: Phaser.GameObjects.Graphics;//渲染约束
    private timerbar!:Timer;
    private gamefail!:GameFail;
    private win!:Phaser.GameObjects.Image;
    private seffect!:SEffect;
    constructor(){
        super({key:"Play"});
    }
    create():void{
        //设置边界
        this.matter.world.setBounds(0,0,this.scale.width,1000);
        this.matter.world.createDebugGraphic();
        this.matter.world.drawDebug=false;

        this.scene.launch('BackGround');
        //开始ui
        this.startmenu=new StartGame(this);

        localStorage.clear();

        //更新分数
        let old=localStorage.getItem(gameOptions.localStorageName);
        this.m_score=old?parseInt(old):0;
    
       
        this.target_score=gameOptions.target_1;
        console.log(this.target_score);

        this.player=this.matter.add.sprite(this.scale.width/2,1000,'player').setScale(0.75,0.75);
        this.player.body.label=gameOptions.PLAYER;
        this.player.setCollisionGroup(gameOptions.icollosion);
        //添加石头
        for(let i=0;i<gameOptions.storenum;i++)
        {
          let store=this.matter.add.sprite(this.scale.width/8+this.scale.width/4*i,150,"store");
          store.setSensor(true);
          store.setStatic(true);
          store.body.label=gameOptions.STORE;
          store.setCollisionGroup(gameOptions.icollosion);
          this.stores.push(store as never);
        }
        
        for(let i=0;i<gameOptions.starsnum;i++)
        {
          let star=this.matter.add.image(0,0,'star',i).setScale(0.75,0.75)
          star.setStatic(true);
          star.setVisible(false);
          star.setActive(false);
          star.setSensor(true);
          star.setCollisionGroup(gameOptions.icollosion);
          star.body.label=gameOptions.STAR;
          this.stars.push(star as never);
        }
        
        this.randstar();
        this.rope=null;

        this.gamefail=new GameFail(this);
        this.gamefail.setVisible(false);
        this.gamefail.setActive(false);

        this.seffect=new SEffect(this);

        this.timerbar=new Timer(this);
        this.timerbar.setVisible(false).stoptimer();
       

        this.win=this.add.image(this.scale.width/2,this.scale.height/3,'win').setVisible(false).setScale(2,2);

        this.graphics = this.add.graphics();
        //matter中添加世界碰撞
        this.matter.world.on("collisionstart",this.IcollisionStart,this);
        //添加开始游戏的事件

        startgameProxy.on(START_GAME, this.StateMyGame,this);
        //当当前场景关闭时,取消监听
        this.events.on(Phaser.Scenes.Events.SHUTDOWN,()=>{
        startgameProxy.off(START_GAME, this.StateMyGame,this);
       });

       gamefailedProxy.on(GAME_FAILED,this.gamefiled,this);

       this.events.on(Phaser.Scenes.Events.SHUTDOWN,()=>{
        gamefailedProxy.off(GAME_FAILED,this.gamefiled,this);
       });

       nogameProxy.on(NO_GAME,this.nogame,this);
       this.events.on(Phaser.Scenes.Events.SHUTDOWN,()=>{
        nogameProxy.off(NO_GAME,this.nogame,this);
       });
      

        }

    update(): void {
       
        if(this.rope){
          this.graphics.clear();
          //更新绳子的长度
          this.rope.length-=gameOptions.constraintSpeed;
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
   
    if(distance>=gameOptions.storeRadius)
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
    //关闭开始ui
    this.startmenu.setVisible(false);
    this.startmenu.setActive(false);
    //启动鼠标点击事件
     this.input.on('pointerdown',this.fireHook,this);
     this.input.on('pointerup',this.releaseHook,this);
     //同时运行分数ui
     this.scene.launch('SCOREHUD');
     //放到最上层
     this.scene.bringToTop('SCOREHUD');
     //开始计时
     this.timerbar.setVisible(true).starttimer();
     
   }
   GameOver():void{
    this.input.off('pointerdown',this.fireHook,this);
     this.input.off('pointerup',this.releaseHook,this);
   }
  //随机出现宝石
   randstar():void
   {
    let index:number=Phaser.Math.RND.between(0,gameOptions.starsnum-1);
    let x:number=Phaser.Math.RND.between(0,this.scale.width-100);
    let y:number=Phaser.Math.RND.between(0,this.scale.height/3*2);
    this.stars[index].setCollisionGroup(gameOptions.icollosion);
    this.stars[index].setPosition(x,y);
    this.stars[index].setVisible(true);
    this.stars[index].setActive(true);
   }
   //碰撞事件的检测
   IcollisionStart(e,b1,b2):void{
    if(b2.label==gameOptions.STAR && b1.label==gameOptions.PLAYER){
      this.releaseHook();
    }
    if(b2.label==gameOptions.STAR&& b1.label==gameOptions.PLAYER)
    {
      const {x,y}=b2.position;
      this.seffect.createMergeEffect(x,y);
     
      b2.gameObject.active=false;
      b2.gameObject.visible=false;
      b2.collisionFilter.group = gameOptions.nonicollosion;
      b2.collisionFilter.mask = 0;
      this.m_score+=1;
    
      
      upadtescoreProxy.emit(UPDATE_SCORE,this.m_score);
      if(this.m_score==this.target_score)
      {
      this.win.setVisible(true);
      timerstopProxy.emit(TIMER_STOP);
      this.timerbar.stoptimer();
      this.GameOver();
     this.seffect.createParticles();
      localStorage.setItem(gameOptions.localStorageName,this.m_score);
     
      }

      this.randstar();
    }
   }

   gamefiled():void{
    console.log('游戏结束事件发生');
    this.GameOver();
    this.gamefail.setVisible(true);
    this.gamefail.setActive(true);
   }
   nogame():void{

    this.GameOver();
    this.startmenu.setVisible(true);
    this.startmenu.setActive(true);
    this.player.setPosition(this.scale.width/2,1000);
   }
   
}