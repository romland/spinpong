import TargetedAction from "./TargetedAction";
import Interpolation from "../Interpolation";
import type { Target } from "./TargetedAction";
export default class RotateTo extends TargetedAction {
    time: number;
    seconds: number;
    interpolation: Interpolation;
    startRotation: number;
    rotation: number;
    constructor(target: Target, rotation: number, seconds: number, interpolation?: Interpolation);
    tick(delta: number): boolean;
    reset(): this;
}
