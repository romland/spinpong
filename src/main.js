import { CONFIG, PIXICONFIG } from "./config.js";
import Ball from "./ball.js";
import Paddle from "./paddle.js";
import Wall from "./wall.js";
import Brick from "./brick.js";
import BrickSet from "./brickset.js";
import FollowBot from "./bots/followbot.js";
import PredictPositionBot from "./bots/PredictPositionBot.js";

class Game
{
	constructor() {
		this.init();
	}


	async init()
	{
		const app = new PIXI.Application(PIXICONFIG);	// pass in PIXICONFIG for compat with Pixi 7
		this.app = app;

		// make it compatible with both pixi 7 and 8
		if(app.init) {
			await app.init(PIXICONFIG);
		}

		// console.log("hm", this.app.stage)
		// this.stage = new PIXI.Container();
		document.body.appendChild(app.view);
		
		await this.initRevolt();
		await this.loadAssets();

		// Initialize keyboard
		const keyboard = {};
		window.addEventListener('keydown', (e) => {
			if (e.code === "KeyP") {
				const currTrajectory = [];
				this.ball.drawTrajectory(currTrajectory);
				console.log(currTrajectory);
				
				togglePause();
			}
			
			keyboard[e.code] = true;
		});
		window.addEventListener('keyup', (e) => {
			keyboard[e.code] = false;
		});
		
		
		let paused = false;
		this.frameCount = 0;

		function togglePause() {
			paused = !paused;
		}
		
		
		this.paddleLeft = new Paddle(app, CONFIG.paddle.offsetX, app.view.height / 2 - CONFIG.paddle.height / 2, {
			up: 'KeyW',
			down: 'KeyS',
			incSurfaceSpeed: 'KeyD',
			decSurfaceSpeed: 'KeyE'
		});

		this.paddleRight = new Paddle(app, app.view.width - CONFIG.paddle.offsetX - CONFIG.paddle.width, app.view.height / 2 - CONFIG.paddle.height / 2, {
			up: 'Numpad8',
			down: 'Numpad5',
			incSurfaceSpeed: 'Numpad6',
			decSurfaceSpeed: 'Numpad9'
		});
		
		// Player 1
		this.topWall = new Wall(app, 0, 0, (app.view.width / 2) - 3, {
			incSurfaceSpeed: 'KeyQ',
			decSurfaceSpeed: 'KeyR'
		});
		this.bottomWall = new Wall(app, 0, app.view.height - CONFIG.walls.height, (app.view.width / 2) - 3, {
			incSurfaceSpeed: 'KeyQ',
			decSurfaceSpeed: 'KeyR'
		});
		
		// Player 2
		this.rightTopWall = new Wall(app, (app.view.width / 2) + 3, 0, app.view.width / 2, {
			incSurfaceSpeed: 'Numpad1',
			decSurfaceSpeed: 'Numpad3'
		});
		this.rightBottomWall = new Wall(app, (app.view.width / 2) + 3, app.view.height - CONFIG.walls.height, app.view.width / 2, {
			incSurfaceSpeed: 'Numpad1',
			decSurfaceSpeed: 'Numpad3'
		});
		
		this.ball = new Ball(app, this.paddleLeft, this.paddleRight, this.topWall, this.bottomWall, this.rightTopWall, this.rightBottomWall);
		
		let leftBot = new FollowBot(this.paddleLeft);
		// let rightBot = new FollowBot(this.paddleRight);
		let rightBot = new PredictPositionBot(this.paddleRight, this.paddleLeft, this.ball);
		
		let gameObjects = [
			// new Brick(this.app, 500, 200, ""),
			new BrickSet(app).createFromMatrix(
				"     1 1 111\n" +
				"     111  1 \n" +
				"     1 1 111\n"
			)
		];

		app.ticker.add(() => {
			if (paused) {
				return;
			}

			this.fx.update();

			// if(window.GAME.frameCount === 720) {
			// 	debugger;
			// }

			for(let i = 0; i < gameObjects.length; i++) {
				gameObjects[i].move(keyboard);
			}

			if (leftBot) {
				leftBot.update(this.paddleLeft, this.ball);
			}
			
			if (rightBot) {
				rightBot.update(this.paddleRight, this.ball);
			}
			
			this.paddleLeft.move(keyboard);
			this.paddleRight.move(keyboard);
			
			this.topWall.move(keyboard);
			this.bottomWall.move(keyboard);
			
			this.rightTopWall.move(keyboard);
			this.rightBottomWall.move(keyboard);
			
			this.ball.move(keyboard, gameObjects);

			if(this.ballEmitter) {
				this.ballEmitter.x = this.ball.sprite.x;
				this.ballEmitter.y = this.ball.sprite.y;
			}

			this.updateDebugText();
			this.frameCount++;
		});
	}

	async loadAssets()
	{
		return;

		PIXI.Assets.add({ alias: 'ball', src: './assets/sprites.json' });
		await PIXI.Assets.load(['fx_settings', 'fx_spritesheet', 'example_spritesheet']).then((data) => {
			// this.fx.initBundle(data.ball);
		});

	}

	async initRevolt()
	{
		/*
        //Hack WebGL Add BlendMode
        if (this.app.renderer.type == 1) {
			console.log("blendmode hack");
            this.app.renderer.state.blendModes[PIXI.BLEND_MODES.ADD] = [this.app.renderer.gl.ONE, this.app.renderer.gl.ONE];
        }
		*/

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
/*
		// ball-test
		this.ballEmitter = this.fx.getParticleEmitter('fire-arc', true, true);
		this.ballEmitter.settings.Min = 1;
		this.ballEmitter.settings.spawnCountMax = 1;
		this.ballEmitter.init(container, true, 0.2);
*/
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
