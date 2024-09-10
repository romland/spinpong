import { CONFIG, PIXICONFIG } from "../config.js";

export default class FollowBot
{
	constructor(paddle)
	{
		this.targetY = PIXICONFIG.height / 2;
	}
	
	headingToMe(paddle, ball)
	{
		if(paddle.sprite.x < (PIXICONFIG.width / 2)) {
			return ball.velocity.x <= 0;
		} else {
			return ball.velocity.x >= 0;
		}
	}
	
	update(paddle, ball)
	{
		if(this.headingToMe(paddle, ball)) {
			// move to ball's y (another bot could go to actual predicted position instead)
			this.targetY = ball.sprite.y - (CONFIG.paddle.height / 2);
			
			if(Math.abs(this.targetY - paddle.sprite.y) <= CONFIG.paddle.speed) {
				paddle.setPosition(paddle.sprite.x, this.targetY)
			} else {
				paddle.setPosition(paddle.sprite.x, paddle.sprite.y + (paddle.sprite.y < this.targetY ? CONFIG.paddle.speed : -CONFIG.paddle.speed))
			}
		} else {
			// move to center y
			this.targetY = PIXICONFIG.height / 2 - (CONFIG.paddle.height / 2);
			
			if(Math.abs(this.targetY - paddle.sprite.y) <= CONFIG.paddle.speed) {
				paddle.setPosition(paddle.sprite.x, this.targetY)
			} else {
				paddle.setPosition(paddle.sprite.x, paddle.sprite.y + (paddle.sprite.y < this.targetY ? CONFIG.paddle.speed : -CONFIG.paddle.speed));
			}
		}
	}
}