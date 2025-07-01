// signal measures
class SignalMeasures {

    value = null;               // input value              (-1..1)

    volts = 0;                  // volts value (calculated from digitalized value)
    vMin = Number.MAX_VALUE;    // minimum volts value
    vMax = Number.MIN_VALUE;    // maximum volts value
    vAvg = 0;                   // average volts value

    dataArray = null;           // array of samples datas   (-1..1)

    // set input value
    setValue(channel, value) {
        this.value = value;
        this.volts = valueToVolt(channel, value);
    }

    // set measures from input value
    setMeasures(channel, min, max, avg) {
        this.vMin = valueToVolt(channel, min);
        this.vMax = valueToVolt(channel, max);
        this.vAvg = valueToVolt(channel, avg);
    }

    setData(data) {
        this.dataArray = data;
    }

}