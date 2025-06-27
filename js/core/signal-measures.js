// signal measures
class SignalMeasures {

    value = null;               // digitalized value

    volts = 0;                  // volts value (calculated from digitalized value)
    vMin = Number.MAX_VALUE;    // minimum volts value
    vMax = Number.MIN_VALUE;    // maximum volts value

    // set digital value
    setValue(channel, value) {
        this.value = value;
        this.volts = (value - 128) * channel.vScale / 128.0; // convert to volts
        if (this.volts < this.vMin)
            this.vMin = this.volts;
        if (this.volts > this.vMax)
            this.vMax = this.volts;
    }
}