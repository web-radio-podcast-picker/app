/*
    Sound card Oscilloscope | Signal Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// page ui

page = {

    init() {
        $('#app_ver').text(settings.app.version)
        $('#app_ver_date').text(settings.app.verDate)
    }
}

document.addEventListener('DOMContentLoaded', function () {
    page.init()
}, false)