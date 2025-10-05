/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

//#region global attributes

/**
 * @type {WebRadioPickerModule}
 */
var wrpp = null

/**
 * @type {RadsItems}
 */
var radsItems = null

/**
 * @type {MediaImage}
 */
var mediaImage = null

/**
 * @type {ListsBuilder}
 */
var listsBuilder = null

/**
 * @type {RadListBuilder}
 */
var radListBuilder = null

/**
 * @type {PlayHistory}
 */
var playHistory = null

/**
 * @type {Favorites}
 */
var favorites = null

/**
 * @type {PlayEventsHandlers}
 */
var playEventsHandlers = null

/**
 * @type {InfosPane}
 */
var infosPane = null

/**
 * @type {TabsController}
 */
var tabsController = null

/**
 * @type {RadiosLists}
 */
var radiosLists = null

/**
 * @type {UIState}
 */
var uiState = null

//#endregion

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
    // items count in rad list
    filteredListCount = 0
    // pre-processed data
    groupsById = {}
    itemsById = {}

    resizeEventInitialized = false

    // components

    m3uDataBuilder = null
    radioDataParser = null

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

        wrpp = this
        radsItems = new RadsItems()
        mediaImage = new MediaImage()
        listsBuilder = new ListsBuilder()
        radListBuilder = new RadListBuilder()
        playHistory = new PlayHistory()
        favorites = new Favorites()
        playEventsHandlers = new PlayEventsHandlers()
        infosPane = new InfosPane()
        tabsController = new TabsController()
        radiosLists = new RadiosLists()
        uiState = new UIState()

        radiosLists.addList(RadioList_List, RadioList_History, true)
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
                const butId = uiState.listIdToTabId[rdList.listId]
                if (butId !== undefined) {
                    const paneId = butId.replace('btn_', 'opts_')
                    res = radiosLists.findListItemByName(rdList.name, paneId)
                    res.listId = rdList.listId
                }
                break
        }
        return res
    }

    // { domElement, id }
    getRadListItem(item) {
        return radiosLists.findListItemById(item.id, 'wrp_radio_list')
    }

    // { domElement, id }
    getRadListItemById(id) {
        return radiosLists.findListItemById(id, 'wrp_radio_list')
    }

    // { domElement, id }
    getPlaysListsItemById(id) {
        return radiosLists.findListItemById(id, 'opts_wrp_play_list')
    }

    initView(viewId) {

        settings.dataStore.loadRadiosLists()

        tabsController.initTabs()
        listsBuilder.buildTagItems()
            .buildArtItems()
            .buildLangItems()
            .buildListsItems()

        const readOnly = { readOnly: true, attr: 'text' };

        $('#wrp_img').on('error', () => {
            mediaImage.noImage()
        })
        $('#wrp_img').on('load', () => {
            mediaImage.showImage()
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
                    mediaImage.showImage()
            })

            $('#wrp_fullscreen_off').on('click', () => {
                cui.setFullscreen(false)
                if (this.resizeEventInitialized)
                    mediaImage.showImage()
            })
        }

        $('#wrp_btn_pause_onoff').on('click', () => {
            if ($('#wrp_btn_pause_on').hasClass('but-icon-disabled'))
                return
            app.toggleOPause(() => playEventsHandlers
                .onPauseStateChanged(
                    true,
                    uiState.currentRDItem,
                    null
                ))
        })

        $('#wrp_but_add_fav').on('click', (e) => {
            const $e = $(e.currentTarget)
            if ($e.hasClass('menu-item-disabled')) return
            if (!uiState.favoriteInputState) return
            favorites.addNewFavoriteList()
        })

        $('#btn_wrp_infos').on('click', () => {
            if (uiState.favoriteInputState) return
            infosPane.toggleInfos()
        })

        infosPane.initEventsHandlers()

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
                if (settings.debug.info)
                    logger.log('initializing first launch')
                uiState.updateCurrentTab('btn_wrp_tag_list')
                radListBuilder.updateCurrentRDList(
                    uiState.RDList(
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
        uiState.updateCurrentRDList(currentRDList)
    }

    updateBindings() {
        ui.bindings.updateBindingTarget('wrp_list_count')
    }

    focusListItem(element, selectIt) {
        const $e = $(element)
        if (selectIt)
            $e.addClass('item-selected')
        element.scrollIntoView(ScrollIntoViewProps)
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
                domItem.scrollIntoView(ScrollIntoViewProps)
            }
        }
    }

    toArtistFromtreamingExclusive(r) {
        if (r === undefined || r == null) return null
        return r.name?.replace('- Hits', '')?.trim()
    }

    clearRadioView() {
        this.clearAppStatus()
        this.setupRadioView(null)
    }

    setupRadioView(rdItem) {
        const url = rdItem?.url || ''
        const name = rdItem?.name || ''
        const box = rdItem?.groups?.join(' ') || ''
        $('#wrp_radio_url').text(url)
        $('#wrp_radio_name').text(name)
        $('#wrp_radio_box').text(box)
    }

    clearAppStatus() {
        $('#err_txt').text('')
        $('#err_holder').addClass('hidden')
    }

    clearListsSelection() {
        this
            .clearContainerSelection('opts_wrp_art_list')
            .clearContainerSelection('opts_wrp_play_list')
            .clearContainerSelection('opts_wrp_tag_list')
            .clearContainerSelection('opts_wrp_lang_list')
    }

    clearContainerSelection(containerId) {
        const $container = $('#' + containerId)
        $container.find('.item-selected')
            .removeClass('item-selected')
        return this
    }

    findSelectedListItem(containerId) {
        return $('#' + containerId).find('.item-selected')
    }

    allRadios() {
        this.clearListsSelection()
        radListBuilder
            .updateRadList(this.itemsAll, RadioList_All)
        this.setCurrentRDList(uiState.RDList(RadioList_All, null, null))
    }

    isRDListVisible(listId, listName) {
        const crdl = uiState.currentRDList
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
                country: null,
                statusText: null
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