/*
    Sound card Oscilloscope | Spectrum Analyzer | Signal Generator
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// module: web radio picker

class WebRadioPickerModule extends ModuleBase {

    // module spec
    id = 'web_radio_picker'         // unique id
    author = 'franck gaspoz'        // author
    cert = null                     // certification if any

    views = ['view.html']           // module views
    settings = ['settings.js']      // module settings
    datas = ['all_stations.m3u']    // module data files

    title = 'Web Radio Picker'
    icon = '☄'

    init() {
        const mset = settings.modules.web_radio_picker
        const dataUrl = mset.dataUrl
    }

    setData(dataId, text) {

    }

    parseM3U() {
    }
}