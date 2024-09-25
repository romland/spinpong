import Action from "./Action";
export default class Repeat extends Action {
    action: Action;
    times: number;
    n: number;
    constructor(action: Action, times?: number);
    tick(delta: number): boolean;
    reset(): this;
}
