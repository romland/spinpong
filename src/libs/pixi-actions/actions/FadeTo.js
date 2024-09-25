import TargetedAction from "./TargetedAction.js";
import Interpolations from "../Interpolations.js";
export default class FadeTo extends TargetedAction {
    constructor(target, alpha, seconds, interpolation = Interpolations.linear) {
        super(target, seconds);
        this.interpolation = interpolation;
        this.alpha = alpha;
    }
    tick(delta) {
        if (this.time === 0) {
            this.startAlpha = this.target.alpha;
        }
        this.time += delta;
        const factor = this.interpolation(this.timeDistance);
        this.target.alpha =
            this.startAlpha + (this.alpha - this.startAlpha) * factor;
        return this.timeDistance >= 1;
    }
    reset() {
        super.reset();
        this.time = 0;
        return this;
    }
}
//# sourceMappingURL=FadeTo.js.map