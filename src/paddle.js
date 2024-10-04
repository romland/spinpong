import { PIXICONFIG, CONFIG } from "./config.js";
import Eventable from "./eventable.js";
import { Actions, Interpolations } from './libs/pixi-actions/index.js';

export default class Paddle extends Eventable
{
    constructor(app, x, y, controls)
    {
        super();

        this.app = app;

        // Create container to hold the three sprites
        this.spriteContainer = new PIXI.Container();
        this.app.stage.addChild(this.spriteContainer);

        // top sprite
        this.topSprite = PIXI.Sprite.from('./assets/paddle03-top.png');
        this.topSprite.anchor.set(0, 0);
        this.topSprite.width = CONFIG.paddle.width;
        this.topSprite.y = 0;
        this.spriteContainer.addChild(this.topSprite);

        // middle sprite
        this.midSprite = PIXI.Sprite.from('./assets/paddle03-mid.png');
        this.midSprite.anchor.set(0, 0);
        this.midSprite.width = CONFIG.paddle.width;
        this.midSprite.y = this.topSprite.height;
        this.spriteContainer.addChild(this.midSprite);

        // bottom sprite
        this.bottomSprite = PIXI.Sprite.from('./assets/paddle03-bottom.png');
        this.bottomSprite.anchor.set(0, 0);
        this.bottomSprite.width = CONFIG.paddle.width;
        this.bottomSprite.y = this.topSprite.height + this.midSprite.height;
        this.spriteContainer.addChild(this.bottomSprite);

        this.spriteContainer.height = CONFIG.paddle.defaultHeight;
        this.sprite = this.spriteContainer;

        this.sprite.x = x;

        // Passed in Y is meant to be for center of bat (i.e. screen height / 2).
        this.sprite.y = y - this.spriteContainer.height / 2;

        this.sprite.filters = [
            new PIXI.filters.DropShadowFilter({
                blur : 2,
                quality: 3,
                alpha: 0.5,
                offsetX : 4,
                offsetY : 4,
                shadowOnly : false,
            })
        ];

        this.surfaceSpeed = 0;
        this.controls = controls;

        this.spinIndicators = [];
        this.initSurface();
        this.app.stage.addChild(this.sprite);
    }

    resizeMiddleSegment(newYscale)
    {
        Actions.parallel(
            Actions.scaleTo(this.midSprite, this.midSprite.scale.x, newYscale, 1, Interpolations.smoother ),
            Actions.moveTo(this.bottomSprite, this.bottomSprite.x, this.topSprite.height + (this.midSprite.height * newYscale), 1, Interpolations.smoother),
        ).play();
    }

    
    initSurface() {
        this.surface = new PIXI.Graphics();
        this.surface.drawRoundedRect(-1, 0, CONFIG.paddle.width + 5, this.sprite.height + 4, 5);
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
            indicator.beginFill(0x0000aa);
            indicator.drawCircle(0, 0, 2);
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

    isLeftBat()
    {
        return this.sprite.x < (PIXICONFIG.width/2);
    }

    checkCollision(x, y, velocity, spin, liveCollision)
    {
        let newVelocity = {
            ...velocity
        };
        let newSpin = spin;
        let targets = [];

        if(
            ((this.isLeftBat() && velocity.x < 0) || (!this.isLeftBat() && velocity.x > 0)) && // do this to prevent ball getting stuck in bat (TODO: improve this)
            x <= this.sprite.x + CONFIG.paddle.width + CONFIG.ball.radius &&
            x > this.sprite.x - CONFIG.ball.radius &&
            y >= this.sprite.y - CONFIG.ball.radius &&
            y <= this.sprite.y + this.sprite.height + CONFIG.ball.radius
        ) {
            newVelocity.x *= -1;
            newSpin += this.surfaceSpeed;
            targets.push(this);

            return {
                newVelocity,
                newSpin,
                targets
            };
        }

        // Paddle top and bottom collision
        if (
            (
                // top
                velocity.y > 0 &&
                y <= this.sprite.y + CONFIG.ball.radius
                && y >= this.sprite.y - CONFIG.ball.radius
                && x >= this.sprite.x && x <= this.sprite.x + CONFIG.paddle.width
            ) ||
            (
                // bottom
                velocity.y < 0 &&
                y >= this.sprite.y + this.sprite.height - CONFIG.ball.radius 
                && y <= this.sprite.y + this.sprite.height + CONFIG.ball.radius 
                && x >= this.sprite.x && x <= this.sprite.x + CONFIG.paddle.width
            )
        ) {
            newVelocity.y *= -1;
            newSpin += this.surfaceSpeed;
            targets.push(this);

            return {
                newVelocity,
                newSpin,
                targets
            };
        }

        return null;
    }

    update(keyboard) {
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
        if((this.sprite.y + this.sprite.height) > (this.app.view.height - CONFIG.walls.height)) {
            this.sprite.y = this.app.view.height - CONFIG.walls.height - this.sprite.height;
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
            indicator.y = this.sprite.y + this.sprite.height / 2 + (this.sprite.height / 2 * 1.15) * Math.sin(indicator.angle);
        });
    }
}