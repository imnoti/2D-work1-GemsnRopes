//背景
export default class BackGround extends Phaser.Scene{
    //构造函数
    constructor(){
        super("BackGround");
    }

    create():void{
        //背景
        let background=this.add.sprite(0,0,'background');
        background.setOrigin(0,0);
        background.displayWidth=this.scale.width;
        background.displayHeight=this.scale.height;
        //射线
        let raysArray=[];
        for(let i=-5;i<6;i++)
        {
          let ray=this.add.sprite(this.scale.width/2,this.scale.height,'ray');
          ray.setOrigin(0.5,1);//下面中间
          ray.angle=i*12;
          //显示对象的高度，考虑缩放因子，以此该值调整缩放属性
          ray.displayHeight=this.scale.height*1.2;
          ray.alpha=0.2;
          //强制转换
          raysArray.push(ray as never);
        }
        //设置旋转
        //tweens可以根据持续时间和简单类型，将一个或多个对象的属性操作作为给任何给定值
        //设置每次旋转的度数
        this.tweens.add({
            targets:raysArray,
            props:{
              angle:{
                value:"+=12"
              }
            },
            duration:8000,
            repeat:-1
          });

        
        let topGround=this.add.tileSprite(0,1000,this.scale.width,128,'topground').setOrigin(0,0);
           //返回游戏对象的边界，类似长方形
        let topGroundBottom=topGround.getBounds().bottom;
        let bottomGround=this.add.tileSprite(0,topGroundBottom,this.scale.width,this.scale.height-topGroundBottom,'bottomground');
        bottomGround.setOrigin(0,0);
        }
   
}