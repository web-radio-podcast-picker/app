/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

const ST_RadiosLists = 'RadiosLists'
const ST_UIState = 'UIState'

class DataStore {

    constructor() {

    }

    saveAll() {
        this.saveRadiosLists()
        this.saveUIState()
    }

    loadRadiosLists() {
        if (localStorage === undefined) return
        const str = localStorage.getItem(ST_RadiosLists)
        if (str == null) {
            this.saveRadiosLists()
            return
        }
        wrpp.radiosLists.fromJSON(str)
    }

    saveRadiosLists() {
        if (localStorage === undefined) return
        const str = wrpp.radiosLists.toJSON()
        localStorage.setItem(ST_RadiosLists, str)
    }

    initUIStateStorage(initFunc) {
        if (localStorage === undefined) return
        const str = localStorage.getItem(ST_UIState)
        if (str != null) return false // storage exists. do nothing
        initFunc()
        return true
    }

    loadUIState() {
        if (localStorage === undefined) return
        const str = localStorage.getItem(ST_UIState)
        if (str == null) {
            this.saveUIState()
            return
        }
        wrpp.uiState.fromJSON(str)
    }

    saveUIState() {
        if (localStorage === undefined) return
        const str = wrpp.uiState.toJSON()
        localStorage.setItem(ST_UIState, str)
    }
}
