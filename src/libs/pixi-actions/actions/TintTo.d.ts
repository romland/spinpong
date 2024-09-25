import * as PIXI from 'pixi.js';
import TargetedAction from './TargetedAction';
import Interpolation from '../Interpolation';
export type TintableTarget = PIXI.Sprite | PIXI.BitmapText | PIXI.Graphics;
export default class TintTo extends TargetedAction {
    interpolation: Interpolation;
    tintableTarget: TintableTarget;
    startTint: PIXI.Color;
    tint: PIXI.Color;
    currentTint: PIXI.Color;
    constructor(target: TintableTarget, tint: number, seconds: number, interpolation?: Interpolation);
    tick(delta: number): boolean;
    reset(): this;
}
