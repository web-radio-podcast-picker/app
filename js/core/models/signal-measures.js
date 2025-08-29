/*
    Sound card Oscilloscope | Spectrum Analyzer | Signal Generator
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// signal measures

class SignalMeasures {

    value = null               // input value              (-1..1)

    volts = 0                  // volts value (calculated from digitalized value)
    vMin = 0                   // minimum volts value
    vMax = 0                   // maximum volts value
    vRange = 0                 // maximum range (vMax - vMin)
    vAvg = 0                   // average volts value

    frq = 0
    frqPe = 0
    frqMin = 0
    frqMax = 0

    dataArray = null           // array of samples datas   (-1..1)
    fftDataArray = null        // array of fft datas (divs of 0..sampleRate/2)

    sampleRate = 0             // rate of samples
    channelCount = 0           // fft channel count

    reset() {
        this.volts =
            this.vMin =
            this.vMax =
            this.vAvg =
            this.frq =
            this.frqPe =
            this.frqMin =
            this.frqMax =
            this.sampleRate =
            this.channelCount = 0
        this.dataArray =
            this.fftDataArray =
            this.value = null
    }

    // set input value
    setValue(channel, value) {
        this.value = value;
        this.volts = valueToVolt(channel, value);
    }

    // set measures from input value
    setMeasures(channel, min, max, avg, frq, frqMin, frqMax) {
        this.vMin = valueToVolt(channel, min);
        this.vMax = valueToVolt(channel, max);
        this.vAvg = valueToVolt(channel, avg);
        this.vRange = this.vMax - this.vMin
        this.frq = frq
        this.frqPe = 1000.0 / frq
        this.frqMin = frqMin
        this.frqMax = frqMax
    }

    setData(data, fftData, sampleRate, channelCount, minDb, maxDb) {
        this.dataArray = data;
        this.fftDataArray = fftData;
        this.sampleRate = sampleRate;
        this.channelCount = channelCount
        this.minDb = minDb
        this.maxDb = maxDb
    }

}