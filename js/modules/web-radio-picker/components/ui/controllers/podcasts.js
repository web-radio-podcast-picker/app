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

    indexInitialized = false
    onReadyFuncs = []

    listIdToTabId = {}
    initializedLists = {}

    // selection values
    selection = {
        lang: null,
        tag: null,
        letter: null,
        list: null,
        noPage: 1,
    }

    langItems = []

    constructor() {
        this.listIdToTabId[Pdc_List_Lang] = 'btn_wrp_podcast_lang'
        this.listIdToTabId[Pdc_List_Tag] = 'btn_wrp_podcast_tag'
        this.listIdToTabId[Pdc_List_Letter] = 'btn_wrp_podcast_alpha'
        this.listIdToTabId[Pdc_List_Pdc] = 'btn_wrp_podcast_pdc'

        const r = remoteDataStore.getPodcastsIndex(
            this.initPodcastIndex)
    }

    initPodcastIndex(data) {
        const parser = new FlatIndexTextExportParser()
        podcasts.index = parser.parse(data)
        logger.log('podcast index initialized')
        console.log(podcasts.index)
        podcasts.buildLangItems()
        podcasts.indexInitialized = true

        podcasts.onReadyFuncs.forEach(func => func())
    }

    buildLangItems() {
        this.langItems = []
        this.index.props.langs.forEach(lang => {
            const langItem = {
                code: lang.code,
                name: lang.name
            }
            this.langItems[lang.name] = langItem
        })
    }

    updateListView(listId) {
        logger.log('update list view: ' + listId)
        const containerId = 'opts_wrp_podcast'
        const $pl = $('#' + containerId)
        $pl[0].innerHTML = ''

        switch (listId) {
            case Pdc_List_Lang:
                listsBuilder.buildNamesItems(
                    containerId,
                    this.langItems,
                    RadioList_Podcast,
                    this.openLang
                )
                break;
            default:
                break;
        }

        this.initializedLists[listId] = true
    }

    openLang(e) {

    }

    onReady(func) {
        if (this.indexInitialized) func()
        else
            this.onReadyFuncs.push(func)
    }

    selectTab(selection) {
        var listId = Pdc_List_Lang  // default

        if (selection.lang != null)
            listId = Pdc_List_Lang

        if (selection.tag != null)
            listId = Pdc_List_Tag

        if (selection.letter != null)
            listId = Pdc_List_Letter

        if (selection.list != null)
            listId = Pdc_List_Lang

        ui.tabs
            .setTabVisiblity(this.listIdToTabId[Pdc_List_Tag],
                selection.tag != null)
            .setTabVisiblity(this.listIdToTabId[Pdc_List_Letter],
                selection.letter != null)
            .setTabVisiblity(this.listIdToTabId[Pdc_List_Pdc],
                selection.list != null)

        logger.log('select podcast tab: ' + listId)

        ui.tabs.selectTab(
            this.listIdToTabId[listId],
            tabsController.pdcTabs)

        if (!this.initializedLists[listId])
            this.onReady(() => this.updateListView(listId))
    }

    openPodcasts(selection) {
        if (selection === undefined || selection == null)
            selection = this.selection
        this.selectTab(selection)
    }
}
