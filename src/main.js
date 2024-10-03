import { CONFIG, DEFAULT_KEYBOARD, PIXICONFIG, POWERUPTYPES } from "./config.js";
import Ball from "./ball.js";
import Paddle from "./paddle.js";
import Wall from "./wall.js";
import BrickSet from "./brickset.js";
import FollowBot from "./bots/followbot.js";
import PredictPositionBot from "./bots/PredictPositionBot.js";
import PowerUp from "./powerup.js";
import { FloatingCombatTextManager } from "./floatingcombattext.js"

import { Actions } from './libs/pixi-actions/index.js';

class Game
{
	constructor() {
		this.init();
	}


	async init()
	{
		const app = new PIXI.Application(PIXICONFIG);	// pass in PIXICONFIG for compat with Pixi 7
		this.app = app;
		app.ticker.maxFPS = 60;

		// make it compatible with both pixi 7 and 8
		if(app.init) {
			await app.init(PIXICONFIG);
		}

		document.body.appendChild(app.view);
		
		await this.initRevolt();

		// Interpolation library
		// TODO: Don't actually want a separate ticker for it -- this should also pause with pause
		app.ticker.add((delta) => Actions.tick(delta/60));

		this.fct = new FloatingCombatTextManager();

		// Initialize keyboard
		const keyboard = {};
		window.addEventListener('keydown', (e) => {
			if (e.code === DEFAULT_KEYBOARD.pause) {
				this.togglePause();
			}
			
			keyboard[e.code] = true;
		});
		window.addEventListener('keyup', (e) => {
			keyboard[e.code] = false;
		});
		
		
		this.paused = false;
		this.frameCount = 0;

		// Player 1
		this.paddleLeft = new Paddle(app, CONFIG.paddle.offsetX, app.view.height / 2, DEFAULT_KEYBOARD.leftPlayer.paddle);
		this.topWall = new Wall(app, 0, 0, (app.view.width / 2) - 3, DEFAULT_KEYBOARD.leftPlayer.walls.top);
		this.bottomWall = new Wall(app, 0, app.view.height - CONFIG.walls.height, (app.view.width / 2) - 3, DEFAULT_KEYBOARD.leftPlayer.walls.bottom);

		// Player 2
		this.paddleRight = new Paddle(app, app.view.width - CONFIG.paddle.offsetX - CONFIG.paddle.width, app.view.height / 2, DEFAULT_KEYBOARD.rightPlayer.paddle);
		this.rightTopWall = new Wall(app, (app.view.width / 2) + 3, 0, app.view.width / 2, DEFAULT_KEYBOARD.rightPlayer.walls.top);
		this.rightBottomWall = new Wall(app, (app.view.width / 2) + 3, app.view.height - CONFIG.walls.height, app.view.width / 2, DEFAULT_KEYBOARD.rightPlayer.walls.bottom);
		
		this.ball = new Ball(app, this.paddleLeft, this.paddleRight, this.topWall, this.bottomWall, this.rightTopWall, this.rightBottomWall);
		this.ball.registerListener("onBallLost", (args) => this.onBallLost(...args));

		
		let leftBot = new FollowBot(this.paddleLeft);
		let rightBot = new PredictPositionBot(this.paddleRight, this.paddleLeft, this.ball);
		
		let gameObjects = [
			new BrickSet(app, 300, 200).createFromMatrix(
				"1 1 111\n" +
				"111  1 \n" +
				"1 1 111\n" +
				""
			),
			new PowerUp(app, this.ball, 400, 440, POWERUPTYPES["faster-ball"]),
			new PowerUp(app, this.ball, 300, 400, POWERUPTYPES["bigger-paddle"]),
			new PowerUp(app, this.ball, 200, 300, POWERUPTYPES["slower-ball"]),
		];

		app.ticker.add((delta) => {
			if (this.paused) {
				return;
			}

			this.fx.update();

			// if(window.GAME.frameCount === 720) {
			// 	debugger;
			// }

			for (let i = gameObjects.length - 1; i >= 0; i--) {
				if (gameObjects[i].isDead()) {
					gameObjects.splice(i, 1);
				} else {
					gameObjects[i].move(keyboard);
				}
			}
			
			if (leftBot) {
				leftBot.update(this.paddleLeft, this.ball);
			}
			this.paddleLeft.move(keyboard);
			
			if (rightBot) {
				rightBot.update(this.paddleRight, this.ball);
			}
			this.paddleRight.move(keyboard);
			
			this.topWall.move(keyboard);
			this.bottomWall.move(keyboard);
			
			this.rightTopWall.move(keyboard);
			this.rightBottomWall.move(keyboard);
			
			this.ball.move(keyboard, gameObjects);

			this.fct.move(delta)

			this.updateDebugText();
			this.frameCount++;
		});

		this.launchBall(0);
	}


	cleanUp()
	{
		// TODO: implement cleanUp() in all game objects, call them all from here...
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

	togglePause() {
		this.paused = !this.paused;
	}

	getBall()
	{
		return this.ball;
	}

	getApp()
	{
		return this.app;
	}

	getFct()
	{
		return this.fct;
	}

	getActions()
	{
		return Actions;
	}

	async initRevolt()
	{
		this.fx = new revolt.FX();

		PIXI.Assets.add({ alias: 'fx_settings', src: './libs/revoltfx/assets/default-bundle.json' });
		PIXI.Assets.add({ alias: 'fx_spritesheet', src: './libs/revoltfx/assets/revoltfx-spritesheet.json' });
		PIXI.Assets.add({ alias: 'example_spritesheet', src: './libs/revoltfx/assets/rfx-examples.json' });

		await PIXI.Assets.load(['fx_settings', 'fx_spritesheet', 'example_spritesheet']).then((data) => {
			this.fx.initBundle(data.fx_settings);
		});

		const container = new PIXI.Container();
		this.app.stage.addChild(container);

		// background
		var emitter = this.fx.getParticleEmitter('fairy-dust', true, true);
		emitter.settings.Min = 1;
		emitter.settings.spawnCountMax = 4;
		emitter.init(container, true, 1.1);
		emitter.x = PIXICONFIG.width * 0.5;
		emitter.y = PIXICONFIG.height * 0.5;
	}

	updateDebugText()
	{
		const elt = document.getElementById("debug-container");
		elt.innerHTML = `
	<table width=800>
		<tr>
			<td width=33%>
				<strong>Left bat</strong><br>
				position: ${Math.round(this.paddleLeft.sprite.x)}, ${Math.round(this.paddleLeft.sprite.y)}<br>
				bat surface: ${this.paddleLeft.surfaceSpeed.toFixed(5)}<br>
				wall surfaces: ${this.topWall.surfaceSpeed.toFixed(5)}<br>
			</td>
			<td width=33%>
				<strong>Ball</strong><br>
				position: ${Math.round(this.ball.sprite.x)}, ${Math.round(this.ball.sprite.y)}<br>
				spin: ${this.ball.spin.toFixed(5)}<br>
				vel: ${this.ball.velocity.x.toFixed(5)}, ${this.ball.velocity.y.toFixed(5)}<br>
				speed: ${Math.hypot(this.ball.velocity.x, this.ball.velocity.y).toFixed(2)}
				<br>
				frame: ${this.frameCount}<br>
			</td>
			<td width=33%>
				<strong>Right bat</strong><br>
				position: ${Math.round(this.paddleRight.sprite.x)}, ${Math.round(this.paddleRight.sprite.y)}<br>
				bat surface: ${this.paddleRight.surfaceSpeed.toFixed(5)}<br>
				wall surfaces: ${this.rightTopWall.surfaceSpeed.toFixed(5)}<br>
			</td>
		</tr>
	</table>
      `;
	}
}

window.GAME = new Game();
