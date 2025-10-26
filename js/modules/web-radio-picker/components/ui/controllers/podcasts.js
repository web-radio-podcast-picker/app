/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

const Pdc_List_Lang = 'lang'
const Pdc_List_Tag = 'tag'
const Pdc_List_Letter = 'letter'
const Pdc_List_Pdc = 'pdc'

class Podcasts {

    listIdToTabId = {}

    selection = {
        lang: Pdc_List_Lang,
        tag: null,
        letter: null,
        list: null,
        noPage: 1,
    }

    constructor() {
        this.listIdToTabId[Pdc_List_Lang] = 'btn_wrp_podcast_lang'
        this.listIdToTabId[Pdc_List_Tag] = 'btn_wrp_podcast_tag'
        this.listIdToTabId[Pdc_List_Letter] = 'btn_wrp_podcast_alpha'
        this.listIdToTabId[Pdc_List_Pdc] = 'btn_wrp_podcast_pdc'
    }

    selectTab(selection) {
        var listId = null
        if (selection.lang != null)
            listId = Pdc_List_Lang
        if (selection.tag != null)
            listId = Pdc_List_Tag
        if (selection.letter != null)
            listId = Pdc_List_Letter
        if (selection.list != null)
            listId = Pdc_List_Lang
        ui.tabs.selectTab(
            this.listIdToTabId[listId],
            tabsController.pdcTabs)
    }

    openPodcasts(selection) {
        if (selection === undefined || selection == null)
            selection = this.selection
        this.selectTab(selection)
    }

    toJSON(applyFormat) {
        return !applyFormat ? JSON.stringify(this.selection)
            : JSON.stringify(this.selection, null, 2)
    }

    fromJSON(str) {
        this.selection = JSON.parse(str)
    }
}
