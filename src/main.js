import { CONFIG, PIXICONFIG } from "./config.js";
import Ball from "./ball.js";
import Paddle from "./paddle.js";
import Wall from "./wall.js";
import FollowBot from "./bots/followbot.js";
import PredictPositionBot from "./bots/PredictPositionBot.js";

class Game
{
	constructor() {
		const app = new PIXI.Application(PIXICONFIG);
		this.app = app;
		document.body.appendChild(app.view);
		
		this.initRevolt();

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
		
		app.ticker.add(() => {
			if (paused) {
				return;
			}

			// if(window.GAME.frameCount > 1115) {
			// 	debugger;
			// }

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
			

			this.ball.move(keyboard);
			this.updateDebugText();
			this.frameCount++;
		});
	}

	async initRevolt()
	{
        //Hack WebGL Add BlendMode
        if (this.app.renderer.type == 1) {
			console.log("blendmode hack");
            this.app.renderer.state.blendModes[PIXI.BLEND_MODES.ADD] = [this.app.renderer.gl.ONE, this.app.renderer.gl.ONE];
        }

		//Create a RevoltFX instance
		this.fx = new revolt.FX(); //loaded via the script tag

		//Load the assets using PIXI Assets loader
		PIXI.Assets.add({ alias: 'fx_settings', src: './libs/revoltfx/assets/default-bundle.json' });
		PIXI.Assets.add({ alias: 'fx_spritesheet', src: './libs/revoltfx/assets/revoltfx-spritesheet.json' });
		PIXI.Assets.add({ alias: 'example_spritesheet', src: './libs/revoltfx/assets/rfx-examples.json' });

		await PIXI.Assets.load(['fx_settings', 'fx_spritesheet', 'example_spritesheet']).then((data) => {
			//Init the bundle
			console.log(data)
			this.fx.initBundle(data.fx_settings);

			this.app.ticker.add(() => {
				//Update the RevoltFX instance
				this.fx.update();
			});
		});

		const container = new PIXI.Container();
		this.app.stage.addChild(container);
		
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
				position: ${this.paddleLeft.sprite.x}, ${this.paddleLeft.sprite.y}<br>
				bat surface: ${this.paddleLeft.surfaceSpeed}<br>
				wall surfaces: ${this.topWall.surfaceSpeed}<br>
			</td>
			<td width=33%>
				<strong>Ball</strong><br>
				position: ${this.ball.sprite.x}, ${this.ball.sprite.y}<br>
				spin: ${this.ball.spin}<br>
				vel: ${this.ball.velocity.x}, ${this.ball.velocity.y}<br>
				<br>
				frame: ${this.frameCount}<br>
			</td>
			<td width=33%>
				<strong>Right bat</strong><br>
				position: ${this.paddleRight.sprite.x}, ${this.paddleRight.sprite.y}<br>
				bat surface: ${this.paddleRight.surfaceSpeed}<br>
				wall surfaces: ${this.rightTopWall.surfaceSpeed}<br>
			</td>
		</tr>
	</table>
      `;
	}
}

window.GAME = new Game();
