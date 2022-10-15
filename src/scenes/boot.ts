export default class Boot extends Phaser.Scene{
    constructor() {
        super("Boot");
    }

    preload(){
        this.load.setPath('assets/images');
        this.load.image('ray','ray.png');
        this.load.image('background','background.png');
        this.load.image('topground','topground.png');
        this.load.image('bottomground','bottomground.png');
        this.load.image('gamename','gamename.png');
        this.load.image('play','play.png');
        this.load.spritesheet('player','player.png',{frameWidth:100,frameHeight:116});
    }
    create()
    {
        //启动StartScene 场景
        this.scene.start("Play")
    }
}