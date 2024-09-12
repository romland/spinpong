import { CONFIG } from "./config.js";
import Eventable from "./eventable.js";

export default class Paddle extends Eventable
{
    constructor(app, x, y, controls) {
        super();

        this.app = app;


        if(true) {
            // bitmap
            this.sprite = PIXI.Sprite.from('./assets/paddle03.png');
            this.sprite.anchor.set(0,0);
            this.sprite.width = CONFIG.paddle.width;
            this.sprite.height = CONFIG.paddle.height;
        } else {
            // primitives
            this.sprite = new PIXI.Graphics();
            this.sprite.beginFill(CONFIG.paddle.color);
            this.sprite.drawRect(0, 0, CONFIG.paddle.width, CONFIG.paddle.height);
            this.sprite.endFill();
        }

        this.sprite.x = x;
        this.sprite.y = y;
        this.surfaceSpeed = 0;
        this.controls = controls;
        
        this.spinIndicators = [];
        
        this.initSurface();
        this.app.stage.addChild(this.sprite);
        
    }
    
    initSurface() {
        this.surface = new PIXI.Graphics();
        // this.surface.beginFill(0x000000);
        this.surface.drawRoundedRect(-1, 0, CONFIG.paddle.width + 5, CONFIG.paddle.height + 4, 5);
        this.surface.endFill();
        this.surface.position.set(this.sprite.x - 2, this.sprite.y - 2);
        
        this.app.stage.addChild(this.surface);
        
        this.initIndicator();
    }
    
    initIndicator()
    {
        const numIndicators = 20;
        
        for (let i = 0; i < numIndicators; i++) {
            const indicator = new PIXI.Graphics();
            indicator.beginFill(0x0000FF);
            indicator.drawCircle(0, 0, 3);
            indicator.endFill();
            indicator.x = this.sprite.x;
            indicator.y = this.sprite.y;
            indicator.angle = (i / numIndicators) * (2 * Math.PI); // Spread indicators evenly
            this.spinIndicators.push(indicator);
            this.app.stage.addChild(indicator);
        }
    }
    
    setPosition(x, y)
    {
        this.sprite.x = x;
        this.sprite.y = y;

        this.notifyListeners("onMoved", this, this.sprite.x, this.sprite.y);
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

        if(moved) {
            this.notifyListeners("onMoved", this, this.sprite.x, this.sprite.y);
        }
    }
    
    updateIndicator() {
        this.spinIndicators.forEach(indicator => {
            indicator.angle += this.surfaceSpeed;
            indicator.x = this.sprite.x + CONFIG.paddle.width / 2 + (CONFIG.paddle.width) * Math.cos(indicator.angle);
            indicator.y = this.sprite.y + CONFIG.paddle.height / 2 + (CONFIG.paddle.height / 2 * 1.15) * Math.sin(indicator.angle);
        });
    }
}