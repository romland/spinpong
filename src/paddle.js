import { CONFIG } from "./config.js";
import Eventable from "./eventable.js";

export default class Paddle extends Eventable
{
    constructor(app, x, y, controls) {
        super();

        this.app = app;
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(CONFIG.paddle.color);
        this.sprite.drawRect(0, 0, CONFIG.paddle.width, CONFIG.paddle.height);
        this.sprite.endFill();
        this.sprite.x = x;
        this.sprite.y = y;
        this.surfaceSpeed = 0;
        this.controls = controls;
        
        this.indicatorParticles = [];
        
        this.initSurface();
        this.app.stage.addChild(this.sprite);
        
    }
    
    initSurface() {
        this.surface = new PIXI.Graphics();
        this.surface.beginFill(0x000000);
        this.surface.drawRoundedRect(-1, 0, CONFIG.paddle.width + 5, CONFIG.paddle.height + 4, 5);
        this.surface.endFill();
        this.surface.position.set(this.sprite.x - 2, this.sprite.y - 2);
        
        this.app.stage.addChild(this.surface);
        
        this.initIndicator();
    }
    
    initIndicator()
    {
        const numParticles = 20;
        
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
        }
    }
    
    setPosition(x, y)
    {
        this.sprite.x = x;
        this.sprite.y = y;

        if(this.hasCallback("onMoved")) {
            this.doCallbacks("onMoved", this, this.sprite.x, this.sprite.y);
        }
    }

    move(keyboard) {
        let moved = false;

        if (keyboard[this.controls.up]) {
            this.sprite.y -= CONFIG.paddle.speed;
            moved = true;
        }

        if (keyboard[this.controls.down]) {
            this.sprite.y += CONFIG.paddle.speed;
            moved = true;
        }

        if (keyboard[this.controls.incSurfaceSpeed]) {
            this.surfaceSpeed += CONFIG.paddle.surfaceSpeedFactor;
            moved = true;
        }

        if (keyboard[this.controls.decSurfaceSpeed]) {
            this.surfaceSpeed -= CONFIG.paddle.surfaceSpeedFactor;
            moved = true;
        }
        
        // Cap top of Y axis
        if(this.sprite.y < CONFIG.walls.height) {
            this.sprite.y = CONFIG.walls.height;
        }
        
        // Cap bottom of Y axis
        if((this.sprite.y + CONFIG.paddle.height) > (this.app.view.height - CONFIG.walls.height)) {
            this.sprite.y = this.app.view.height - CONFIG.walls.height - CONFIG.paddle.height;
        }
        
        this.surface.position.set(this.sprite.x - 2, this.sprite.y - 2);
        this.updateIndicator();

        if(moved && this.hasCallback("onMoved")) {
            this.doCallbacks("onMoved", this, this.sprite.x, this.sprite.y);
        }
    }
    
    updateIndicator() {
        this.indicatorParticles.forEach(particle => {
            particle.angle += this.surfaceSpeed;
            particle.x = this.sprite.x + CONFIG.paddle.width / 2 + (CONFIG.paddle.width) * Math.cos(particle.angle);
            particle.y = this.sprite.y + CONFIG.paddle.height / 2 + (CONFIG.paddle.height / 2 * 1.15) * Math.sin(particle.angle);
        });
    }
}