/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

const ST_RadiosLists = 'RadiosLists'

class DataStore {

    constructor() {

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
}
