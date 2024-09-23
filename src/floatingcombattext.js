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

class FloatingCombatText {
    constructor(text, options) {
        const { x, y, fontSize, fontFamily, color, fadeOutTime, direction, timeToLive, outlineColor } = options;
        
        this.text = new PIXI.Text(text, {
            fontSize: fontSize || 16,
            fontFamily: fontFamily || 'Georgia',
            fill: color || 0xFFFFFF,
            stroke: outlineColor || 0x000000,
            strokeThickness: 4,
        });
        this.text.position.set(x, y);
        this.fadeOutTime = fadeOutTime || 1000;
        this.direction = direction || { x: 0, y: -1 };
        this.timeToLive = timeToLive || 2000;
        this.elapsed = 0;
        this.dead = false;

        GAME.app.stage.addChild(this.text);
    }

    update(delta) {
        this.elapsed += delta;
        
        // Move text
        this.text.position.x += this.direction.x * delta;
        this.text.position.y += this.direction.y * delta;

        // Handle fading out
        if (this.elapsed >= this.timeToLive - this.fadeOutTime) {
            const remaining = this.timeToLive - this.elapsed;
            this.text.alpha = remaining / this.fadeOutTime;
        }

        // Handle destruction
        if (this.elapsed >= this.timeToLive) {
            GAME.app.stage.removeChild(this.text);
            this.dead = true;
        }
    }
}

export { FloatingCombatTextManager, FloatingCombatText };
export default FloatingCombatTextManager;