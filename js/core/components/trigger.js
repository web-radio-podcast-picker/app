// channel signal/time trigger

class Trigger {

    isOn            // true if is on
    type            // trigger type (Trigger_Type_...)
    threshold       // treshold default val
    sensitivity     // delta  +/-volts for ramp check

    constructor() {
        this.reset()
    }

    reset() {
        this.type = settings.trigger.defaultType
        this.sensitivity = settings.trigger.sensitivity
        this.isDown = false
        this.threshold = 0
        return this
    }

    toggle() {
        this.isOn = !this.isOn
    }
}