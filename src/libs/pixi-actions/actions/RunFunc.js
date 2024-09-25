import Action from "./Action.js";
export default class RunFunc extends Action {
    constructor(fn) {
        super();
        this.fn = fn;
    }
    tick(_) {
        this.fn.call(this);
        return true;
    }
}
//# sourceMappingURL=RunFunc.js.map