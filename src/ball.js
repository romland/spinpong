import CONFIG from "./config.js";
import Eventable from "./eventable.js";

export default class Ball extends Eventable
{
    constructor(app, paddleLeft, paddleRight, topWall, bottomWall, rightTopWall, rightBottomWall) {
        super();

        this.app = app;
        this.paddleLeft = paddleLeft;
        this.paddleRight = paddleRight;
        this.topWall = topWall;
        this.bottomWall = bottomWall;
        this.rightTopWall = rightTopWall;
        this.rightBottomWall = rightBottomWall;

        this.sprite = PIXI.Sprite.from('./assets/ball01-mirrored.png');
        this.sprite.anchor.set(0.5,0.5);
        this.sprite.width = CONFIG.ball.radius * 2;
        this.sprite.height = CONFIG.ball.radius * 2;


        this.sprite.x = this.app.view.width / 2; // - 280;       // 280 is DEBUG to make it hit center point
        this.sprite.y = this.app.view.height / 2;
        this.velocity = {
            x: CONFIG.ball.initialVel * 1,
            y: CONFIG.ball.initialVel * 1
        };
        this.spin = 0;

        this.sprite.filters = [
            new PIXI.filters.DropShadowFilter({
                blur : 2,
                quality: 3,
                alpha: 0.5,
                offsetX : 4,
                offsetY : 4,
                shadowOnly : false,
            }),
            new PIXI.filters.GlowFilter({
                distance: 15,
                innerStrength: 0,
                outerStrength: 2,
                color: 0xffffff,
                quality: 0.2,
                alpha: 0.3,
            }),
        ];
        this.app.stage.addChild(this.sprite);

        this.trajectoryGraphics = new PIXI.Graphics();
        this.app.stage.addChild(this.trajectoryGraphics);

        this.listeners = {};
        this.spin = CONFIG.ball.defaultSpin;

        this.gameStarted = false;
    }

    checkCollision(x, y, velocity, spin, gameObjects, liveCollision = false)
    {
        let newVelocity = {
            ...velocity
        };
        let newSpin = spin;
        let targets = [];

        let tmpVel;
        // check collision of powerups etc
        for(let i = 0; i < gameObjects.length; i++) {
            // This will NOT return a new spin (not needed yet)
            tmpVel = gameObjects[i].checkCollision({x,y}, velocity, liveCollision);
            if(tmpVel) {
                return {
                    newVelocity: tmpVel,
                    newSpin: newSpin,
                    targets: [gameObjects[i]]
                };
            }
        }

        if (y <= CONFIG.walls.height + CONFIG.ball.radius && x <= this.app.view.width / 2) {
            // Left upper wall
            newVelocity.y *= -1;
            newSpin += this.topWall.surfaceSpeed;
            targets.push(this.topWall);
        } else if (y >= this.app.view.height - CONFIG.walls.height - CONFIG.ball.radius && x <= this.app.view.width / 2) {
            // Left lower wall
            newVelocity.y *= -1;
            newSpin += this.bottomWall.surfaceSpeed;
            targets.push(this.bottomWall);
        } else if (y <= CONFIG.walls.height + CONFIG.ball.radius && x >= this.app.view.width / 2) {
            // Right upper wall
            newVelocity.y *= -1;
            newSpin += this.rightTopWall.surfaceSpeed;
            targets.push(this.rightTopWall);
        } else if (y >= this.app.view.height - CONFIG.walls.height - CONFIG.ball.radius && x >= this.app.view.width / 2) {
            // Right lower wall
            newVelocity.y *= -1;
            newSpin += this.rightBottomWall.surfaceSpeed;
            targets.push(this.rightBottomWall);
        }

        // Left paddle collision
        if(
            velocity.x < 0 && 
            x <= this.paddleLeft.sprite.x + CONFIG.paddle.width + CONFIG.ball.radius &&
            x > this.paddleLeft.sprite.x - CONFIG.ball.radius &&
            y >= this.paddleLeft.sprite.y - CONFIG.ball.radius &&
            y <= this.paddleLeft.sprite.y + CONFIG.paddle.height + CONFIG.ball.radius
        ) {
            newVelocity.x *= -1;
            newSpin += this.paddleLeft.surfaceSpeed;
            targets.push(this.paddleLeft);
        }

        // Right paddle collision
        if(
            velocity.x > 0 && 
            x >= this.paddleRight.sprite.x - CONFIG.ball.radius &&
            x <= this.paddleRight.sprite.x + CONFIG.ball.radius &&
            y >= this.paddleRight.sprite.y - CONFIG.ball.radius &&
            y <= this.paddleRight.sprite.y + CONFIG.paddle.height + CONFIG.ball.radius
        ) {
            newVelocity.x *= -1;
            newSpin += this.paddleRight.surfaceSpeed;
            targets.push(this.paddleRight);
        }

        // Paddle top and bottom collision
        if (
            (
                // left top
                velocity.y > 0 &&
                y <= this.paddleLeft.sprite.y + CONFIG.ball.radius
                && y >= this.paddleLeft.sprite.y - CONFIG.ball.radius
                && x >= this.paddleLeft.sprite.x && x <= this.paddleLeft.sprite.x + CONFIG.paddle.width
            ) ||
            (
                // left bottom
                velocity.y < 0 &&
                y >= this.paddleLeft.sprite.y + CONFIG.paddle.height - CONFIG.ball.radius 
                && y <= this.paddleLeft.sprite.y + CONFIG.paddle.height + CONFIG.ball.radius 
                && x >= this.paddleLeft.sprite.x && x <= this.paddleLeft.sprite.x + CONFIG.paddle.width
            ) ||
            (
                // right top
                velocity.y > 0 &&
                y <= this.paddleRight.sprite.y + CONFIG.ball.radius 
                && y >= this.paddleRight.sprite.y - CONFIG.ball.radius 
                && x >= this.paddleRight.sprite.x 
                && x <= this.paddleRight.sprite.x + CONFIG.paddle.width
            ) ||
            (
                // right bottom
                velocity.y < 0 &&
                y >= this.paddleRight.sprite.y + CONFIG.paddle.height - CONFIG.ball.radius
                && y <= this.paddleRight.sprite.y + CONFIG.paddle.height + CONFIG.ball.radius
                && x >= this.paddleRight.sprite.x && x <= this.paddleRight.sprite.x + CONFIG.paddle.width
            )
        ) {
            newVelocity.y *= -1;
            newSpin += y <= this.paddleLeft.sprite.y + CONFIG.ball.radius ? this.paddleLeft.surfaceSpeed : this.paddleRight.surfaceSpeed;
            targets.push(
                (x < this.app.view.width / 2 ? this.paddleLeft : this.paddleRight)
            );
        }

        newSpin -= newSpin * CONFIG.ball.spinDecayPerFrame;

        return {
            newVelocity,
            newSpin,
            targets
        };
    }

    move(keyboard, gameObjects) {
        if(!this.gameStarted) {
            this.notifyListeners("onBallReset", this.sprite.x, this.sprite.y, this.sprite.x, this.sprite.y);
            this.gameStarted = true;
        }

        this.drawTrajectory(gameObjects);
        this.velocity.x += this.spin * CONFIG.ball.spinFactor;
        this.sprite.x += this.velocity.x;
        this.sprite.y += this.velocity.y;

        let collisionResult = this.checkCollision(this.sprite.x, this.sprite.y, this.velocity, this.spin, gameObjects, true);

        if (this.velocity.x !== collisionResult.newVelocity.x || this.velocity.y !== collisionResult.newVelocity.y || this.spin !== collisionResult.newSpin) {
            this.notifyListeners("onCollision", this.sprite.x, this.sprite.y, this.sprite.x - this.velocity.x, this.sprite.y - this.velocity.y, this.velocity.x, this.velocity.y, collisionResult.targets);
        }

        this.velocity = collisionResult.newVelocity;
        this.spin = collisionResult.newSpin;

        this.sprite.rotation += this.spin;

        // Ball lost
        if (this.sprite.x <= CONFIG.ball.radius || this.sprite.x >= this.app.view.width - CONFIG.ball.radius) {
            let prevX = this.sprite.x;
            let prevY = this.sprite.y;

            // Reset me
            this.sprite.x = (this.app.view.width / 2) - CONFIG.ball.radius;
            this.sprite.y = (this.app.view.height / 2) - CONFIG.ball.radius;
            this.velocity = {
                x: CONFIG.ball.initialVel,
                y: CONFIG.ball.initialVel
            };
            this.spin = CONFIG.ball.defaultSpin;

            this.notifyListeners("onBallReset", this.sprite.x, this.sprite.y, prevX, prevY);
        }
    }

    drawTrajectory(gameObjects, DEBUGcurrentTrajectory) {
        this.trajectoryGraphics.clear();
        this.trajectoryGraphics.lineStyle(CONFIG.debug.trajectoryWidth, CONFIG.debug.trajectoryColor);

        let x = this.sprite.x;
        let y = this.sprite.y;
        let vx = this.velocity.x;
        let vy = this.velocity.y;
        let spin = this.spin;
        let prevX = 0;
        let prevY = 0;

        if (DEBUGcurrentTrajectory) DEBUGcurrentTrajectory.push([x, y]);

        this.trajectoryGraphics.moveTo(x, y);

        for (let i = 0; i < 1000; i++) {
            prevX = x;
            prevY = y;
            vx += spin * CONFIG.ball.spinFactor;
            x += vx;
            y += vy;

            let collisionResult = this.checkCollision(x, y, { x: vx, y: vy }, spin, gameObjects, false);
            vx = collisionResult.newVelocity.x;
            vy = collisionResult.newVelocity.y;
            spin = collisionResult.newSpin;

            this.notifyListeners("onPositionPredicted", x, y, prevX, prevY, vx, vy, collisionResult.targets);

            // Ball lost?
            if (x <= CONFIG.ball.radius || x >= this.app.view.width - CONFIG.ball.radius) {
                break;
            }

            if (DEBUGcurrentTrajectory) DEBUGcurrentTrajectory.push([x, y]);

            if (true || i % 20 === 0) {
                this.trajectoryGraphics.lineTo(x, y);
            } else {
                this.trajectoryGraphics.moveTo(x, y);
            }
        }
    }

}