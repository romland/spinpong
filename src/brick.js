import CollisionShape from "./collisionshape.js"
import Eventable from "./eventable.js";
import { CONFIG } from "./config.js";

export default class Brick extends Eventable
{
    constructor(app, x, y, type)
    {
        const SCALE = 0.25;
        super();

        this.app = app;

        this.sprite = PIXI.Sprite.from('./assets/brick02-132x256.png');
        this.sprite.anchor.set(0,0);
        this.sprite.width = 132 * SCALE;
        this.sprite.height = 256 * SCALE;

        this.sprite.x = x;
        this.sprite.y = y;

        this.app.stage.addChild(this.sprite);

        const verts = [
            { x: 50, y: 0 }, 
            { x: 85, y: 0 }, 
            { x: 132, y: 45 }, 
            { x: 132, y: 210 }, 
            { x: 85, y: 256 }, 
            { x: 50, y: 256 }, 
            { x: 0, y: 210 }, 
            { x: 0, y: 45 }
        ];

        this.scale(SCALE, verts);
        
        this.shape = new CollisionShape(this.app, verts);
    }

    scale(factor, verts)
    {
        for(let i = 0; i < verts.length; i++) {
            verts[i].x *= factor;
            verts[i].y *= factor;

            verts[i].x += this.sprite.x;
            verts[i].y += this.sprite.y;
        }
    }

    checkCollision(ballPos, ballVel)
    {
        const newVel = this.shape.checkCollision(ballPos, ballVel, CONFIG.ball.radius);
        // console.log(newVel);
        return newVel;
    }

    move(keyboard)
    {
    }

}
