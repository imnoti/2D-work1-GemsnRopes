//资源加载
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
        this.load.spritesheet('star','star.png',{frameWidth:100,frameHeight:100});
        this.load.image('store','store.png');
        this.load.image('tile','tile.png');
        this.load.image('tile1','tile1.png')
        this.load.image('energybar','energybar.png');
        this.load.image('energycontainer','energycontainer.png');
    }
    create()
    {
        //启动StartScene 场景
        console.log("加载场景");
        this.scene.start("Play")
    }
}