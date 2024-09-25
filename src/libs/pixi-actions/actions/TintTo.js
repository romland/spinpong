// import * as PIXI from 'pixi.js';
import TargetedAction from './TargetedAction.js';
import Interpolations from '../Interpolations.js';
export default class TintTo extends TargetedAction {
    constructor(target, tint, seconds, interpolation = Interpolations.linear) {
        super(target, seconds);
        this.currentTint = new PIXI.Color();
        this.interpolation = interpolation;
        this.tint = new PIXI.Color(tint);
        this.tintableTarget = target;
    }
    tick(delta) {
        if (!this.tintableTarget) {
            return true;
        }
        if (this.time === 0) {
            this.startTint = new PIXI.Color(this.tintableTarget.tint);
        }
        this.time += delta;
        const factor = this.interpolation(this.timeDistance);
        this.currentTint.setValue([
            this.startTint.red + (this.tint.red - this.startTint.red) * factor,
            this.startTint.green + (this.tint.green - this.startTint.green) * factor,
            this.startTint.blue + (this.tint.blue - this.startTint.blue) * factor,
        ]);
        this.tintableTarget.tint = this.currentTint;
        return this.timeDistance >= 1;
    }
    reset() {
        super.reset();
        this.time = 0;
        return this;
    }
}
;
//# sourceMappingURL=TintTo.js.map