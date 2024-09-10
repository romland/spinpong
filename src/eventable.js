export default class Eventable
{
    constructor()
    {
        this.callbacks = {};
    }


    hasCallback(type)
    {
        return this.callbacks[type] && this.callbacks[type].length > 0;
    }

    // todo: removeCallback()
    registerCallback(type, func) {
        if (!this.callbacks[type]) {
            this.callbacks[type] = [];
        }

        this.callbacks[type].push(func);
    }

    doCallbacks(type, ...args) {
        for (let i = 0; i < this.callbacks[type].length; i++) {
            this.callbacks[type][i](args);
        }

    }
}