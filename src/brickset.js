import Brick from "./brick.js";
import { PIXICONFIG } from "./config.js";

export default class BrickSet
{
    constructor(app)
    {
        this.app = app;
        this.bricks = [];
    }


    createFromMatrix(matrixString)
    {
        const brickWidth = 132 * 0.25; // Brick width * scale
        const brickHeight = 256 * 0.25; // Brick height * scale

        const matrix = matrixString.split('\n').map(row => row.split(''));

        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] !== " ") {
                    const type = parseInt(matrix[row][col], 10);
                    const x = col * brickWidth + brickWidth / 2;
                    const y = row * brickHeight + brickHeight / 2;
                    this.addBrick(x, y, type);
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
        for (let brick of this.bricks) {
            const newVel = brick.checkCollision(ballPos, ballVel, liveCollision);
            if (newVel) {
                return newVel;
            }
        }
        return null;
    }

    move(keyboard) {
        for (let brick of this.bricks) {
            brick.move(keyboard);
        }
    }
}