import CONFIG, { PIXICONFIG } from "./config.js";

export default class Wall {
    constructor(app, x, y, width, controls)
    {
        this.app = app;
        this.spinIndicators = [];
        var back = PIXI.Sprite.from('gradient2');
        // back.tint = 0xB03A00;
        back.tint = 0xffffff;

        if(y !== 0) {
            back.anchor.y = 1;
            back.scale.y *= -1;
        }
        back.width = width - 2;
        back.height = CONFIG.walls.height;
        back.y = y;
        back.alpha = 1;
        this.sprite = back;

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
        // this.surface.beginFill(0x000000);
        this.surface.drawRoundedRect(0, -2, this.sprite.width + 4, CONFIG.walls.height + 4, 5);
        // this.surface.endFill();
        
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
        const numIndicators = 40;
        
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
    
    updateIndicator() {
        this.spinIndicators.forEach(indicator => {
            indicator.angle += this.sprite.y === 0 ? this.surfaceSpeed / 10 : -(this.surfaceSpeed / 10);
            indicator.x = this.sprite.x - (CONFIG.walls.width/2) + CONFIG.walls.width + (CONFIG.walls.width / 2 * Math.cos(indicator.angle));
            indicator.y = this.sprite.y + CONFIG.walls.height + (CONFIG.walls.height / 2 * Math.sin(indicator.angle));
        });
    }
}
