import BackGround from './background';
import StartGame from './startgame';

export default class PlayScene extends Phaser.Scene{
    private startmenu!:StartGame;
    constructor(){
        super("Play");
    }
    create():void{
        this.scene.launch('BackGround');
        this.startmenu=new StartGame(this);
       
        
    }
}