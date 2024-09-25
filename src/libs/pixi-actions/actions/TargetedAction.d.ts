import * as PIXI from 'pixi.js';
import Action from './Action';
export type Target = PIXI.Container;
export default abstract class TargetedAction extends Action {
    time: number;
    seconds: number;
    target: Target;
    constructor(target: Target, seconds: number);
    get timeDistance(): number;
}
