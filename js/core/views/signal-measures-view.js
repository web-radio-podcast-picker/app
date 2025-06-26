// signal measures view
class SignalMeasuresView {

    channel = null;     // channel number

    init(channel, signalMeasures) {
        this.signalMeasures = signalMeasures;
        this.channel = channel;
    }

    run() {
        // instant value
        const value = this.signalMeasures.value;
        const ival = document.querySelector('#ival_' + this.channel);
        ival.textContent = value;
    }
}
