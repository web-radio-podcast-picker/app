/*
    Sound card Oscilloscope | Signal Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// FFT

class FFT {

    channel
    vScale          /* vertical linear scale */
    hScale          /* horizontal linear scale (1: full bandwidth)*/
    minDb           /* min db reference */
    maxDb           /* max db reference */
    position        /* view position (half bottom,full,..) */
    displayGrid     /* display fft grid (auto if true) or not (false) */
    color           /* fft main color */
    lineWidth       /* stroke width */
    grid            /* grid properties */
    isDisplayed     /* true if displayed */

    init(channel) {
        this.channel = channel
        this.displayGrid = true
        this.position = 'half bottom'
        this.minDb = channel.analyzer.minDecibels
        this.maxDb = channel.analyzer.maxDecibels
        this.vScale = settings.fft.vScale
        this.hScale = settings.fft.hScale
        this.color = channel.color
        this.lineWidth = settings.fft.stroke.lineWidth
        this.grid = { ...settings.fft.grid }
        this.grid.color = channel.color
        this.isDisplayed = false
    }
}
