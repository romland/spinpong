import CONFIG from "./config.js";

export default class Wall {
    constructor(app, x, y, width, controls) {
        this.app = app;
        this.indicatorParticles = [];
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(CONFIG.walls.color);
        this.sprite.drawRect(2, 0, width - 2, CONFIG.walls.height);
        this.sprite.endFill();
        this.sprite.x = x;
        this.sprite.y = y;
        this.surfaceSpeed = 0;
        this.controls = controls;
        this.initSurface();
        this.app.stage.addChild(this.sprite);
        this.initIndicator();
    }
    
    initSurface() {
        this.surface = new PIXI.Graphics();
        this.surface.beginFill(0x000000);
        this.surface.drawRoundedRect(0, -2, this.sprite.width + 4, CONFIG.walls.height + 4, 5);
        this.surface.endFill();
        
        this.surface.position.set(this.sprite.x + 0, this.sprite.y - 0);
        this.app.stage.addChild(this.surface);
    }
    
    move(keyboard) {
        if (keyboard[this.controls.incSurfaceSpeed]) this.surfaceSpeed += CONFIG.walls.surfaceSpeedFactor;
        if (keyboard[this.controls.decSurfaceSpeed]) this.surfaceSpeed -= CONFIG.walls.surfaceSpeedFactor;
        this.updateIndicator();
    }
    
    initIndicator()
    {
        const numParticles = 40;
        
        for (let i = 0; i < numParticles; i++) {
            const particle = new PIXI.Graphics();
            particle.beginFill(0x0000FF);
            particle.drawCircle(0, 0, 3);
            particle.endFill();
            particle.x = this.sprite.x;
            particle.y = this.sprite.y;
            particle.angle = (i / numParticles) * (2 * Math.PI); // Spread particles evenly
            this.indicatorParticles.push(particle);
            this.app.stage.addChild(particle);
            // this.sprite.addChild(particle);
        }
    }
    
    updateIndicator() {
        this.indicatorParticles.forEach(particle => {
            particle.angle += this.sprite.y === 0 ? this.surfaceSpeed / 10 : -(this.surfaceSpeed / 10);
            particle.x = this.sprite.x - (CONFIG.walls.width/2) + CONFIG.walls.width + (CONFIG.walls.width / 2 * Math.cos(particle.angle));
            particle.y = this.sprite.y + CONFIG.walls.height + (CONFIG.walls.height / 2 * Math.sin(particle.angle));
        });
    }
}
