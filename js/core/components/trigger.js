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
        const t = settings.trigger
        this.type = t.defaultType
        this.sensitivity = t.sensitivity
        this.threshold = t.threshold
        this.isDown = false
        this.threshold = 0
        return this
    }

    toggle() {
        this.isOn = !this.isOn
    }
}