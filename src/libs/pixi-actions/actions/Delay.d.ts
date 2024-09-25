import Action from "./Action";
export default class Delay extends Action {
    time: number;
    seconds: number;
    constructor(seconds: number);
    tick(delta: number): boolean;
    reset(): this;
}
