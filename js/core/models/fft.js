/*
    Sound card Oscilloscope | Signal Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// FFT

class FFT {

    channel
    vScale          /* vertical linear scale */
    vScaleFactor    /* vertical linear scale factor */
    hScale          /* horizontal linear scale (1: full bandwidth)*/
    minDb           /* min db reference */
    maxDb           /* max db reference */
    position        /* view position (half bottom,full,..) */
    displayGrid     /* display fft grid (auto if true) or not (false) */
    color           /* fft main color */
    lineWidth       /* stroke width */
    grid            /* grid properties */
    isDisplayed     /* true if displayed */

    constructor() {
        this.vScale = settings.fft.vScale
        this.hScale = settings.fft.hScale
    }

    init(channel) {
        this.channel = channel
        this.displayGrid = true
        this.position = Half_Bottom
        this.minDb = channel.analyzer.minDecibels
        this.maxDb = channel.analyzer.maxDecibels
        this.vScale = settings.fft.vScale
        this.vScaleFactor = settings.fft.vScaleFactor
        this.hScale = settings.fft.hScale
        this.color = channel.color
        this.lineWidth = settings.fft.stroke.lineWidth
        this.grid = { ...settings.fft.grid }
        this.grid.color = channel.color
        this.isDisplayed = false
    }

    hasSameScaleH(fft) {
        return this.hScale == fft.hScale
    }

    hasSameScaleV(fft) {
        return this.vScale == fft.vScale
            && this.vScaleFactor == fft.vScaleFactor
    }

    toScaleHSignature() {
        const sep = '-'
        return this.hScale + sep
    }

    toScaleVSignature() {
        const sep = '-'
        return this.vScale + sep + this.vScaleFactor
    }
}
