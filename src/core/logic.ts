import Phaser from "phaser";
import { ILogicRlue } from "./comm";
import { gameOptions } from "../consts/options";
export default class MyLogic implements ILogicRlue{
   
    public m_score!:number;
    public bestscore!:number;
    constructor(best: integer){
        
        this.m_score=0;
        this.bestscore=best;
    }
   
    get score():integer//当前分
    {
        return this.m_score;
    }
    reset():void//重置
    {
        this.m_score=0;
        let num=localStorage.getItem(gameOptions.localStorageName);
        this.bestscore=num?parseInt(num):0;
    }
    addScore(score:integer):void
    {
        this.m_score+=score;
    }
/*
    create(){
        
       // this.textScore=this.add.text(10,10,"bestscore:0",{ font: '64px Arial' });
        //this.tagettextScore=this.add.text(10,80,`bestscore:${this.bestscore}`,{ font: '64px Arial' });
        //添加监听事件
        upadtescoreProxy.on(UPDATE_SCORE,this.updateScore,this);
        //更新分数
        this.events.on(Phaser.Scenes.Events.SHUTDOWN,()=>
        {
            upadtescoreProxy.off(UPDATE_SCORE,this.updateScore,this);
            
        });
    }

    updateScore(score:integer){
        this.textScore.text=`score:${score}`;
    }
   reset():void
   {
    this.m_score=0;
        let num=localStorage.getItem(gameOptions.localStorageName);
        this.bestscore=num?parseInt(num):0;
   }
    */
}