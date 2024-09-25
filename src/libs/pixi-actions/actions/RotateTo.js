import TargetedAction from "./TargetedAction.js";
import Interpolations from "../Interpolations.js";
export default class RotateTo extends TargetedAction {
    constructor(target, rotation, seconds, interpolation = Interpolations.linear) {
        super(target, seconds);
        this.time = 0;
        this.interpolation = interpolation;
        this.rotation = rotation;
    }
    tick(delta) {
        if (this.time === 0) {
            this.startRotation = this.target.rotation;
        }
        this.time += delta;
        const factor = this.interpolation(this.timeDistance);
        this.target.rotation =
            this.startRotation + (this.rotation - this.startRotation) * factor;
        return this.timeDistance >= 1;
    }
    reset() {
        super.reset();
        this.time = 0;
        return this;
    }
}
//# sourceMappingURL=RotateTo.js.map