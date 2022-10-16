import BackGround from './background';
import StartGame from './startgame';

export default class PlayScene extends Phaser.Scene{
    private startmenu!:StartGame;
    private player!:Phaser.Physics.Matter.Sprite;
    constructor(){
        super({key:"Play"});
    }
    create():void{
        this.matter.world.setBounds(0,0,this.scale.width,1000);
        this.matter.world.createDebugGraphic();
        this.matter.world.drawDebug=false;

        this.scene.launch('BackGround');
        this.startmenu=new StartGame(this);
      
       

      
         
    
       
        
        this.player=this.matter.add.sprite(this.scale.width/2,1000,'player');

       
        
    }
}