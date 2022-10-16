import { BodyType } from "matter";
import BackGround from './background';
import StartGame from './startgame';

export default class PlayScene extends Phaser.Scene{
    private startmenu!:StartGame;
    private player!:Phaser.Physics.Matter.Sprite;
    private stores :Phaser.Physics.Matter.Sprite[]=[];
    private rope;//绳子/约束
    constructor(){
        super({key:"Play"});
    }
    create():void{
        this.matter.world.setBounds(0,0,this.scale.width,1000);
        //this.matter.world.createDebugGraphic();
        //this.matter.world.drawDebug=false;

        this.scene.launch('BackGround');
        this.startmenu=new StartGame(this);//开始界面
      
        this.player=this.matter.add.sprite(this.scale.width/2,1000,'player');
        //添加石头
        for(let i=0;i<4;i++)
        {
          let store=this.matter.add.sprite(this.scale.width/8+this.scale.width/4*i,150,"store");
          store.setStatic(true);
          this.stores.push(store as never);
        }

        this.rope=null;

        //event listeners
         this.input.on('pointerdown',this.fireHook,this);
  
         this.input.on('pointerup',this.releaseHook,this);
    }

    update(): void {
        if(this.rope){
          this.rope.length-=4;
        }
      
      }


    fireHook(e)
  {
   console.log('触发点击事件')
    let index:number=(4-(this.scale.width-e.position.x)/100);
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
    
    if(distance>22)
    {
        console.log('触发约束事件')
      //Constraints (or joint) are used for specifying that a fixed distance must be maiintainde between two bodies,or a body and a fixed world-space po
      this.rope=this.matter.add.constraint(body1,body2,distance,0);
      
    }
      
   
    }
    releaseHook()
    {
      if(this.rope){
        this.matter.world.removeConstraint(this.rope);
        this.rope=null;
      }
    }

    
  

}