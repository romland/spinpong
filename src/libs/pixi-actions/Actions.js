// import * as PIXI from 'pixi.js';
import TargetedAction from './actions/TargetedAction.js';
import Interpolations from './Interpolations.js';
import MoveTo from './actions/MoveTo.js';
import ScaleTo from './actions/ScaleTo.js';
import RotateTo from './actions/RotateTo.js';
import Sequence from './actions/Sequence.js';
import Parallel from './actions/Parallel.js';
import Repeat from './actions/Repeat.js';
import FadeTo from './actions/FadeTo.js';
import Delay from './actions/Delay.js';
import RunFunc from './actions/RunFunc.js';
import TintTo from './actions/TintTo.js';
class Actions {
    static moveTo(target, x, y, seconds, interpolation = Interpolations.pow2out) {
        return new MoveTo(target, x, y, seconds, interpolation);
    }
    static fadeTo(target, alpha, seconds, interpolation = Interpolations.pow2out) {
        return new FadeTo(target, alpha, seconds, interpolation);
    }
    static fadeOut(target, seconds, interpolation = Interpolations.pow2out) {
        return Actions.fadeTo(target, 0, seconds, interpolation);
    }
    static fadeOutAndRemove(target, seconds, interpolation = Interpolations.pow2out) {
        return Actions.sequence(Actions.fadeOut(target, seconds, interpolation), Actions.remove(target));
    }
    static fadeIn(target, seconds, interpolation = Interpolations.pow2out) {
        return Actions.fadeTo(target, 1, seconds, interpolation);
    }
    static remove(target) {
        return Actions.runFunc(() => {
            if (target.parent != null)
                target.parent.removeChild(target);
        });
    }
    static delay(seconds) {
        return new Delay(seconds);
    }
    static runFunc(fn) {
        return new RunFunc(fn);
    }
    static scaleTo(target, x, y, seconds, interpolation = Interpolations.pow2out) {
        return new ScaleTo(target, x, y, seconds, interpolation);
    }
    static rotateTo(target, rotation, seconds, interpolation = Interpolations.pow2out) {
        return new RotateTo(target, rotation, seconds, interpolation);
    }
    static angleTo(target, degrees, seconds, interpolation = Interpolations.pow2out) {
        return Actions.rotateTo(target, PIXI.DEG_TO_RAD * degrees, seconds, interpolation);
    }
    static tintTo(target, tint, seconds, interpolation = Interpolations.pow2out) {
        return new TintTo(target, tint, seconds, interpolation);
    }
    static sequence(...actions) {
        return new Sequence(...actions);
    }
    static parallel(...actions) {
        return new Parallel(...actions);
    }
    static repeat(action, times = -1) {
        return new Repeat(action, times);
    }
    static play(action) {
        this.actions.push(action);
    }
    static pause(action) {
        const index = this.actions.indexOf(action);
        if (index >= 0) {
            this.actions.splice(index, 1);
        }
    }
    static clear(target) {
        for (let i = this.actions.length - 1; i >= 0; i--) {
            const action = this.actions[i];
            if (!target ||
                (action instanceof TargetedAction && action.target == target)) {
                this.actions.splice(i, 1);
            }
        }
    }
    static tick(delta) {
        for (let i = this.actions.length - 1; i >= 0; i--) {
            const action = this.actions[i];
            if (action instanceof TargetedAction) {
                // If the action is targeted, but has no target, we remove the action
                // We also remove the action if the target has no parent to allow DisplayObjects outside the tree to be gc'd.
                if (action.target == null || !action.target.parent) {
                    this.actions.splice(i, 1);
                    continue;
                }
            }
            // Otherwise, we tick the action
            const done = action.tick(delta);
            if (done) {
                action.done = true;
                this.actions.splice(i, 1);
                // Are there any queued events?
                for (let j = 0; j < action.queued.length; j++) {
                    Actions.play(action.queued[j]);
                }
                action.queued = [];
            }
        }
    }
}
Actions.actions = [];
export default Actions;
;
//# sourceMappingURL=Actions.js.map