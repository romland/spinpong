export default abstract class Action {
    done: boolean;
    queued: Array<Action>;
    abstract tick(progress: number): boolean;
    queue(after: Action): this;
    play(): this;
    pause(): this;
    reset(): this;
    stop(): this;
}
