import Action from "./Action";
export default class Parallel extends Action {
    index: number;
    actions: Array<Action>;
    constructor(...actions: Array<Action>);
    tick(delta: number): boolean;
    reset(): this;
}
