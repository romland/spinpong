import TargetedAction from "./TargetedAction";
import Interpolation from "../Interpolation";
import type { Target } from "./TargetedAction";
export default class ScaleTo extends TargetedAction {
    interpolation: Interpolation;
    startX: number;
    startY: number;
    x: number;
    y: number;
    constructor(target: Target, x: number, y: number, seconds: number, interpolation?: Interpolation);
    tick(delta: number): boolean;
    reset(): this;
}
