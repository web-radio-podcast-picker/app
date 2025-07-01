// signal measures
class SignalMeasures {

    value = null;               // digitalized value

    volts = 0;                  // volts value (calculated from digitalized value)
    vMin = Number.MAX_VALUE;    // minimum volts value
    vMax = Number.MIN_VALUE;    // maximum volts value
    vAvg = null;                // average volts value

    dataArray = null;           // array of samples datas

    // set digital value
    setValue(channel, value) {
        this.value = value;
        this.volts = valueToVolt(channel, value) * channel.vScale;
        if (this.volts < this.vMin)
            this.vMin = this.volts;
        if (this.volts > this.vMax)
            this.vMax = this.volts;
        if (this.vAvg == null)
            this.vAvg = this.volts;
        else
            this.vAvg = (this.vAvg + this.volts) / 2.0; // calculate average
    }

    setData(data) {
        this.dataArray = data;
    }

}