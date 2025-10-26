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
        langSubListId: null,
        tag: null,
        tagSubListId: null,
        letter: null,
        letterSubListId: null,
        pdc: null,
        pdcSubListId: null,
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

        podcasts.langItems = podcasts.podcastsLists.buildLangItems(podcasts.index)
        podcasts.indexInitialized = true

        podcasts.onReadyFuncs.forEach(func => func())
        podcasts.onReadyFuncs = []
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

    getMoreFocusableListId() {
        const selection = this.selection
        const slistId =
            // TODO: add pdc sub list
            (selection.pdc != null ? Pdc_List_Pdc : null)
            || (selection.letter != null ? Pdc_List_Letter : null)
            || (selection.tag != null ? Pdc_List_Tag : null)
            || (selection.lang != null ? Pdc_List_Lang : null)
        return slistId
    }

    selectTab(selection) {
        this.availableLists = []

        this.onReady(() => {
            // find available tabs

            selection.langSubListId = selection.lang == null ? null
                : this.podcastsLists.getSubListId(selection, Pdc_List_Lang)
            selection.tagSubListId = selection.tag == null ? null
                : this.podcastsLists.getSubListId(selection, Pdc_List_Tag)
            selection.letterSubListId = selection.letter == null ? null
                : this.podcastsLists.getSubListId(selection, Pdc_List_Letter)
            // TODO: sub list of pdc
            selection.pdcSubListId = selection.pdc == null ? null
                : this.podcastsLists.getSubListId(selection, Pdc_List_Pdc)

            console.log(selection)

            // get availables lists

            this.availableLists.push(Pdc_List_Lang)   // put the default

            if (selection.langSubListId != null)
                this.availableLists.push(selection.langSubListId)

            if (selection.tagSubListId != null)
                this.availableLists.push(selection.tagSubListId)

            if (selection.letterSubListId != null)
                this.availableLists.push(selection.letterSubListId)

            if (selection.pdcSubListId != null)
                this.availableLists.push(selection.pdcSubListId)


            this.availableLists.forEach(listId => {

                logger.log('add pdc list: ' + listId)

                if (!this.initializedLists[listId])
                    // load and init listId view
                    this.onReady(() => this.podcastsLists.updateListView(listId))
            })

            //this.onReady(() => this.initTabs())
            this.initTabs()
        })
    }

    initTabs() {
        const self = podcasts
        const selection = self.selection

        const slistId = self.getMoreFocusableListId()

        ui.tabs
            .setTabVisiblity(self.listIdToTabId[Pdc_List_Tag],
                selection.langSubListId != null)
            .setTabVisiblity(self.listIdToTabId[Pdc_List_Letter],
                selection.tagSubListId == Pdc_List_Lang)
            .setTabVisiblity(self.listIdToTabId[Pdc_List_Pdc],
                selection.tagSubListId == Pdc_List_Pdc
                || selection.langSubListId == Pdc_List_Pdc)

        // select current tab & item

        const slist = self.getListById(slistId)
        const sel = self.getSelectionById(slistId)
        const sitem = sel?.item

        logger.log('select podcast tab: ' + slistId)

        ui.tabs.selectTab(
            self.listIdToTabId[slistId],
            tabsController.pdcTabs)

        if (sitem != null)
            self.podcastsLists.selectItem(slistId, sitem)
    }

    openPodcasts(selection) {
        if (selection === undefined || selection == null)
            selection = this.selection
        this.selectTab(selection)
    }
}
