// get samples task

class GetSamplesTask {

    analyzer = null     // analyzer for getting samples

    bufferLength = 0    // length of the buffer
    dataArray = null    // array for storing samples

    fftLength = 0       // length of the fft buffer
    fftDataArray = null // array for storing fft data

    sampleRate = 0      // sample rate
    channelCount = 0    // fft array channel count

    minDb = null        // input min db
    maxDb = null        // input max db

    init(analyzer) {
        this.analyzer = analyzer;
        this.bufferLength = this.analyzer.frequencyBinCount;
        this.dataArray = new Float32Array(this.bufferLength)
        this.channelCount = this.analyzer.channelCount
        this.fftLength = this.analyzer.fftSize / this.channelCount
        this.fftDataArray = new Float32Array(this.fftLength)
        this.sampleRate = this.analyzer.context.sampleRate
        this.minDb = this.analyzer.minDecibels
        this.maxDb = this.analyzer.maxDecibels
        return this
    }

    run() {
        if (this.analyzer != null) {
            this.analyzer.getFloatTimeDomainData(this.dataArray);
            this.analyzer.getFloatFrequencyData(this.fftDataArray);
        } else {
            console.error("Analyzer not initialized");
            return;
        }
    }
}

const getSamplesTask = new GetSamplesTask()
