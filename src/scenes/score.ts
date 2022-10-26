import Phaser from "phaser";
import { gameOptions } from "../consts/options";
import{upadtescoreProxy,UPDATE_SCORE} from "../core/proxy";
export default class SCOREHUD extends Phaser.Scene{
    private textScore!:Phaser.GameObjects.Text;
    private tagettextScore!:Phaser.GameObjects.Text;
    private level!:number;
    private targetscore!:number;
    constructor(){
        super("SCOREHUD");
    }
    create(){
        
        let temp=localStorage.getItem(gameOptions.localStorageName1)
        this.level=temp?parseInt(temp):1;

        this.targetscore=gameOptions.target_1;
        this.textScore=this.add.text(10,10,"0",{ font: '64px Arial' });
        this.tagettextScore=this.add.text(10,80,`target:${this.targetscore}`,{ font: '64px Arial' });
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