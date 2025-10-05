/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

const WRP_Radio_List = 'all_stations.m3u'
const WRP_Json_Radio_List = 'radios.txt'
const WRP_Unknown_Group_Label = 'unclassified'
const WRP_Artists_Group_Label = 'artists'

const Sep = '|'
const List_Sep = ','
const Line_Sep = '\n'
const Bloc_Sep = '---------- ----------'

const Build_Json_Radio_List = false

// module: web radio picker

class WebRadioPickerModule extends ModuleBase {

    //#region ----- module spec ----->

    id = 'web_radio_picker'         // unique id
    author = 'franck gaspoz'        // author
    cert = null                     // certification if any

    views = [                       // module views & styles
        [
            'view.html',            // empty view (real is preloaded in index.html)
            // (any view is necessary to comply to the module loader)
            null                    // idem for the style
        ]
    ]
    settings = [
        'settings.json'             // module settings
    ]
    datas = null                    // module data files

    title = 'Web Radio Picker'
    icon = '☄'

    //#endregion

    //#region attributes

    items = []              // all items by group name
    itemsByArtists = []     // item with artist by artist name
    itemsByName = []        // all items by name
    itemsByLang = []        // items by lang (those having one)
    itemsAll = []           // all items
    listCount = 0
    filteredListCount = 0

    resizeEventInitialized = false
    // pre-processed data
    groupsById = {}
    itemsById = {}

    // components

    radsItems = new RadsItems().init(this)
    mediaImage = new MediaImage().init(this)
    listsBuilder = new ListsBuilder().init(this)
    history = new History().init(this)
    favorites = new Favorites().init(this)
    playEventsHandlers = new PlayEventsHandlers().init(this)
    infosPane = new InfosPane().init(this)
    tabsController = new TabsController().init(this)
    m3uDataBuilder = null
    radioDataParser = null
    radiosLists = new RadiosLists().init(this)
    uiState = new UIState().init(this)

    //#endregion

    constructor() {
        super()
        this.version = settings.app.wrp.version
        this.versionDate = settings.app.wrp.verDate
        this.datas = [
            // radios
            'data/' + (Build_Json_Radio_List ?
                WRP_Radio_List
                : WRP_Json_Radio_List
            )]
        if (Build_Json_Radio_List)
            this.m3uDataBuilder = new M3UDataBuilder().init(this)
        else
            this.radioDataParser = new RadioDataParser().init(this)
        this.radiosLists.addList(RadioList_List, RadioList_History, true)
        window.wrpp = this
    }

    // return the clickable item (a button or a tab or a list item)
    // returns null || { item, name, listId }
    getListItem(rdList) {
        if (rdList == null || rdList.listId == null)
            return null
        var res = null
        switch (rdList.listId) {
            case RadioList_Info:
                // must be ignored to preserve list init
                break
            case RadioList_All:
                res = { item: $('#btn_wrp_all_radios')[0], name: null, listId: RadioList_All }
                break
            case RadioList_Viz: // no list. will switch to tab
                break
            default:
                const butId = this.uiState.listIdToTabId[rdList.listId]
                if (butId !== undefined) {
                    const paneId = butId.replace('btn_', 'opts_')
                    res = this.radiosLists.findListItemByName(rdList.name, paneId)
                    res.listId = rdList.listId
                }
                break
        }
        return res
    }

    // { domElement, id }
    getRadListItem(item) {
        return this.radiosLists.findListItemById(item.id, 'wrp_radio_list')
    }

    // { domElement, id }
    getRadListItemById(id) {
        return this.radiosLists.findListItemById(id, 'wrp_radio_list')
    }

    // { domElement, id }
    getPlaysListsItemById(id) {
        return this.radiosLists.findListItemById(id, 'opts_wrp_play_list')
    }

    initView(viewId) {

        settings.dataStore.loadRadiosLists()

        this.tabsController.initTabs()
        this.listsBuilder.buildTagItems()
            .buildArtItems()
            .buildLangItems()
            .buildListsItems()

        const readOnly = { readOnly: true, attr: 'text' };

        $('#wrp_img').on('error', () => {
            this.mediaImage.noImage()
        })
        $('#wrp_img').on('load', () => {
            this.mediaImage.showImage()
        })

        const thisPath = 'app.moduleLoader.getModuleById("' + this.id + '").'
        const listCountPath = thisPath + 'listCount'
        const filteredListCountPath = thisPath + 'filteredListCount'

        ui
            .bindings.bind(ui.bindings.binding(
                'wrp_list_count',
                listCountPath + '==' + filteredListCountPath + '?' + listCountPath + ' :  (' + filteredListCountPath + '+" / "+' + listCountPath + ')',
                readOnly))

        $('#btn_wrp_all_radios').on('click', () => {
            this.allRadios()
        })

        if (!settings.features.constraints.noFullscreenToggling) {
            $('#wrp_fullscreen_on').on('click', () => {
                cui.setFullscreen(true)
                if (this.resizeEventInitialized)
                    this.mediaImage.showImage()
            })

            $('#wrp_fullscreen_off').on('click', () => {
                cui.setFullscreen(false)
                if (this.resizeEventInitialized)
                    this.mediaImage.showImage()
            })
        }

        $('#wrp_btn_pause_onoff').on('click', () => {
            if ($('#wrp_btn_pause_on').hasClass('but-icon-disabled'))
                return
            app.toggleOPause(() => this.playEventsHandlers
                .onPauseStateChanged(true))
        })

        $('#wrp_but_add_fav').on('click', (e) => {
            const $e = $(e.currentTarget)
            if ($e.hasClass('menu-item-disabled')) return
            if (!this.uiState.favoriteInputState) return
            this.favorites.addNewFavoriteList()
        })

        $('#btn_wrp_infos').on('click', () => {
            if (this.uiState.favoriteInputState) return
            this.infosPane.toggleInfos()
        })

        this.infosPane.initEventsHandlers()

        if (settings.features.swype.enableArrowsButtonsOverScrollPanes) {
            $("#rdl_top").removeClass('hidden')
            $("#rdl_btm").removeClass('hidden')

            ui.scrollers
                .new(ui.scrollers.scroller(
                    ['wrp_radio_list', 'opts_wrp_inf', 'opts_log_pane'],
                    'rdl_top',
                    'rdl_btm'
                ))
        }

        // modules are late binded. have the responsability to init bindings
        this.updateBindings()

        // ui state
        const firstInit = settings.dataStore.initUIStateStorage(
            () => {
                // first launch init
                const us = this.uiState
                us.updateCurrentTab('btn_wrp_tag_list')
                us.listsBuilder.radListBuilder.updateCurrentRDList(
                    us.RDList(
                        RadioList_Tag,
                        null,
                        $('#btn_wrp_tag_list')
                    ))
            }
        )

        if (!firstInit)
            settings.dataStore.loadUIState()
    }

    setCurrentRDList(currentRDList) {
        this.uiState.updateCurrentRDList(currentRDList)
    }

    updatePauseView() {
        if (oscilloscope.pause) {
            $('#wrp_btn_pause_on').addClass('hidden')
            $('#wrp_btn_pause_off').removeClass('hidden')
        } else {
            $('#wrp_btn_pause_off').addClass('hidden')
            $('#wrp_btn_pause_on').removeClass('hidden')
        }
    }

    setPlayPauseButtonFreezeState(freezed) {
        const c = 'but-icon-disabled'
        const setState = (id, freezed) => {
            const $b = $('#' + id)
            if (freezed)
                $b.addClass(c)
            else
                $b.removeClass(c)
        }
        setState('wrp_btn_pause_on', freezed)
        setState('wrp_btn_pause_off', freezed)
    }

    updateBindings() {
        ui.bindings.updateBindingTarget('wrp_list_count')
    }

    focusListItem(element, selectIt, unfoldIt) {
        const $e = $(element)
        if (selectIt)
            $e.addClass('item-selected')
        if (unfoldIt)
            this.listsBuilder.radListBuilder.foldUnfoldRadItem($e, false)
        element.scrollIntoView({
            behavior: 'instant',
            block: 'center',
            inline: 'center'
        })
    }

    getPaneScrollBackup($pane) {
        return {
            $pane: $pane,
            y: $pane.scrollTop(),
            selectedItemId: $pane.find('.item-selected').attr('data-id')
        }
    }

    setPaneScroll(scrollBackup) {
        const s = scrollBackup
        if (s.selectedItemId != null && s.selectedItemId != '') {
            const $item = s.$pane.find('[data-id="' + s.selectedItemId + '"]')
            if ($item.length > 0) {
                const domItem = $item[0]
                domItem.scrollIntoView({
                    behavior: 'instant',
                    block: 'center',
                    inline: 'center'
                })
            }
        }
    }

    toArtistFromtreamingExclusive(r) {
        if (r === undefined || r == null) return null
        return r.name?.replace('- Hits', '')?.trim()
    }

    clearCurrentRadioView() {
        this.clearAppStatus()
        $('#wrp_radio_url').text('')
        $('#wrp_radio_name').text('')
        $('#wrp_radio_box').text('')
    }

    clearAppStatus() {
        $('#err_txt').text('')
        $('#err_holder').addClass('hidden')
    }

    clearListsSelection() {
        this.clearContainerSelection('opts_wrp_art_list')
        this.clearContainerSelection('opts_wrp_play_list')
        this.clearContainerSelection('opts_wrp_tag_list')
        this.clearContainerSelection('opts_wrp_lang_list')
    }

    clearContainerSelection(containerId) {
        const $container = $('#' + containerId)
        $container.find('.item-selected')
            .removeClass('item-selected')
    }

    findSelectedListItem(containerId) {
        return $$('#' + containerId).find('.item-selected')
    }

    allRadios() {
        this.clearListsSelection()
        this.listsBuilder.radListBuilder
            .updateRadList(this.itemsAll, RadioList_All)
        this.setCurrentRDList(this.uiState.RDList(RadioList_All, null, null))
    }

    isRDListVisible(listId, listName) {
        const crdl = this.uiState.currentRDList
        if (crdl == null) return null
        return crdl.listId == listId && crdl.name == listName
    }

    // radio item model
    radioItem(id, name, groupName, url, logo) {
        return {
            // const properties
            id: id,
            name: name,
            description: null,
            groupTitle: groupName,
            groups: [],
            url: url,
            logo: logo,
            artist: null,
            lang: null,
            channels: null,
            // static & dynamic properties
            country: null,
            favLists: [],
            // dynamic properties
            metadata: {
                duration: null,
                stereo: null,
                encoding: null,
                sampleFrq: null,
                sampleRes: null,
                country: null
            }
        }
    }

    findRadItem(item) {
        return this.findRadItemInList(item, this.itemsAll)
    }

    findRadItemInList(item, lst) {
        var res = null
        lst.some(o => {
            if (item.name == o.name
                && item.url == o.url) {
                res = o
                return true
            }
            return false
        })
        return res
    }

    // set data from .m3u or .txt
    setData(dataId, text) {
        if (dataId.includes(WRP_Radio_List))
            this.m3uDataBuilder.setDataRadioListM3U(text)
        if (dataId.includes(WRP_Json_Radio_List))
            this.radioDataParser.setDataRadioList(text)
    }
}