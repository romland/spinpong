/**
 * keep track of current level data
 * 
 * ie:
 * - winner determined by "best out of three"
 * - brick/powerup data
 * - initial ball settings
 * - initial powerups assigned
 */
import { CONFIG, POWERUPTYPES } from "./config.js";
import LEVELS from "./levels.js";
import BrickSet from "./brickset.js";
import PowerUp from "./powerup.js";

export default class Level
{
    constructor(levelIndex, leftPlayer, rightPlayer, ball)
    {
        const app = GAME.getApp();
        this.gameObjects = [];
        this.levelIndex = levelIndex;
        this.ball = ball;
        this.app = app;
		ball.registerListener("onBallLost", (args) => this.onBallLost(...args));

        this.load();
    }

    load()
    {
        const lData = LEVELS[this.levelIndex];

        if(lData.brickSet) {
            this.gameObjects.push(
                new BrickSet(this.app, lData.brickSet.x, lData.brickSet.y).createFromMatrix(lData.brickSet.bricks)
            )
        }

        if(lData.powerUps.length > 0) {
            for(let i = 0; i < lData.powerUps.length; i++) {
                this.gameObjects.push(
                    new PowerUp(this.app, this.ball, lData.powerUps[i].x,  lData.powerUps[i].y, POWERUPTYPES[lData.powerUps[i].name])
                );
            }
        }

        this.ball.velocity.x = lData.ball?.velocity?.x || CONFIG.ball.initialVel;
        this.ball.velocity.y = lData.ball?.velocity?.y || CONFIG.ball.initialVel;
        this.ball.spin = lData.ball?.spin || CONFIG.ball.defaultSpin;
    }

	onBallLost(ballX, ballY)
	{
		// TODO: Score keeping

		console.log("Ball lost...");
		this.launchBall(1000);
	}

	launchBall(wait = 1000)
	{
        const lData = LEVELS[this.levelIndex];

		this.ball.sprite.x = (this.app.view.width / 2) - CONFIG.ball.radius;
		this.ball.sprite.y = (this.app.view.height / 2) - CONFIG.ball.radius;
		this.ball.velocity = {
			x: lData.ball?.velocity?.x || CONFIG.ball.initialVel,
			y: lData.ball?.velocity?.x || CONFIG.ball.initialVel
		};
		this.ball.spin = lData.ball?.spin || CONFIG.ball.defaultSpin;
		// TODO: reset everything else too (paddles/walls/bots)

		setTimeout(() => {
			console.log("Launching ball...");
			this.ball.dead = false;
			this.ball.gameStarted = false;
		}, wait);
	}

    update(keyboard)
    {
		for (let i = this.gameObjects.length - 1; i >= 0; i--) {
			if (this.gameObjects[i].isDead()) {
				this.gameObjects.splice(i, 1);
			} else {
				this.gameObjects[i].update(keyboard);
			}
		}
    }

    getGameObjects()
    {
        return this.gameObjects;
    }
}