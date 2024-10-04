import { CONFIG, DEFAULT_KEYBOARD } from "./config.js";
import Paddle from "./paddle.js";
import Wall from "./wall.js";

/**
 * Keep track of player-state (score, save power-ups, achievements, ...)
 */
export default class Player
{
    constructor(side = null)
    {
        if(side !== "right" && side !== "left") {
            throw "side must be right or left";
        }

        this.side = side;
        this.resetObjects();
    }

    setBot(bot)
    {
        this.bot = bot;
    }

    getPaddle()
    {
        return this.paddle;
    }

    getTop()
    {
        return this.top;
    }

    getBottom()
    {
        return this.bottom;
    }

    resetObjects()
    {
        const app = GAME.getApp();

        // todo: reset walls/paddle/active powerups (perhaps just spawn new?)
        if(this.side === "left") {
            this.paddle = new Paddle(app, CONFIG.paddle.offsetX, app.view.height / 2, DEFAULT_KEYBOARD.leftPlayer.paddle);
            this.top = new Wall(app, 0, 0, (app.view.width / 2) - 3, DEFAULT_KEYBOARD.leftPlayer.walls.top);
            this.bottom = new Wall(app, 0, app.view.height - CONFIG.walls.height, (app.view.width / 2) - 3, DEFAULT_KEYBOARD.leftPlayer.walls.bottom);
        } else {
            this.paddle = new Paddle(app, app.view.width - CONFIG.paddle.offsetX - CONFIG.paddle.width, app.view.height / 2, DEFAULT_KEYBOARD.rightPlayer.paddle);
            this.top = new Wall(app, (app.view.width / 2) + 3, 0, app.view.width / 2, DEFAULT_KEYBOARD.rightPlayer.walls.top);
            this.bottom = new Wall(app, (app.view.width / 2) + 3, app.view.height - CONFIG.walls.height, app.view.width / 2, DEFAULT_KEYBOARD.rightPlayer.walls.bottom);
        }
    }

    // for power-ups that are not immediately invoked on catch
    addPowerUp()
    {
    }

    // for power-ups that are not immediately invoked on catch
    consumePowerUp()
    {
    }

    move(keyboard)
    {
        if (this.bot) {
            this.bot.update(this.paddle, GAME.getBall());
        }
        this.paddle.move(keyboard);

        this.top.move(keyboard);
        this.bottom.move(keyboard);
    }
}
