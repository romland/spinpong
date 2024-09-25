import Action from "./Action.js";
export default class TargetedAction extends Action {
    constructor(target, seconds) {
        super();
        this.time = 0;
        this.seconds = seconds;
        this.target = target;
    }
    get timeDistance() {
        return Math.min(1, this.time / this.seconds);
    }
}
;
//# sourceMappingURL=TargetedAction.js.map