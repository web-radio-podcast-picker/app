/*
    Sound card Oscilloscope | Spectrum Analyzer | Signal Generator
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// iframe ui

iframe = {

    init() {

    },

    checkIFrame() {
        const urlParams = new URLSearchParams(window.location.search)
        const embed = urlParams.get('embed')
        console.log(window.location.href + ' :: embed=', embed)
        if (embed != 'true') {
            // change location to iframe parent index
            const s = window.location.href
            var t = s.split('/')
            t[t.length - 2] = 'index.html'
            t = t.slice(0, t.length - 1)
            const u = t.join('/')
            window.location = u
        }
    },
}

iframe.checkIFrame()

document.addEventListener('DOMContentLoaded', function () {
    iframe.init()
}, false)
