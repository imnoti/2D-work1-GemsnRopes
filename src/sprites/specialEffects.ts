export default class SEffect 
{
    private particles!:Phaser.GameObjects.Particles.ParticleEmitterManager;
    private scene!:Phaser.Scene;
    
    constructor(scene:Phaser.Scene)
    {
        this.particles = scene.add.particles('success');
        this.scene=scene;
    }
    createParticles() :void
    {
        const frame = ['c1.png', 'c2.png', 'c3.png', 'c4.png', 'c5.png', 'c6.png', 'c7.png', 'c8.png'];
        const config = {
            frame: frame,
            x: { min: 0, max:this.scene.scale.width },
            speed: { min: 250, max: 300 },
            gravityY: 400,
            lifespan: 4000,
            quantity: 3,
            y: this.scene.scale.height / 4,
            maxParticles: 100,
            angle: { min: 220, max: 320 },
            scale: { start: 0.5, end: 0.8 },

        };
        this.particles.createEmitter(config);
    }
    createMergeEffect(x,y):void{
       
        const frame = ['c5.png', 'c4.png', 'c3.png'];
        const config = {
            frame: frame,
            x: { min: x-10, max: x+10 },
            y: { min: y-10, max: y+10 },
            speed: { min: 60, max: 120 },
            gravityY: 160,
            lifespan: 4000,
            quantity:20,
            maxParticles: 20,
            angle: { min: 180, max: 360 },
            scale: { start: 0.5, end: 0.8 }

        };
        this.particles.createEmitter(config);
    }
}