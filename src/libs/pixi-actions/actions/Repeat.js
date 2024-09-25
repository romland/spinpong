import Action from "./Action.js";
export default class Repeat extends Action {
    constructor(action, times = -1) {
        super();
        this.n = 0;
        this.action = action;
        this.times = times;
    }
    tick(delta) {
        if (this.action.tick(delta)) {
            this.n++;
            if (this.times >= 0 && this.n >= this.times) {
                return true;
            }
            else {
                // reset delta!
                this.reset();
            }
        }
        return false;
    }
    reset() {
        super.reset();
        this.action.reset();
        return this;
    }
}
//# sourceMappingURL=Repeat.js.map