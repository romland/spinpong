import Actions from "../Actions.js";
export default class Action {
    constructor() {
        this.done = false;
        this.queued = [];
    }
    queue(after) {
        this.queued.push(after);
        return this;
    }
    play() {
        Actions.play(this);
        return this;
    }
    pause() {
        Actions.pause(this);
        return this;
    }
    reset() {
        this.done = false;
        return this;
    }
    stop() {
        this.pause().reset();
        return this;
    }
}
//# sourceMappingURL=Action.js.map