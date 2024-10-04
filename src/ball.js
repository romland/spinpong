import CONFIG from "./config.js";
import Eventable from "./eventable.js";

export default class Ball extends Eventable
{
    constructor(app, leftPlayer, rightPlayer) {
        super();

        this.app = app;
        this.paddleLeft = leftPlayer.getPaddle();
        this.paddleRight = rightPlayer.getPaddle();
        this.topWall = leftPlayer.getTop();
        this.bottomWall = leftPlayer.getBottom();
        this.rightTopWall = rightPlayer.getTop();
        this.rightBottomWall = rightPlayer.getBottom();

        this.sprite = PIXI.Sprite.from('./assets/ball01-mirrored.png');
        this.sprite.anchor.set(0.5,0.5);
        this.sprite.width = CONFIG.ball.radius * 2;
        this.sprite.height = CONFIG.ball.radius * 2;


        this.sprite.x = this.app.view.width / 2;
        this.sprite.y = this.app.view.height / 2;
        this.velocity = {
            x: CONFIG.ball.initialVel,
            y: CONFIG.ball.initialVel
        };
        this.spin = 0;
        this.dead = true;

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

    isDead()
    {
        return this.dead;
    }

    checkCollision(x, y, velocity, spin, gameObjects, liveCollision = false)
    {
        let newVelocity = {
            ...velocity
        };
        let newSpin = spin;
        let targets = [];

        let collisionResult;
        
        // check collision of bricks, powerups, etc
        for(let i = 0; i < gameObjects.length; i++) {
            collisionResult = gameObjects[i].checkCollision({x,y}, velocity, liveCollision);
            if(collisionResult) {
                newVelocity = collisionResult.newVelocity ? collisionResult.newVelocity : newVelocity;
                newSpin = collisionResult.newSpin ? collisionResult.newSpin : newSpin;
                targets.push(gameObjects[i])
                break;
            }
        }

        // TODO: Move to wall.js
        if (velocity.y < 0 && y <= CONFIG.walls.height + CONFIG.ball.radius && x <= this.app.view.width / 2) {
            // Left upper wall
            newVelocity.y *= -1;
            newSpin += this.topWall.surfaceSpeed;
            targets.push(this.topWall);
        } else if (velocity.y > 0 && y >= this.app.view.height - CONFIG.walls.height - CONFIG.ball.radius && x <= this.app.view.width / 2) {
            // Left lower wall
            newVelocity.y *= -1;
            newSpin += this.bottomWall.surfaceSpeed;
            targets.push(this.bottomWall);
        } else if (velocity.y < 0 && y <= CONFIG.walls.height + CONFIG.ball.radius && x >= this.app.view.width / 2) {
            // Right upper wall
            newVelocity.y *= -1;
            newSpin += this.rightTopWall.surfaceSpeed;
            targets.push(this.rightTopWall);
        } else if (velocity.y > 0 && y >= this.app.view.height - CONFIG.walls.height - CONFIG.ball.radius && x >= this.app.view.width / 2) {
            // Right lower wall
            newVelocity.y *= -1;
            newSpin += this.rightBottomWall.surfaceSpeed;
            targets.push(this.rightBottomWall);
        }

        if(collisionResult = this.paddleLeft.checkCollision(x, y, velocity, spin, liveCollision)) {
            newVelocity = collisionResult.newVelocity;
            newSpin = collisionResult.newSpin;
            targets.push(...collisionResult.targets);
        }

        if(collisionResult = this.paddleRight.checkCollision(x, y, velocity, spin, liveCollision)) {
            newVelocity = collisionResult.newVelocity;
            newSpin = collisionResult.newSpin;
            targets.push(...collisionResult.targets);
        }

        newSpin -= newSpin * CONFIG.ball.spinDecayPerFrame;

        // Decay velocity if we are above speed of N.
        if(Math.abs(Math.hypot(this.velocity.x, this.velocity.y)) > 3) {
            newVelocity.x -= newVelocity.x * CONFIG.ball.velocityDecayPerFrame;
            newVelocity.y -= newVelocity.y * CONFIG.ball.velocityDecayPerFrame;
        }

        return {
            newVelocity,
            newSpin,
            targets
        };
    }

    update(keyboard, gameObjects)
    {
        if(this.isDead()) {
            return;
        }

        if(!this.gameStarted) {
            this.notifyListeners("onGameStarted", this.sprite.x, this.sprite.y);
            this.gameStarted = true;
        }

        this.drawTrajectory(gameObjects);
        this.velocity.x += this.spin * CONFIG.ball.spinFactor;
        this.sprite.x += this.velocity.x;
        this.sprite.y += this.velocity.y;

        let collisionResult = this.checkCollision(this.sprite.x, this.sprite.y, this.velocity, this.spin, gameObjects, true);
        if(collisionResult.targets.includes(this.paddleLeft)) {
            this.notifyListeners("onLeftPaddleCollision", this.paddleLeft);
        }

        if(collisionResult.targets.includes(this.paddleRight)) {
            this.notifyListeners("onRightPaddleCollision", this.paddleRight);
        }

        if (this.velocity.x !== collisionResult.newVelocity.x || this.velocity.y !== collisionResult.newVelocity.y || this.spin !== collisionResult.newSpin) {
            this.notifyListeners("onCollision", this.sprite.x, this.sprite.y, this.sprite.x - this.velocity.x, this.sprite.y - this.velocity.y, this.velocity.x, this.velocity.y, collisionResult.targets);
        }

        this.velocity = collisionResult.newVelocity;
        this.spin = collisionResult.newSpin;

        this.sprite.rotation += this.spin;

        // Ball lost
        if (this.sprite.x <= CONFIG.ball.radius || this.sprite.x >= this.app.view.width - CONFIG.ball.radius) {
            this.dead = true;
            this.notifyListeners("onBallLost", this.sprite.x, this.sprite.y);
        }
    }

    drawTrajectory(gameObjects) {
        this.trajectoryGraphics.clear();
        this.trajectoryGraphics.lineStyle(CONFIG.debug.trajectoryWidth, CONFIG.debug.trajectoryColor);

        let x = this.sprite.x;
        let y = this.sprite.y;
        let vx = this.velocity.x;
        let vy = this.velocity.y;
        let spin = this.spin;
        let prevX = 0;
        let prevY = 0;

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
            spin = collisionResult.newSpin ? collisionResult.newSpin : spin;

            this.notifyListeners("onPositionPredicted", x, y, prevX, prevY, vx, vy, collisionResult.targets);

            // Ball lost?
            if (x <= CONFIG.ball.radius || x >= this.app.view.width - CONFIG.ball.radius) {
                break;
            }

            if (true || i % 20 === 0) {
                this.trajectoryGraphics.lineTo(x, y);
            } else {
                this.trajectoryGraphics.moveTo(x, y);
            }
        }
    }

}