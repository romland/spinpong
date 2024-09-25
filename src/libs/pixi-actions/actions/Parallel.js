import Action from "./Action.js";
export default class Parallel extends Action {
    constructor(...actions) {
        super();
        this.index = 0;
        this.actions = actions;
    }
    tick(delta) {
        // Tick all elements!
        let allDone = true;
        for (let i = 0; i < this.actions.length; i++) {
            const action = this.actions[i];
            if (!action.done) {
                if (action.tick(delta)) {
                    action.done = true;
                }
                else {
                    allDone = false;
                }
            }
        }
        return allDone;
    }
    reset() {
        super.reset();
        this.index = 0;
        for (const i in this.actions) {
            this.actions[i].reset();
        }
        return this;
    }
}
//# sourceMappingURL=Parallel.js.map