import TargetedAction from "./TargetedAction";
import Interpolation from "../Interpolation";
import type { Target } from "./TargetedAction";
export default class FadeTo extends TargetedAction {
    interpolation: Interpolation;
    startAlpha: number;
    alpha: number;
    constructor(target: Target, alpha: number, seconds: number, interpolation?: Interpolation);
    tick(delta: number): boolean;
    reset(): this;
}
