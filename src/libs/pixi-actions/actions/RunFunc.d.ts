import Action from "./Action";
export default class RunFunc extends Action {
    fn: () => void;
    constructor(fn: () => void);
    tick(_: number): boolean;
}
