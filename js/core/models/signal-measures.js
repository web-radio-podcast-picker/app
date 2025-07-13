// signal measures
class SignalMeasures {

    value = null;               // input value              (-1..1)

    volts = 0;                  // volts value (calculated from digitalized value)
    vMin = Number.MAX_VALUE;    // minimum volts value
    vMax = Number.MIN_VALUE;    // maximum volts value
    vAvg = 0;                   // average volts value

    frq = 0
    frqPe = 0
    frqMin = 0

    dataArray = null;           // array of samples datas   (-1..1)
    fftDataArray = null;        // array of fft datas (divs of 0..sampleRate/2)

    sampleRate = 0;             // rate of samples
    channelCount = 0;           // fft channel count

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