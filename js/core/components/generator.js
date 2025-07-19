// signal generator

class Generator {

    channel = null      // related channel
    oscillator = null   // oscillator

    fnId = null         // active func
    frequency = null    // frequency
    frqOn = true             // true if frq stable is on
    frqModulationOn = false  // true if frq modulation is on
    ampModulationOn = false  // true if amp modulation is on

    modulation = {
        frqMin: null,         // frequency modulation min
        frqMax: null,         // frequency modulation max
        frqRate: null,        // frequency modulation rate
        ampMin: null,         // frequency modulation min
        ampMax: null,         // frequency modulation max
        ampRate: null         // frequency modulation rate
    }

    reset() {
        // reset to defaults
        this.fnId = settings.generator.defaultFn
        this.frequency = settings.generator.defaultFrq
        const m = settings.generator.defaultModulation
        this.frqOn = true
        this.frqModulationOn = false
        this.ampModulationOn = false
        this.initModulation(m)
    }

    initModulation(m) {
        this.modulation.frqMin = m.frqMin
        this.modulation.frqMax = m.frqMax
        this.modulation.frqRate = m.frqRate
        this.modulation.ampMin = m.ampMin
        this.modulation.ampMax = m.ampMax
        this.modulation.ampRate = m.ampRate
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

    setModulation(props) {
        const m = { ...this.modulation, ...props }
        this.initModulation(m)
    }
}