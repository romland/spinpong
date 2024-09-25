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
		
/*
		this.usePredicted = false;		// Prevent us from calculate a move if nothing has changed.
		ball.registerCallback("onCollision", (args) => this.onCollision(...args));
		ball.registerCallback("onBallReset", (args) => this.onBallReset(...args));
		otherPaddle.registerCallback("onMoved", (args) => this.onOtherPaddleMoved(...args));
*/
	}
/*	
	onBallReset(x, y, prevX, prevY)
	{
		this.usePredicted = true;
	}


	onOtherPaddleMoved(otherPaddle, x, y)
	{
		this.usePredicted = true;
	}

	onCollision(x, y, prevX, prevY, vx, vy, targets)
	{
		if(targets.includes(this.paddle)) {
			return;
		}
		this.usePredicted = true;
	}
*/
	onPositionPredicted(x, y, prevX, prevY, vx, vy, targets)
	{
		// if(!this.usePredicted) {
		// 	return;
		// }

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