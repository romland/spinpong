//		ball.registerListener("onPositionPredicted", (args) => this.onPositionPredicted(...args));


export default class Eventable
{
    constructor()
    {
        this.listeners = {};
    }

    haveListeners(type)
    {
        return this.listeners[type] && this.listeners[type].length > 0;
    }

    registerListener(type, func)
    {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }

        this.listeners[type].push(func);
    }

    notifyListeners(type, ...args)
    {
        if(!this.haveListeners(type)) {
            return;
        }

        for (let i = 0; i < this.listeners[type].length; i++) {
            this.listeners[type][i](args);
        }
    }
}