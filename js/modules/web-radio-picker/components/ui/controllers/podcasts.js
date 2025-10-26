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

    /**
     * @type {Podcasts}
     */
    podcastsLists = null

    indexInitialized = false
    onReadyFuncs = []

    listIdToTabId = {}
    initializedLists = {}

    // selection values
    selection = {
        lang: null,
        tag: null,
        letter: null,
        pdc: null,
        noPage: 1,
    }

    langItems = []
    tagItems = []
    letterItems = []
    pdcItems = []

    constructor() {
        this.listIdToTabId[Pdc_List_Lang] = 'btn_wrp_podcast_lang'
        this.listIdToTabId[Pdc_List_Tag] = 'btn_wrp_podcast_tag'
        this.listIdToTabId[Pdc_List_Letter] = 'btn_wrp_podcast_alpha'
        this.listIdToTabId[Pdc_List_Pdc] = 'btn_wrp_podcast_pdc'

        this.podcastsLists = new PodcastsLists(this)

        const r = remoteDataStore.getPodcastsIndex(
            this.initPodcastIndex)
    }

    initPodcastIndex(data) {
        const parser = new FlatIndexTextExportParser()
        podcasts.index = parser.parse(data)

        if (settings.debug.info)
            logger.log('podcast index initialized')
        if (settings.debug.debug)
            console.log(podcasts.index)

        podcasts.buildLangItems()
        podcasts.indexInitialized = true

        podcasts.onReadyFuncs.forEach(func => func())
        podcasts.onReadyFuncs = []
    }

    // podcast item model
    podcastItem(code, name, qty, favorites) {
        const o = {
            code: code,
            name: name,
            qty: qty,
        }
        if (favorites)
            o.favLists = favorites
        return o
    }

    buildLangItems() {
        this.langItems = []
        this.index.props.langs.forEach(lang => {
            const langItem =
                this.podcastItem(
                    lang.code,
                    lang.name,
                    lang.count
                )
            this.langItems[lang.name] = langItem
        })
    }

    buildLettersItems() {

    }

    buildTagsItems() {

    }

    onReady(func) {
        if (this.indexInitialized) func()
        else
            this.onReadyFuncs.push(func)
    }

    getListById(listId) {
        switch (listId) {
            case Pdc_List_Lang: return this.langItems
            case Pdc_List_Tag: return this.tagItems
            case Pdc_List_Letter: return this.letterItems
            case Pdc_List_Pdc: return this.pdcItems
        }
        return null
    }

    getSelectionById(listId) {
        switch (listId) {
            case Pdc_List_Lang: return this.selection.lang
            case Pdc_List_Tag: return this.selection.tag
            case Pdc_List_Letter: return this.selection.letter
            case Pdc_List_Pdc: return this.selection.pdc
        }
        return null
    }

    selectTab(selection) {
        // current list id
        var clistId = Pdc_List_Lang  // default

        if (selection.lang != null)
            clistId = Pdc_List_Lang

        if (selection.tag != null)
            clistId = Pdc_List_Tag

        if (selection.letter != null)
            clistId = Pdc_List_Letter

        if (selection.pdc != null)
            clistId = Pdc_List_Lang

        if (!this.initializedLists[clistId])
            this.onReady(() => this.podcastsLists.updateListView(clistId))

        this.onReady(() => {

            // current list
            const list = this.getListById(clistId)

            // selected list id
            var slistId = clistId
            // selected item
            var cItem = this.getSelectionById(clistId)

            ui.tabs
                .setTabVisiblity(this.listIdToTabId[Pdc_List_Tag],
                    selection.tag != null)
                .setTabVisiblity(this.listIdToTabId[Pdc_List_Letter],
                    selection.letter != null)
                .setTabVisiblity(this.listIdToTabId[Pdc_List_Pdc],
                    selection.list != null)

            logger.log('select podcast tab: ' + clistId)

            ui.tabs.selectTab(
                this.listIdToTabId[slistId],
                tabsController.pdcTabs)

            if (cItem != null) {
                // restore selection
                this.podcastsLists.selectItem(clistId, cItem)
            }
        })
    }



    openPodcasts(selection) {
        if (selection === undefined || selection == null)
            selection = this.selection
        this.selectTab(selection)
    }
}
