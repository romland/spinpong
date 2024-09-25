import Action from './actions/Action';
import Interpolation from './Interpolation';
import type { Target } from "./actions/TargetedAction";
import type { TintableTarget } from "./actions/TintTo";
export default class Actions {
    static actions: Array<Action>;
    static moveTo(target: Target, x: number, y: number, seconds: number, interpolation?: Interpolation): Action;
    static fadeTo(target: Target, alpha: number, seconds: number, interpolation?: Interpolation): Action;
    static fadeOut(target: Target, seconds: number, interpolation?: Interpolation): Action;
    static fadeOutAndRemove(target: Target, seconds: number, interpolation?: Interpolation): Action;
    static fadeIn(target: Target, seconds: number, interpolation?: Interpolation): Action;
    static remove(target: Target): Action;
    static delay(seconds: number): Action;
    static runFunc(fn: () => void): Action;
    static scaleTo(target: Target, x: number, y: number, seconds: number, interpolation?: Interpolation): Action;
    static rotateTo(target: Target, rotation: number, seconds: number, interpolation?: Interpolation): Action;
    static angleTo(target: Target, degrees: number, seconds: number, interpolation?: Interpolation): Action;
    static tintTo(target: TintableTarget, tint: number, seconds: number, interpolation?: Interpolation): Action;
    static sequence(...actions: Array<Action>): Action;
    static parallel(...actions: Array<Action>): Action;
    static repeat(action: Action, times?: number): Action;
    static play(action: Action): void;
    static pause(action: Action): void;
    static clear(target?: Target): void;
    static tick(delta: number): void;
}
