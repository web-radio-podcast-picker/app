// signal measures
class SignalMeasures {

    value = null;               // digitalized value

    volts = 0;                  // volts value (calculated from digitalized value)
    vMin = Number.MAX_VALUE;    // minimum volts value
    vMax = Number.MIN_VALUE;    // maximum volts value
    vAvg = null;                // average volts value

    // set digital value
    setValue(channel, value) {
        this.value = value;
        this.volts = this.valueToVolt(channel, value);
        if (this.volts < this.vMin)
            this.vMin = this.volts;
        if (this.volts > this.vMax)
            this.vMax = this.volts;
        if (this.vAvg == null)
            this.vAvg = this.volts;
        else
            this.vAvg = (this.vAvg + this.volts) / 2.0; // calculate average
    }

    valueToVolt(channel, value) {
        return (value - 128) * channel.vScale / 128.0; // convert to volts
    }
}