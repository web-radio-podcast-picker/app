// signal generator

class Generator {

    channel = null      // related channel
    oscillator = null   // oscillator (-24khz..24kz)

    fnId = null         // active func
    frequency = null    // frequency
    frqOn = true             // true if frq stable is on
    frqModulationOn = false  // true if frq modulation is on
    ampModulationOn = false  // true if amp modulation is on
    modFrqTimerId = null
    modAmpTimerId = null

    modulator = null

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
        this.modulator = {
            modFrqTime: 0,
            modAmpTime: 0
        }
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
        // -24000 .. 24000 hz
        if (this.oscillator == null) return
        this.oscillator.frequency.value = v
    }

    setModulation(props) {
        const doSetFrqRate = props.hasOwnProperty('frqRate')
        const doSetAmpRate = props.hasOwnProperty('ampRate')
        const m = { ...this.modulation, ...props }
        this.initModulation(m)
        if (doSetFrqRate)
            this.setupModRate()
        if (doSetAmpRate)
            this.setupAmpRate()
    }

    setupModFrq() {
        if (this.modFrqTimerId != null) {
            clearInterval(this.modFrqTimerId)
            this.modFrqTimerId = null
        }
        if (this.frqModulationOn) {
            const pe = 1000 / Number(this.modulation.frqRate)
                / settings.generator.modTimerSteps / 2.0 // two turns
            const fn = () => this.modFrqTimer()
            this.modulator.modFrqTime = Date.now()
            this.modFrqTimerId = setInterval(fn, pe)
        }
    }

    setupModRate() {
        this.setupModFrq()
    }

    setupModAmp() {
        if (this.modAmpTimerId != null) {
            clearInterval(this.modAmpTimerId)
            this.modAmpTimerId = null
        }
        if (this.ampModulationOn) {
            const pe = 1000 / Number(this.modulation.ampRate)
                / settings.generator.modTimerSteps / 2.0 // two turns
            const fn = () => this.modAmpTimer()
            this.modulator.modAmpTime = Date.now()
            this.modAmpTimerId = setInterval(fn, pe)
        }
    }

    setupAmpRate() {
        this.setupModAmp()
    }

    modFrqTimer() {
        // 1 sec time = 2PI period
        const dt = Date.now() - this.modulator.modFrqTime   // ms
        const ang = dt / 1000.0 * Math.PI * 2.0 * this.modulation.frqRate
        var f = (Math.sin(ang) + 1.0) / 2.0
        const fMin = Number(this.modulation.frqMin)
        f *= (Number(this.modulation.frqMax) - fMin)
        f += fMin
        this.setFrequency(f)
    }

    modAmpTimer() {
        // 1 sec time = 2PI period
        const dt = Date.now() - this.modulator.modAmpTime   // ms
        const ang = dt / 1000.0 * Math.PI * 2.0 * this.modulation.ampRate
        var f = (Math.sin(ang) + 1.0) / 2.0
        const fMin = Number(this.modulation.ampMin)
        f *= (Number(this.modulation.ampMax) - fMin)
        f += fMin
        this.channel.setGain(f)
    }
}