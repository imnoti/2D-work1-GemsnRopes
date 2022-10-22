import Phaser from "phaser";
import{upadtescoreProxy,UPDATE_SCORE} from "../core/proxy";
export default class SCOREHUD extends Phaser.Scene{
    private textScore!:Phaser.GameObjects.Text;
    constructor(){
        super("SCOREHUD");
    }
    create(){
        this.textScore=this.add.text(10,10,"0",{ font: '86px Arial' });
        //添加监听事件
        upadtescoreProxy.on(UPDATE_SCORE,this.updateScore,this);
        this.events.on(Phaser.Scenes.Events.SHUTDOWN,()=>
        {
            upadtescoreProxy.off(UPDATE_SCORE,this.updateScore,this);
        });
    }

    updateScore(score:integer){
        this.textScore.text=`${score}`;
    }
}