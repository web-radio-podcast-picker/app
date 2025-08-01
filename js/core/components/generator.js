/*
    Sound card Oscilloscope | Signal Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// signal generator

class Generator {

    channel = null      // related channel
    oscillator = null   // oscillator (-24khz..24kz)
    isOn = false        // true if on
    pause = false

    fnId = null         // active func
    frequency = null    // frequency
    frequency_hold = null// frequency value if holded
    frqOn = true             // true if frq stable is on
    frqModulationOn = false  // true if frq modulation is on
    ampModulationOn = false  // true if amp modulation is on
    modFrqTimerId = null
    modAmpTimerId = null
    gain_hold = null    // gain value if holded

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
        this.frequency_hold = null
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
        this.startOscillator()
        this.isOn = true
    }

    startOscillator() {
        if (this.oscillator != null) {
            this.oscillator.start(0)
        }
    }

    stop() {
        this.stopOscillator()
        this.isOn = false
    }

    stopOscillator() {
        if (this.oscillator != null) {
            this.oscillator.stop(0)
        }
    }

    setPause(pause) {
        if (!this.isOn) return
        this.pause = pause
        if (pause) {
            clearInterval(this.modFrqTimerId)
            clearInterval(this.modAmpTimerId)
        }
        else {
            this.setupModFrq()
            this.setupModAmp()
        }
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
            // stop actions
            clearInterval(this.modFrqTimerId)
            this.modFrqTimerId = null
        }
        if (this.frqModulationOn) {
            const pe = 1000 / Number(this.modulation.frqRate)
                / settings.generator.modTimerSteps / 2.0 // two turns
            const fn = () => this.modFrqTimer()
            this.modulator.modFrqTime = Date.now()
            if (this.frequency_hold == null)
                this.frequency_hold = this.frequency
            this.modFrqTimerId = setInterval(fn, pe)
        }
        else {
            // restore frq
            if (this.frequency_hold != null) {
                this.frequency = this.frequency_hold
                this.frequency_hold = null
                this.setFrequency(this.frequency)
            }
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
            if (this.gain_hold == null)
                this.gain_hold = this.channel.gainValue
            this.modAmpTimerId = setInterval(fn, pe)
        }
        else {
            // restore gain
            if (this.gain_hold != null) {
                this.channel.setGain(this.gain_hold)
                this.gain_hold = null
            }
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