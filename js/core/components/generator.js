// signal generator

class Generator {

    channel = null      // related channel
    oscillator = null   // oscillator

    fnId = null         // active func
    frequency = null    // frequency

    reset() {
        // reset to defaults
        this.fnId = settings.generator.defaultFn
        this.frequency = settings.generator.defaultFrq
    }

    init(channel, oscillator) {
        this.oscillator = oscillator
        this.channel = channel
        this.reset()
    }

    start() {
        if (this.oscillator != null)
            this.oscillator.start(0)
    }

    stop() {
        if (this.oscillator != null)
            this.oscillator.stop(0)
    }

    activateFn(fnId) {
        if (this.oscillator == null) return
        switch (fnId) {
            case Gen_Fn_Sin:
            case Gen_Fn_Square:
            case Gen_Fn_Sawtooth:
            case Gen_Fn_Triangle:
                this.oscillator.type = fnId.toLowerCase()
                break;
            default:
                console.error('unknown gen fn', fnId)
        }
        this.fnId = fnId
    }

    setFrequency(v) {
        if (this.oscillator == null) return
        this.oscillator.frequency.value = v
    }
}