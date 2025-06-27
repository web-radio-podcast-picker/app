// signal measures view
class SignalMeasuresView {

    channel = null;     // channel number

    init(channel, signalMeasures) {
        this.signalMeasures = signalMeasures;
        this.channel = channel;
    }

    run() {
        // instant value
        const ival = document.querySelector('#ival_' + this.channel);
        ival.textContent = this.signalMeasures.value;
        $('#iv_' + this.channel).text(this.signalMeasures.volts);
        $('#ivmin_' + this.channel).text(this.signalMeasures.vMin);
        $('#ivmax_' + this.channel).text(this.signalMeasures.vMax);
    }
}
