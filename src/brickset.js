import Brick from "./brick.js";
import { PIXICONFIG, BRICKTYPES } from "./config.js";

export default class BrickSet
{
    constructor(app)
    {
        this.app = app;
        this.bricks = [];

        // For FX
		this.particlesContainer = new PIXI.Container();
		this.app.stage.addChild(this.particlesContainer);
    }


    createFromMatrix(matrixString)
    {
        const matrix = matrixString.split('\n').map(row => row.split(''));

        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] !== " ") {
                    const brickType = BRICKTYPES[matrix[row][col]];
                    const x = col * brickType.width * brickType.scale + brickType.width / 2 * brickType.scale;
                    const y = row * brickType.height * brickType.scale + brickType.height / 2 * brickType.scale;
                    this.addBrick(x, y, brickType);
                }
            }
        }

        return this;
    }


    addBrick(x, y, type)
    {
        const brick = new Brick(this.app, x, y, type);
        this.bricks.push(brick);
        this.app.stage.addChild(brick.sprite);
    }


    checkCollision(ballPos, ballVel, liveCollision)
    {
        for(let i = 0; i < this.bricks.length; i++) {
            const brick = this.bricks[i]
            const newVel = brick.checkCollision(ballPos, ballVel, liveCollision);
            if (newVel) {
                if(liveCollision) {
                    brick.reduceHealth();
                    if(brick.isDead()) {
                        this.removeBrickByIndex(i);
                    }
                }
                return newVel;
            }
        }
        return null;
    }


    removeBrickByIndex(brickIndex)
    {
        const brick = this.bricks[brickIndex];

        // explosion
        // this.particleDead = GAME.fx.getParticleEmitter('top-big-explosion-sub5', true, true);
        this.particleDead = GAME.fx.getParticleEmitter('fireworks-sub3', true, true);
        this.particleDead.x = brick.sprite.x;
        this.particleDead.y = brick.sprite.y;
        this.particleDead.settings.Min = 1;
        this.particleDead.settings.spawnCountMax = 1;
        this.particleDead.init(this.particlesContainer, true, 1);

        // Remove it
        this.app.stage.removeChild(brick.sprite);
        this.bricks.splice(brickIndex, 1);
    }


    move(keyboard) {
        for (let brick of this.bricks) {
            brick.move(keyboard);
        }
    }
}