import Action from "./Action.js";
export default class Delay extends Action {
    constructor(seconds) {
        super();
        this.time = 0;
        this.seconds = seconds;
    }
    tick(delta) {
        this.time += delta;
        return this.time >= this.seconds;
    }
    reset() {
        super.reset();
        this.time = 0;
        return this;
    }
}
//# sourceMappingURL=Delay.js.map