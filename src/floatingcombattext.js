/*
    Notes on Actions.
    
    https://github.com/srpatel/pixi-actions
    
    Interpolations.linear = (x) => x;
    Interpolations.smooth = (x) => x * x * (3 - 2 * x);
    Interpolations.smooth2 = (x) => Interpolations.smooth(Interpolations.smooth(x));
    Interpolations.smoother = (a) => a * a * a * (a * (a * 6 - 15) + 10);
    Interpolations.fade = Interpolations.smoother;
    Interpolations.pow2out = (x) => Math.pow(x - 1, 2) * (-1) + 1;

    resizeMiddleSegment(newYscale)
    {
        Actions.parallel(
            Actions.scaleTo(this.midSprite, this.midSprite.scale.x, newYscale, 1, Interpolations.smoother ),
            Actions.moveTo(this.bottomSprite, this.bottomSprite.x, this.topSprite.height + (this.midSprite.height * newYscale), 1, Interpolations.smoother),
        ).play();
    }
*/
import { Actions, Interpolations } from './libs/pixi-actions/index.js';
import { bounceInterpolation } from './utils.js';

class FloatingCombatTextManager {
    constructor() {
        this.texts = [];
    }
    
    add(text, options) {
        const fct = new FloatingCombatText(text, options);
        this.texts.push(fct);
    }

    move(delta) {
        this.texts.forEach((fct) => fct.update(delta));

        // Remove dead texts
        this.texts = this.texts.filter((fct) => !fct.dead);
    }
}

class FloatingCombatText
{
    constructor(text, options)
    {
        const { x, y, fontSize, fontFamily, color, fadeOutTime, direction, timeToLive, outlineColor } = options;
        
        this.text = new PIXI.Text(text, {
            fontSize: fontSize * 2 || 32,
            fontFamily: fontFamily || 'Georgia',
            fill: color || 0xFFFFFF,
            stroke: outlineColor || 0x000000,
            strokeThickness: 4,
        });
        this.text.anchor.set(0.5, 0.5);
        this.text.scale.set(0.5, 0.5);
        this.text.position.set(x, y);
        this.direction = direction || { x: 0, y: -1 };
        this.timeToLive = timeToLive || 2000;
        this.elapsed = 0;
        this.dead = false;

        GAME.app.stage.addChild(this.text);

        const secsToLive = this.timeToLive / 60;
        Actions.parallel(
            Actions.scaleTo(this.text, this.text.scale.x * 2, this.text.scale.y * 2, secsToLive / 2, Interpolations.smoother2 ),
            Actions.moveTo(this.text, this.text.x, this.text.y - 100, secsToLive, Interpolations.smoother),
            Actions.fadeOut( this.text, secsToLive, Interpolations.smoother ),
        ).play();

    }

    update(delta) {
        this.elapsed += delta;

        // Handle destruction
        if (this.elapsed >= this.timeToLive) {
            GAME.app.stage.removeChild(this.text);
            this.dead = true;
        }
    }
}

export { FloatingCombatTextManager, FloatingCombatText };
export default FloatingCombatTextManager;