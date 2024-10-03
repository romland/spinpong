import { CONFIG, PIXICONFIG } from "../config.js";
import isWithinRange from "./../utils.js";

export default class PredictPositionBot
{
	constructor(paddle, otherPaddle, ball)
	{
		this.paddle = paddle;
		this.targetY = PIXICONFIG.height / 2;
		this.lastUsedFrame = -1;		// Last frame we moved
		ball.registerListener("onPositionPredicted", (args) => this.onPositionPredicted(...args));
	}

	onPositionPredicted(x, y, prevX, prevY, vx, vy, targets)
	{
		if(isWithinRange(this.paddle.sprite.x, prevX, x)) {
			// if(!isWithinRange(this.paddle.sprite.y + this.paddle.sprite.height/2, y - CONFIG.paddle.speed, y + CONFIG.paddle.speed)) {
				// Only take first match of a frame.
				if(this.lastUsedFrame !== window.GAME.frameCount) {
					this.targetY = y - this.paddle.sprite.height / 2 + CONFIG.ball.radius;
					this.usePredicted = false;
					this.lastUsedFrame = window.GAME.frameCount;
				}
			// }
		}
	}
	
	update(paddle, ball)
	{
		if(Math.abs(this.targetY - paddle.sprite.y) <= CONFIG.paddle.speed) {
			paddle.setPosition(paddle.sprite.x, this.targetY);
		} else {
			paddle.setPosition(paddle.sprite.x, paddle.sprite.y + (paddle.sprite.y < this.targetY ? CONFIG.paddle.speed : -CONFIG.paddle.speed));
		}
	}
}