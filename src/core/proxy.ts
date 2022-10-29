//开始游戏事件
export const START_GAME="start_game";
export const startgameProxy=new Phaser .Events.EventEmitter();

//更新分数事件
export const UPDATE_SCORE="update_score";
export const upadtescoreProxy = new Phaser.Events.EventEmitter();

//游戏结束事件
export const GAME_OVER="game_over";
export const gameoverProxy=new Phaser.Events.EventEmitter();

//游戏胜利事件
export const GAME_WIN="game_win";
export const gamewindProxy=new Phaser.Events.EventEmitter();

//游戏停止
export const TIMER_STOP="timer_stop";
export const timerstopProxy=new Phaser.Events.EventEmitter();

//退出游戏
export const EXIT_GAME="exit_game";
export const exitgameProxy=new Phaser.Events.EventEmitter();

//继续游戏
export const RESUME_GAME="exit_game";
export const resumegameProxy=new Phaser.Events.EventEmitter();

