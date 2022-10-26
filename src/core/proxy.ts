//开始游戏事件
export const START_GAME="start_game";
export const startgameProxy=new Phaser .Events.EventEmitter();

//更新分数事件
export const UPDATE_SCORE="update_score";
export const upadtescoreProxy = new Phaser.Events.EventEmitter();

//开始计时事件
export const TIMING="reckon_time";
export const timingProxy = new Phaser.Events.EventEmitter();

//游戏失败事件
export const GAME_FAILED="game_failed";
export const gamefailedProxy=new Phaser.Events.EventEmitter();

//游戏胜利事件
export const GAME_WIN="game_win";
export const gamewindProxy=new Phaser.Events.EventEmitter();

//游戏停止
export const TIMER_STOP="timer_stop";
export const timerstopProxy=new Phaser.Events.EventEmitter();

//不再继续游戏
export const NO_GAME="no_game";
export const nogameProxy=new Phaser.Events.EventEmitter();



