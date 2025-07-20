// channel signal/time trigger

class Trigger {

    isOn            // true if is on
    type            // trigger type (Trigger_Type_...)
    threshold       // treshold default val

    constructor() {
        this.reset()
    }

    reset() {
        this.type = settings.trigger.defaultType
        this.isDown = false
        this.threshold = 0
        return this
    }
}