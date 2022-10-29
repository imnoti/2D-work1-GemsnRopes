export interface ILogicRlue{
    get score():integer;//当前分
    reset():void;//重置
    addScore(score:integer):void;
}