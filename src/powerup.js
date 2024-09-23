// powerup01-256x209.png
import CollisionShape from "./collisionshape.js"
import Eventable from "./eventable.js";
import { CONFIG } from "./config.js";

export default class PowerUp extends Eventable
{
    constructor(app, ball, x, y, powerUpType)
    {
        super();

        const scale = powerUpType.scale;

        this.powerUpType = powerUpType;
        this.app = app;
        this.sprite = PIXI.Sprite.from(powerUpType.graphic);
        this.sprite.anchor.set(0.5, 0.5);                   // note: Anchor is center (not top-left)
        this.sprite.width = powerUpType.width * scale;
        this.sprite.height = powerUpType.height * scale;
        this.sprite.x = x;
        this.sprite.y = y;

        this.shape = new CollisionShape(
            this.app, 
            this.sprite.x, 
            this.sprite.y, 
            this.sprite.width, 
            this.sprite.height, 
            scale, 
            powerUpType.vertices
        );

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

        this.dead = false;
        this.app.stage.addChild(this.sprite);
        this.lastPaddle = null;

        ball.registerListener("onLeftPaddleCollision", (args) => this.onPaddleCollision(...args));
        ball.registerListener("onRightPaddleCollision", (args) => this.onPaddleCollision(...args));

    }

    onPaddleCollision(paddle)
    {
        console.log("Paddle hit:", paddle);
        this.lastPaddle = paddle;
    }


    checkCollision(pos, vel, liveCollision)
    {
        const newVel = this.shape.checkCollision(pos, vel, CONFIG.ball.radius);
        if(liveCollision && newVel) {
            this.onHit();
        }

        // return newVel;
        return null;    // never bounce off it.
    }

    onHit()
    {
        /*
        // explosion
        this.particleDead = GAME.fx.getParticleEmitter('top-big-explosion-sub5', true, true);
        // this.particleDead = GAME.fx.getParticleEmitter('fireworks-sub3', true, true);
        this.particleDead.x = brick.sprite.x;
        this.particleDead.y = brick.sprite.y;
        this.particleDead.settings.Min = 1;
        this.particleDead.settings.spawnCountMax = 1;
        this.particleDead.init(this.particlesContainer, true, 1);
        */

        console.log("Powerup taken!");
        this.remove();

// TODO: the way this gets called, anything that applies to ball-velocity/spin is ignored
        this.powerUpType.effect(this.lastPaddle, GAME.getBall());
    }


    isDead()
    {
        return this.dead;
    }

    remove()
    {
        this.dead = true;
        this.app.stage.removeChild(this.sprite);
    }


    move(keyboard)
    {
    }
}
