/*
    Sound card Oscilloscope | Signal Analyzer Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// channel signal/time trigger

class Trigger {

    isOn            // true if is on
    type            // trigger type (Trigger_Type_...)
    threshold       // treshold default val
    sensitivity     // delta +/-volts for ramp check
    timeThreshold   // actually samples count
    triggeredV      // V when triggered 

    constructor() {
        this.reset()
    }

    reset() {
        const t = settings.trigger
        this.type = t.defaultType
        this.sensitivity = t.sensitivity
        this.threshold = t.threshold
        this.timeThreshold = t.timeThreshold
        this.isDown = false
        this.triggeredV = null
        return this
    }

    toggle() {
        this.isOn = !this.isOn
    }

    checkTrigger(channel, dataArray) {
        var prevValue = null
        const minDelta = this.sensitivity
        const minTimeDelta = this.timeThreshold
        var j = 1
        this.triggeredV = null

        for (var i = 0; i < dataArray.length; i += 1) {
            var value = dataArray[i];
            value = valueToVolt(channel, value);
            if (prevValue == null) prevValue = value
            const delta = value - prevValue
            // check orientation
            if ((delta > 0 && this.type == Trigger_Type_Up)
                || (delta < 0 && this.type == Trigger_Type_Down)) {
                // check threshold
                if (value >= this.threshold
                    && value <= this.threshold + minDelta
                ) {
                    if (j >= minTimeDelta) {
                        this.triggeredV = value
                        return i - j + 1
                    }
                    else
                        j++
                }
                else
                    j = 0
            } else
                j = 0
            prevValue = value
        }

        // not triggered
        return 0
    }
}