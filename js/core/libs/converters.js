// converters functions

function vround7(v) {
    return parseFloat(v.toFixed(7));
}

function vround(v) {
    return parseFloat(v.toFixed(5));
}

function tround(t) {
    return parseFloat(t.toFixed(3));
}

function milli(n) {
    return n * 1000;
}

// -1..1 -> 0..256
function float32ToByteRange(channel, f) {
    const v = valueToVolt(channel, f);
    return v * 128 / settings.audioInput.vScale + 128;
}

// normalize to -1 ... 1 ? (input calibration. 255 <=> x Volts)
function float32ToVolt(f) {
    //return f; // -1 .. 1 ?
    return f / 1.5;     // -1.5 .. 1.5 ?
}
function voltToText(v) {
    if (v == null || v == undefined || isNaN(v)) return Number.NaN;
    const z = vround(v);
    return z;
}

function valueToVolt(channel, value) {
    return float32ToVolt(value) * settings.audioInput.vScale;
}

