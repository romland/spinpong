import CollisionShape from "./collisionshape.js"
import Eventable from "./eventable.js";
import { CONFIG, BRICKTYPES } from "./config.js";

export default class Brick extends Eventable
{
    constructor(app, x, y, brickType)
    {
        super();
        this.app = app;

        // const brickType = brickConfig;
        const scale = brickType.scale;
        // const verts = brickType.vertices;
        // const verts = brickType.vertices.map((arr) => arr.slice());

        this.sprite = PIXI.Sprite.from(brickType.graphic);
        // note: Anchor is center (not top-left)
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.width = brickType.width * scale;
        this.sprite.height = brickType.height * scale;

        this.sprite.x = x;
        this.sprite.y = y;

        this.health = brickType.health;

        this.app.stage.addChild(this.sprite);

        const verts = this.scalePolygon(scale, brickType.vertices);

        this.originalScale = {x:this.sprite.scale.x, y: this.sprite.scale.y};
        
        this.shape = new CollisionShape(this.app, verts);
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

    /**
     * Note: this must return a copy or we'll mess up future instances of this shape.
     * @param {*} scale 
     * @param {*} verts 
     */
    scalePolygon(scale, verts)
    {
        const ret = [];
        for(let i = 0; i < verts.length; i++) {
            ret.push(
                {
                    x: (verts[i].x * scale) + (this.sprite.x - this.sprite.width/2),
                    y: (verts[i].y * scale) + (this.sprite.y - this.sprite.height/2)
                }
            );
            /*
            verts[i].x *= factor;
            verts[i].y *= factor;

            verts[i].x += this.sprite.x - this.sprite.width/2;
            verts[i].y += this.sprite.y - this.sprite.height/2;
            */
        }

        return ret;
    }

    checkCollision(ballPos, ballVel, liveCollision = false)
    {
        const newVel = this.shape.checkCollision(ballPos, ballVel, CONFIG.ball.radius);
        if(liveCollision && newVel) {
            this.shrinkAndGrow();
        }

        return newVel;
    }

    shrinkAndGrow() {
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
