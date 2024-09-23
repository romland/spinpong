import CollisionShape from "./collisionshape.js"
import Eventable from "./eventable.js";
import { CONFIG } from "./config.js";

export default class Brick extends Eventable
{
    constructor(app, x, y, brickType)
    {
        super();

        const scale = brickType.scale;

        this.app = app;
        this.sprite = PIXI.Sprite.from(brickType.graphic);
        this.sprite.anchor.set(0.5, 0.5);                   // note: Anchor is center (not top-left)
        this.sprite.width = brickType.width * scale;
        this.sprite.height = brickType.height * scale;
        this.sprite.x = x;
        this.sprite.y = y;

        this.originalScale = { x : this.sprite.scale.x, y : this.sprite.scale.y };
        this.health = brickType.health;

        this.shape = new CollisionShape(
            this.app, 
            this.sprite.x, 
            this.sprite.y, 
            this.sprite.width, 
            this.sprite.height, 
            scale, 
            brickType.vertices
        );

        this.app.stage.addChild(this.sprite);
    }


    reduceHealth()
    {
        if(this.health > 0) {
            this.health--;
        }
    }


    isDead()
    {
        return this.health === 0;
    }


    checkCollision(pos, vel, liveCollision = false)
    {
        const newVel = this.shape.checkCollision(pos, vel, CONFIG.ball.radius);
        if(liveCollision && newVel) {
            this.onHit();
        }

        return newVel;
    }


    onHit()
    {
        this.sprite.scale.set(this.originalScale.x * 0.9, this.originalScale.y * 0.9);
        this.growing = true;
        this.growSpeed = 0.0015;
    }


    move(keyboard)
    {
        if(this.growing) {
            if (this.sprite.scale.x < this.originalScale.x && this.sprite.scale.y < this.originalScale.y) {
                this.sprite.scale.x += this.growSpeed;
                this.sprite.scale.y += this.growSpeed;
            } else {
                this.sprite.scale.set(this.originalScale.x, this.originalScale.y);
                this.growing = false;
            }
        }

    }
}
