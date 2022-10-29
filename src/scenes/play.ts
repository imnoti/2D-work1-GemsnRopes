import { gameOptions } from "../consts/options";
import { BodyType } from "matter";
import { startgameProxy,START_GAME } from "../core/proxy";
import{upadtescoreProxy,UPDATE_SCORE} from "../core/proxy";
import {timerstopProxy,TIMER_STOP } from "../core/proxy";
import {gameoverProxy,GAME_OVER } from "../core/proxy";
import {exitgameProxy,EXIT_GAME } from "../core/proxy";
import {resumegameProxy,RESUME_GAME } from "../core/proxy";
import BackGround from '../sprites/background';
import StartGame from '../sprites/startgame';
import TryAgain from '../sprites/tryagain';
import Timer from '../sprites/timer';
import SEffect from "../sprites/specialEffects";
import MyLogic from "../core/logic";

export default class PlayScene extends Phaser.Scene{
    private startmenu!:StartGame;//开始游戏
    private player!:Phaser.Physics.Matter.Sprite;//玩家
    private stores :Phaser.Physics.Matter.Image[]=[];//石头
    private stars:Phaser.Physics.Matter.Image[]=[];//星星
    private rope;//绳子/约束
    private graphics!: Phaser.GameObjects.Graphics;//渲染约束
    private timerbar!:Timer;//时间轴
    private tryagain!:TryAgain;//是否再来一次
    private seffect!:SEffect;//特效
    private background!:BackGround;//背景
    private textScore!:Phaser.GameObjects.Text;
    private besttextScore!:Phaser.GameObjects.Text;
    private mylogic!:MyLogic;//分数
    private m_scoresound!: Phaser.Sound.BaseSound;
    private m_moveSound!:Phaser.Sound.BaseSound;
    private m_growSound!:Phaser.Sound.BaseSound;
    private kD2R: number = Phaser.Math.DEG_TO_RAD;//Math.PI / 180;

    constructor(){
        super({key:"Play"});
    }
    create():void{
        localStorage.clear();
        //设置边界
        this.matter.world.setBounds(0,0,this.scale.width,1000);
        this.matter.world.createDebugGraphic();
        this.matter.world.drawDebug=false;
        //背景
        this.background=new BackGround(this);
        
        //分数
        let num=localStorage.getItem(gameOptions.localStorageName);
        let best=num?parseInt(num):0;
        this.mylogic=new MyLogic(best);
        this.textScore=this.add.text(10,10,`score:${this.mylogic.m_score}`,{ font: '64px Arial' }).setVisible(false);
        this.besttextScore=this.add.text(10,80,`bestscore:${this.mylogic.bestscore}`,{ font: '64px Arial' }).setVisible(false);

        this.player=this.matter.add.sprite(this.scale.width/2,1000,'player').setScale(0.75,0.75).setDepth(2);
        this.player.body.label=gameOptions.PLAYER;
        this.player.setCollisionGroup(gameOptions.icollosion);
        //添加石头
        for(let i=0;i<gameOptions.storenum;i++)
        {
          let store=this.matter.add.sprite(this.scale.width/8+this.scale.width/4*i,150,"store").setDepth(1);
          store.setSensor(true);
          store.setStatic(true);
          store.body.label=gameOptions.STORE;
          store.setCollisionGroup(gameOptions.icollosion);
          this.stores.push(store as never);
        }
        
        for(let i=0;i<gameOptions.starsnum;i++)
        {
          let star=this.matter.add.image(0,0,'star',i).setScale(0.75,0.75).setDepth(1);
          star.setStatic(true);
          star.setVisible(false);
          star.setActive(false);
          star.setSensor(true);
          star.setCollisionGroup(gameOptions.icollosion);
          star.body.label=gameOptions.STAR;
          this.stars.push(star as never);
        }
        let bird1=this.add.image(10,this.scale.height/3,'bird',0).setDepth(2);
        this.tweens.add({
          targets:bird1,
          props:{
            x:{value:this.scale.width-50,duration:4000,flipX:true},
            y:{value:this.scale.height/3+50,duration:8000}
          },
          ease:'Sine.easeInOut',
          yoyo:true,
          repeat:-1
        });

        let bird2=this.add.image(10,this.scale.height/2,'bird',1).setDepth(2);
        this.tweens.add({
          targets:bird2,
          props:{
            x:{value:this.scale.width-50,duration:6000,flipX:true},
            y:{value:this.scale.height/2+50,duration:8000}
          },
          ease:'Sine.easeInOut',
          yoyo:true,
          repeat:-1
        });

        this.randstar();
        this.rope=null;

        //开始ui
        this.startmenu=new StartGame(this);

        this.tryagain=new TryAgain(this);
        this.tryagain.setVisible(false);
        this.tryagain.setActive(false);
        //特效
        this.seffect=new SEffect(this);
        //计时器
        this.timerbar=new Timer(this);
        this.timerbar.setVisible(false).stoptimer();
        //音效
        this.m_scoresound=this.sound.add('scoresound');
        this.m_moveSound=this.sound.add('movesound');
        this.m_growSound=this.sound.add('growsound');
        //绘制约束
        this.graphics = this.add.graphics();
        //matter中添加世界碰撞
        this.matter.world.on("collisionstart",this.IcollisionStart,this);
        //添加开始游戏的事件

      //开始游戏事件
        startgameProxy.on(START_GAME, this.StateMyGame,this);
       //时间到 游戏结束界面
       gameoverProxy.on(GAME_OVER,this.GameOver,this);
        //继续游戏
       resumegameProxy.on(RESUME_GAME,this.resumegame,this);
        //结束游戏
        exitgameProxy.on(EXIT_GAME,this.exitgame,this);
        }

    update(): void {
       
        if(this.rope){
          this.graphics.clear();
          this.m_moveSound.play();
          //更新绳子的长度
          if(this.rope.length-gameOptions.constraintSpeed>gameOptions.playersize)
          {
            this.rope.length-=gameOptions.constraintSpeed;
            this.matter.world.renderConstraint(this.rope,this.graphics,0x0000ff,1,2,1,1,1);
          }
        }
        else{
          let tmp=this.player.rotation;
          this.player.setRotation(Phaser.Math.Clamp(tmp,-this.kD2R*30,this.kD2R*30));
        }
      }

    //发射绳子事件
    fireHook(e):void
  {
    let index:number=Math.floor(4-(this.scale.width-e.position.x)/(this.scale.width/4));
    console.log(index);
  
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
     //启动鼠标点击事件
     this.input.on('pointerdown',this.fireHook,this);
     this.input.on('pointerup',this.releaseHook,this);
    //关闭开始ui
    this.startmenu.setVisible(false);
    this.startmenu.setActive(false);
    this.textScore.setVisible(true);
    this.besttextScore.setVisible(true);
     //开始计时
     this.timerbar.setVisible(true).starttimer();
   }
   //游戏结束
   GameOver():void{
    this.m_growSound.play();
    this.seffect.createParticles();
    let maxscore=Math.max(this.mylogic.m_score,this.mylogic.bestscore); 
    localStorage.setItem(gameOptions.localStorageName,maxscore as any);

    if(this.rope)
    {
      this.graphics.clear();
      this.matter.world.removeConstraint(this.rope);
        this.rope=null;
    }

    this.input.off('pointerdown',this.fireHook,this);
    this.input.off('pointerup',this.releaseHook,this);

    this.tryagain.setVisible(true);
    this.tryagain.setVisible(true);

   }
  
   exitgame():void{
    this.tryagain.setActive(false).setVisible(false);
    this.startmenu.setActive(true).setVisible(true);
    this.player.setPosition(this.scale.width/2,1000);
    this.mylogic.reset();
    this.timerbar.reset();
   }

   resumegame():void
   {
     //启动鼠标点击事件
     this.input.on('pointerdown',this.fireHook,this);
     this.input.on('pointerup',this.releaseHook,this);

    this.tryagain.setVisible(false).setActive(false);
    this.mylogic.reset();
    this.timerbar.reset();
    this.timerbar.starttimer();

   }

   //随机出现宝石
   randstar():void
   {
    let index:number=Phaser.Math.RND.between(0,gameOptions.starsnum-1);
    let x:number=Phaser.Math.RND.between(100,this.scale.width-100);
    let y:number=Phaser.Math.RND.between(100,this.scale.height/3*2);
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
      this.m_scoresound.play();
      const {x,y}=b2.position;
      this.seffect.createMergeEffect(x,y);
     
      b2.gameObject.active=false;
      b2.gameObject.visible=false;
      b2.collisionFilter.group = gameOptions.nonicollosion;
      b2.collisionFilter.mask = 0;
      this.mylogic.addScore(1);
      this.randstar();
      this.textScore.text=`score:${this.mylogic.m_score}`;
    }
   }

  
   
}