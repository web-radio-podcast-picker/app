// signal generator

class Generator {

    channel = null      // related channel
    oscillator = null   // oscillator

    init(channel, oscillator) {
        this.oscillator = oscillator
        this.channel = channel
        this.oscillator.connect(channel.analyzer);
    }

    start() {
        if (this.oscillator != null)
            this.oscillator.start(0)
    }

    stop() {
        if (this.oscillator != null)
            this.oscillator.stop(0)
    }
}