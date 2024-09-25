import TargetedAction from "./TargetedAction.js";
import Interpolations from "../Interpolations.js";
export default class MoveTo extends TargetedAction {
    constructor(target, x, y, seconds, interpolation = Interpolations.linear) {
        super(target, seconds);
        this.interpolation = interpolation;
        this.x = x;
        this.y = y;
    }
    tick(delta) {
        if (this.time === 0) {
            this.startX = this.target.x;
            this.startY = this.target.y;
        }
        this.time += delta;
        const factor = this.interpolation(this.timeDistance);
        this.target.position.set(this.startX + (this.x - this.startX) * factor, this.startY + (this.y - this.startY) * factor);
        return this.timeDistance >= 1;
    }
    reset() {
        super.reset();
        this.time = 0;
        return this;
    }
}
//# sourceMappingURL=MoveTo.js.map