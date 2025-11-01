/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

const Pdc_List_Lang = 'lang'
const Pdc_List_Tag = 'tag'
const Pdc_List_Letter = 'letter'
const Pdc_List_Pdc = 'pdc'
const Pdc_List_Epi = 'epi'

class Podcasts {

    /**
     * @type {Podcasts}
     */
    podcastsLists = null

    /**
     * @type {PodcastRSSParser}
     */
    rssParser = null

    indexInitialized = false
    onReadyFuncs = []

    listIdToTabId = {}
    initializedLists = {}
    initializingPodcasts = null

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
        epi: null,
        epiSubListId: null,
        epiOpen: false,
        epiOpening: false,
        noPage: 1,
    }

    previousListId = null

    langItems = []
    tagItems = []
    letterItems = []
    pdcItems = []
    epiItems = []

    constructor() {
        this.listIdToTabId[Pdc_List_Lang] = 'btn_wrp_podcast_lang'
        this.listIdToTabId[Pdc_List_Tag] = 'btn_wrp_podcast_tag'
        this.listIdToTabId[Pdc_List_Letter] = 'btn_wrp_podcast_alpha'
        this.listIdToTabId[Pdc_List_Pdc] = 'btn_wrp_podcast_pdc'
        this.listIdToTabId[Pdc_List_Epi] = 'btn_wrp_podcast_epi'      // npt a tab
        //this.listIdToTabId[Pdc_List_Epi] = 'wrp_radio_list_container'

        this.podcastsLists = new PodcastsLists(this)    // TODO: bad link practice (to be removed - not reproduce)
        this.rssParser = new PodcastRSSParser()

        $('#wrp_pdc_prv_em_button').on('click', (e) => {
            podcasts.selection.epiOpen = true
            this.podcastsLists.clickOpenEpiList(e)
        })

        const r = remoteDataStore.getPodcastsIndex(
            this.initPodcastIndex)
    }

    getListIdByTabId(tabId) {
        var res = null
        for (const listId in this.listIdToTabId) {
            const ltabId = this.listIdToTabId[listId]
            if (tabId == ltabId)
                res = listId
        }
        return res
    }

    initPodcastIndex(data) {
        const parser = new FlatIndexTextExportParser()
        podcasts.index = parser.parse(data)

        if (settings.debug.info)
            logger.log('podcast index initialized')
        if (settings.debug.debug)
            console.log(podcasts.index)

        //podcasts.langItems = podcasts.podcastsLists.buildLangItems(podcasts.index)
        podcasts.indexInitialized = true

        podcasts.onReadyFuncs.forEach(func => func())
        podcasts.onReadyFuncs = []
    }

    // TODO: case index never initialized: never call (case no network)
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
            case Pdc_List_Epi: return this.epiItems
        }
        return null
    }

    getSelectionById(listId) {
        switch (listId) {
            case Pdc_List_Lang: return this.selection.lang
            case Pdc_List_Tag: return this.selection.tag
            case Pdc_List_Letter: return this.selection.letter
            case Pdc_List_Pdc: return this.selection.pdc
            case Pdc_List_Epi: return this.selection.epi
        }
        return null
    }

    updateInitializedStatusFromSelection() {
        const s = this.selection
        if (s.tag == null)
            this.initializedLists[Pdc_List_Tag] = false
        if (s.letter == null)
            this.initializedLists[Pdc_List_Letter] = false
        if (s.pdc == null)
            this.initializedLists[Pdc_List_Pdc] = false
        if (s.epi == null)
            this.initializedLists[Pdc_List_Epi] = false
        return this
    }

    resetSelectionsById(listId) {
        const s = this.selection
        switch (listId) {
            case Pdc_List_Lang:
                s.tag = s.letter = s.pdc = null
                break
            case Pdc_List_Tag:
                s.letter = s.pdc = null
                break
            case Pdc_List_Letter:
                s.pdc = null
                break
            case Pdc_List_Pdc:
                // TODO: ok after startup, no good at startup (current lost)
                s.epi = null
                break
            case Pdc_List_Epi:
                //s.epi = null
                break
        }
        this.updateInitializedStatusFromSelection()
        return this
    }

    getMoreFocusableListId() {
        const selection = this.selection
        const slistId =
            /*(selection.epi != null ? Pdc_List_Epi : null)
            || */(selection.pdc != null ? Pdc_List_Pdc : null)
            || (selection.letter != null ? Pdc_List_Letter : null)
            || (selection.tag != null ? Pdc_List_Tag : null)
            || (selection.lang != null ? Pdc_List_Lang : null)
            || Pdc_List_Lang
        return slistId
    }

    updateSelectionSubListsIds(selection) {
        selection.langSubListId = selection.lang == null ? null
            : this.podcastsLists.getSubListId(selection, Pdc_List_Lang)
        selection.tagSubListId = selection.tag == null ? null
            : this.podcastsLists.getSubListId(selection, Pdc_List_Tag)
        selection.letterSubListId = selection.letter == null ? null
            : this.podcastsLists.getSubListId(selection, Pdc_List_Letter)
        selection.pdcSubListId = selection.pdc == null ? null
            : this.podcastsLists.getSubListId(selection, Pdc_List_Pdc)
        selection.epiSubListId = selection.epi == null ? null
            : this.podcastsLists.getSubListId(selection, Pdc_List_Epi)
        return this
    }

    selectTab(selection, targetListId) {

        if (settings.debug.debug)
            console.log('targetListId= ' + targetListId + 'selection= ' + selection)

        this.onReady(() => {
            // find available tabs

            this.updateSelectionSubListsIds(selection)

            if (settings.debug.debug)
                console.log(selection)

            // get availables lists
            this.availableLists = []

            this.availableLists.push(Pdc_List_Lang)   // put the default

            if (selection.langSubListId != null)
                this.availableLists.push(selection.langSubListId)

            if (selection.tagSubListId != null)
                this.availableLists.push(selection.tagSubListId)

            if (selection.letterSubListId != null)
                this.availableLists.push(selection.letterSubListId)

            if (selection.pdcSubListId != null)
                this.availableLists.push(selection.pdcSubListId)

            if (selection.epiSubListId != null)
                this.availableLists.push(selection.epiSubListId)

            var slistId = this.getMoreFocusableListId()

            if (targetListId !== undefined && targetListId != null)
                slistId = targetListId

            var initTabDone = false

            this.availableLists.forEach(listId => {

                if (settings.debug.debug)
                    logger.log('add pdc list: ' + listId)

                if (!this.initializedLists[listId]) {

                    this.onReady(() => {
                        if (slistId == listId) {
                            this.initializedLists[listId] = true
                            // only if visible
                            // build items
                            const isBuildAsync = this.podcastsLists.buildItems(listId)
                            if (!isBuildAsync) {
                                // load and init listId view
                                this.podcastsLists.updateListView(listId)
                            } else initTabDone = true
                        }
                    })
                }
            })

            if (!initTabDone) {
                this.initTabs(slistId)
            }
        })
    }

    asyncInitTab(slistId) {
        //var slistId = this.getMoreFocusableListId()
        this.initTabs(slistId, true)
        const item = this.getSelectionById(slistId)?.item

        if (item != null) {
            const paneId = this.podcastsLists.listIdToPaneId[slistId]
            const $item = this.podcastsLists.findListItemInView(paneId, item)
            if ($item.length > 0 && !$item.hasClass('item-selected'))
                this.podcastsLists.selectItem(slistId, item)
        }
    }

    initTabs(slistId, skipSelectItem) {
        const self = podcasts
        const selection = self.selection

        ui.tabs
            .setTabVisiblity(self.listIdToTabId[Pdc_List_Tag],
                selection.langSubListId != null)
            .setTabVisiblity(self.listIdToTabId[Pdc_List_Letter],
                selection.tagSubListId == Pdc_List_Letter)
            .setTabVisiblity(self.listIdToTabId[Pdc_List_Pdc],
                selection.tagSubListId == Pdc_List_Pdc
                || selection.letterSubListId == Pdc_List_Pdc)
            // no need
            .setTabVisiblity(self.listIdToTabId[Pdc_List_Epi],
                false) //selection.pdcSubListId == Pdc_List_Epi)


        // select current tab & item

        const slist = self.getListById(slistId)
        const sel = self.getSelectionById(slistId)
        const sitem = sel?.item

        logger.log('select podcast tab: ' + slistId)

        ui.tabs.selectTab(
            self.listIdToTabId[slistId],
            tabsController.pdcTabs)

        if (this.previousListId != slistId)
            if (sitem != null) {
                if (settings.debug.debug)
                    logger.log('select item: ' + sitem?.name)
                self.podcastsLists.selectItem(slistId, sitem)
            } else {
                // default scroll top
                const $pp = this.podcastsLists.$getPanel(slistId).parent()
                $pp[0].scrollTop = 0
            }

        this.previousListId = slistId

        this.setEpiListVisible(slistId == Pdc_List_Epi
            || this.shouldRestoreEpiVisibleState)

        if (infosPane.isVisibleInfosPane())
            // hide preview if infos pane is opened
            infosPane.toggleInfos()

        if (skipSelectItem !== true) {            // if must show prv
            if (slistId == Pdc_List_Pdc) {
                this.setPdcPreviewVisible(true)
            }
        }
        this.setEpiListMediaVisible(slistId == Pdc_List_Epi)

        if (tabsController.openingVizWithEpiListVisible === true)
            $('#btn_wrp_podcast_pdc')
                .removeClass('selected')

        this.initializingPodcasts--
        if (settings.debug.debug)
            console.log('initializingPodcasts = ' + this.initializingPodcasts + ' -- ' + this.selection.epiOpen)
        settings.dataStore.saveUIState()
    }

    // restore from ui state
    openPodcasts(selection) {
        if (this.initializingPodcasts == null)
            this.initializingPodcasts = 1
        if (selection === undefined || selection == null)
            selection = this.selection
        this.selectTab(selection)
    }

    backPdcPreviewItem = null
    back$pdcPreviewItem = null

    // pdc channel rss & show pdc preview
    openPdcPreview(item, $item) {

        if (settings.debug.debug) {
            logger.log('open pdc preview: ' + item.name + ' | ' + item.url)
            console.log(item)
        }

        ui.hideError()
        item.metadata.statusText = 'opening...'
        radsItems.updateRadItemView(item, $item)

        this.backPdcPreviewItem = this.podcastsLists.pdcPreviewItem
        this.back$pdcPreviewItem = this.podcastsLists.$pdcPreviewItem

        // TODO: avoid ops after receipt if other request started after this one
        remoteDataStore.getPodcastChannelRss(
            item.url,
            data => this.buildPdcPreview(item, $item, data),
            (err, response) => this.openPdcPreviewError(item, $item, err, response)
        )
    }

    openPdcPreviewError(item, $item, err, response) {
        this.podcastsLists.pdcPreviewItem = this.backPdcPreviewItem
        this.podcastsLists.$pdcPreviewItem = this.back$pdcPreviewItem
        const text = 'channel not found'
        ui.showError(text)
        item.metadata.statusText = text
        radsItems.updateRadItemView(item, $item)
    }

    isPdcPreviewVisible() {
        return !$('#wrp_pdc_btn_bar').hasClass('hidden')
    }

    setPdcPreviewVisible(isVisible, skipTogglePath) {
        if (isVisible && !this.previewInitizalized)
            return
        if (isVisible) {
            if (skipTogglePath !== true) {
                $('#wrp_pdc_btn_bar').removeClass('hidden')
                $('#wrp_radio_list_btn_bar').addClass('hidden')
            }
            $('#wrp_radio_list_container').addClass('hidden')
            $('#wrp_pdc_st_list_container').removeClass('hidden')

            if (!this.shouldRestoreEpiVisibleState)
                this.setEpiListVisible(false)
            else
                this.setEpiListVisible(true)

        } else {
            this.podcastsLists.pdcPreviewItem =
                this.podcastsLists.$pdcPreviewItem = null

            if (skipTogglePath !== true) {
                $('#wrp_pdc_btn_bar').addClass('hidden')
                $('#wrp_radio_list_btn_bar').removeClass('hidden')
            }
            $('#wrp_radio_list_container').removeClass('hidden')
            $('#wrp_pdc_st_list_container').addClass('hidden')
            // reset click count
            if (this.selection.pdc)
                this.selection.pdc.selCnt = 0
        }
    }

    setEpiListMediaVisible(isVisible) {
        if (isVisible) {
            $('#opts_wrp_podcast_epi_media').removeClass('hidden')
        } else {
            $('#opts_wrp_podcast_epi_media').addClass('hidden')
        }
    }

    shouldRestoreEpiVisibleState = false

    setEpiListVisible(isVisible) {

        //if (!this.podcastsLists.isOpenPdcFromTabSelect)
        this.shouldRestoreEpiVisibleState = isVisible

        if (isVisible) {
            $('#wrp_pdc_epi_list_container').removeClass('hidden')
            this.epiHideStListContainer = true
            $('#wrp_pdc_st_list_container').addClass('hidden')

            $('#opts_wrp_podcast_epi').removeClass('hidden')

        } else {
            $('#wrp_pdc_epi_list_container').addClass('hidden')
            if (this.epiHideStListContainer) {
                //$('#wrp_pdc_st_list_container').removeClass('hidden')
                this.epiHideStListContainer = false
            }

            $('#opts_wrp_podcast_epi').addClass('hidden')
        }
        this.setEpiListMediaVisible(isVisible)

        if (settings.debug.debug)
            console.log('setEpiListVisible= ' + isVisible + ' -- initializingPodcasts= ' + this.initializingPodcasts)

        if (!isVisible && this.initializingPodcasts < -2) {
            this.selection.epiOpen = false
            settings.dataStore.saveUIState()
        }
    }

    isPdcVisible() {
        return this.isEpiListVisible() ||
            this.isPdcPreviewVisible()
    }

    isEpiListVisible() {
        return !$('#wrp_pdc_epi_list_container').hasClass('hidden')
    }

    buildEpiMediaView(item) {

        // TODO: use a rdMediaImage
        const img = item.rss.image || item.rss.itunes.image

        $('#wrp_pdc_epim_img')[0].src = img == null ?
            transparentPixel        // TODO: this have councerns: image resetted, never reinitialized
            : img

        const title = $('#wrp_pdc_prv_name').html()
        $('#wrp_pdc_epim_name').html(title)
        $('#wrp_pdc_epim_desc').addClass('hidden')

        this.selection.epiOpen = true
        //this.selection.epiOpening = false
        settings.dataStore.saveUIState()
    }

    // build pdc preview
    buildPdcPreview(item, $item, data) {
        this.podcastsLists.pdcPreviewItem =
            this.podcastsLists.$pdcPreviewItem = null

        ui.hideError()
        item.metadata.statusText = ''
        radsItems.updateRadItemView(item, $item)

        item.selCnt++   // only if preview is ok

        // update the top path bar
        radListBuilder.pathBuilder.buildPdcTopPath(item, $item)

        // get rss datas
        const o = this.rssParser.parse(data)
        item.rss = o

        if (settings.debug.debug)
            window.rss = o

        this.populatePdcPreview(item, $item, o)

        if (infosPane.isVisibleInfosPane())
            // hide preview if infos pane is opened
            infosPane.toggleInfos()

        if (!this.isEpiListVisible()) {
            this.setPdcPreviewVisible(true)
            if (this.selection.epiOpen && this.buildPdcPreviewCount < 1) {
                //this.selection.epiOpening = true

                // case on start

                if (settings.debug.debug)
                    logger.log('opening epi list')

                this.autoOpenedEpiList = true
                $('#wrp_pdc_prv_em_button').click()
            }
        }

        this.buildPdcPreviewCount++
    }

    buildPdcPreviewCount = 0

    populatePdcPreview(item, $item, o) {

        $('#wrp_pdc_st_list')[0].scrollTop = 0

        // bg image
        const $bgImg = $('#wrp_pdc_prv_img')

        const img = o.image || o.itunes.image

        if (img) {
            // immediately hide image before other loads
            $bgImg.addClass('ptransparent')
            $bgImg[0].src = img
        }
        else
            pdcPrvImage.noImage()

        var author = (o.itunes.author || o.copyright)?.trim()
        var title = o.title
        const finalAuthor = author
        if (author != null && author != '') {
            author = '<div class="wrp_pdc_prv_author_text">' + author + '</div>'
            title += author
        }

        const t = [
            // target id, js path
            ['name', 'title'],
            ['desc', 'o.description'],
            ['author', 'author']
        ]

        t.forEach(d => {
            const targetId = 'wrp_pdc_prv_' + d[0]
            const $e = $('#' + targetId)
            var txt = eval(d[1])
            $e.html(txt)
        })

        $('#wrp_pdc_prv_em_button')
            .text(o.episodes.length + ' episode'
                + (o.episodes.length > 1 ? 's' : '')
            )

        // update item with new datas
        item.qty = o.episodes.length
        if (finalAuthor != null && finalAuthor != '')
            item.subText = finalAuthor
        radsItems.updateRadItemView(item, $item,
            {
                countFunc: item => item.qty
            }
        )

        this.previewInitizalized = true
        //this.setPdcPreviewVisible(true)
        //this.setEpiListVisible(false)

        //// prevent first switch to view visible when not initialized
        ////$('#wrp_pdc_st_list').removeClass('ptransparent')
    }

}
