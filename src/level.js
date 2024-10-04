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
import BrickSet from "./brickset.js";
import PowerUp from "./powerup.js";

export default class Level
{
    constructor(leftPlayer, rightPlayer, ball)
    {
        // TODO: this should be grabbed from a config file
        const app = GAME.getApp();
		this.gameObjects = [
			new BrickSet(app, 300, 200).createFromMatrix(
				"1 1 111\n" +
				"111  1 \n" +
				"1 1 111\n" +
				""
			),
			new PowerUp(app, ball, 200,  60, POWERUPTYPES["faster-ball"]),
			new PowerUp(app, ball, 300, 400, POWERUPTYPES["bigger-paddle"]),
			new PowerUp(app, ball, 200, 300, POWERUPTYPES["slower-ball"]),
		];

        this.ball = ball;
        this.app = app;
		ball.registerListener("onBallLost", (args) => this.onBallLost(...args));
    }

	onBallLost(ballX, ballY)
	{
		// TODO: Score keeping

		console.log("Ball lost...");
		this.launchBall(1000);
	}

	launchBall(wait = 1000)
	{
		this.ball.sprite.x = (this.app.view.width / 2) - CONFIG.ball.radius;
		this.ball.sprite.y = (this.app.view.height / 2) - CONFIG.ball.radius;
		this.ball.velocity = {
			x: CONFIG.ball.initialVel,
			y: CONFIG.ball.initialVel
		};
		this.ball.spin = CONFIG.ball.defaultSpin;
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