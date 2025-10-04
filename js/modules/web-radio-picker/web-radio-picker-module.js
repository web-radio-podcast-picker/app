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

    history = new History().init(this)
    favorites = new Favorites().init(this)
    playEventsHandlers = new PlayEventsHandlers().init(this)
    infosPane = new InfosPane().init(this)
    tabsController = new TabsController().init(this)
    m3uDataBuilder = null
    radioDataParser = null
    radiosLists = new RadiosLists().init(this)
    uiState = new UIState().init(this)
    // ask to not change current tab automatically (eg. case restore ui state)
    preserveCurrentTab = false
    // current loading item if any
    loadingRDItem = null
    $loadingRDItem = null

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
        this.buildTagItems()
            .buildArtItems()
            .buildLangItems()
            .buildListsItems()

        const readOnly = { readOnly: true, attr: 'text' };

        $('#wrp_img').on('error', () => {
            this.noImage()
        })
        $('#wrp_img').on('load', () => {
            this.showImage()
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
                    this.showImage()
            })

            $('#wrp_fullscreen_off').on('click', () => {
                cui.setFullscreen(false)
                if (this.resizeEventInitialized)
                    this.showImage()
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
                us.updateCurrentRDList(us.RDList(
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

    getSortedNames(t) {
        const names = Object.keys(t)
        names.sort((a, b) => a.localeCompare(b))
        return names
    }

    buildListsItems() {
        const $pl = $('#opts_wrp_play_list')
        const t = this.radiosLists.lists
        const names = this.getSortedNames(t)
        var i = 0
        names.forEach(name => {
            const lst = t[name].items
            const { item, $item } = this.buildListItem(
                name,
                i,
                i,
                { count: lst.length },
                null,
                null,
                null
            )
            i++
            this.initBtn($pl, item, $item, lst,
                this.uiState.RDList(RadioList_List, name, $item)
            )
            $pl.append($item)
        })
    }

    updateListsItems() {
        const $pl = $('#opts_wrp_play_list')
        const $selected = $pl.find('.item-selected')
        const id = $selected.attr('data-id')
        const y = $pl.scrollTop()

        if ($pl.length > 0)
            $pl[0].innerHTML = ''
        this.buildListsItems()

        $pl.scrollTop(y)
        if (id !== undefined) {
            const it = this.getPlaysListsItemById(id)
            if (it != null) {
                it.item.scrollIntoView({
                    behavior: 'instant',
                    block: 'center',
                    inline: 'center'
                })
                $(it.item).addClass('item-selected')
            }
            return { $panel: $pl, $selected: $selected, id: id, it: it }
        }
        return { $panel: $pl, $selected: $selected, id: id, it: null }
    }

    focusListItem(element, selectIt, unfoldIt) {
        const $e = $(element)
        if (selectIt)
            $e.addClass('item-selected')
        if (unfoldIt)
            this.foldUnfoldRadItem($e, false)
        element.scrollIntoView({
            behavior: 'instant',
            block: 'center',
            inline: 'center'
        })
    }

    // update the rdList view for the current rdList and the given item
    updateCurrentRDList(item) {
        // find the list item / button
        const rdList = this.uiState.currentRDList
        if (rdList == null) return
        const itemRef = this.getListItem(rdList)
        if (itemRef == null || itemRef.item == null) return

        // get the target items panel props
        const $pl = $('#wrp_radio_list')
        const $selected = $pl.find('.item-selected')
        const id = $selected.attr('data-id')
        // get dynamic item props
        const text = $selected.attr('data-text')
        const y = $pl.scrollTop()

        // open the list
        const r = itemRef.item.click()

        // restore the position & selection
        $pl.scrollTop(y)
        if (id !== undefined) {
            const it = this.getRadListItemById(id)
            if (it != null) {
                it.item.scrollIntoView({
                    behavior: 'instant',
                    block: 'center',
                    inline: 'center'
                })
                const $item = $(it.item)
                $item.addClass('item-selected')
                this.$loadingRDItem = $item
                this.loadingRDItem = item
                this.updateLoadingRadItem(text)
            }
            return { $panel: $pl, $selected: $selected, id: id, it: it }
        }
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

    buildTagItems() {
        const $tag = $('#opts_wrp_tag_list')
        const keys = Object.keys(this.items)
        var i = 0
        keys.forEach(k => {
            const { item, $item } = this.buildListItem(
                this.ifQuoteUnQuote(k),
                i,
                i,
                { count: this.items[k].length },
                null,
                null,
                null
            )
            i++
            this.initBtn($tag, item, $item, this.items[k],
                this.uiState.RDList(RadioList_Tag, k, $item))
            $tag.append($item)
        })
        return this
    }

    ifQuoteUnQuote(s) {
        if (!s.startsWith('"')) return s
        return unquote(s)
    }

    buildNamesItems(containerId, itemsByName, listId) {
        const $container = $('#' + containerId)
        var i = 0
        const btns = []
        const keys = Object.keys(itemsByName)
        var j = 0
        keys.forEach(name => {
            const { item, $item } = this.buildListItem(
                name,
                j,
                j,
                {
                    count: ''
                },
                null,
                null,
                null)
            j++
            btns[name] = $item
            this.initBtn($container, item, $item, itemsByName[name],
                this.uiState.RDList(listId, name, $item))
            $container.append($item)
        })

        keys.forEach(name => {
            const cnt = itemsByName[name].length
            this.setupItemOptions(
                btns[name],
                {
                    count: cnt
                }
            )
        })

        return this
    }

    buildLangItems() {
        this.buildNamesItems('opts_wrp_lang_list', this.itemsByLang, RadioList_Lang)
        return this
    }

    buildArtItems() {
        this.buildNamesItems('opts_wrp_art_list', this.itemsByArtists, RadioList_Art)
        return this
    }

    toArtistFromtreamingExclusive(r) {
        if (r === undefined || r == null) return null
        return r.name?.replace('- Hits', '')?.trim()
    }

    buildRadListItems(items, listId, listName) {
        const $rad = $('#wrp_radio_list')
        var j = 0
        items.forEach(n => {
            const { item, $item } = this.buildListItem(
                n.name,
                n.id,
                j,
                null,
                n,
                listId,
                listName
            )
            j++
            this.initItemRad($rad, $item, n)
            $rad.append($item)
        })
        $rad.scrollTop(0)
        if (settings.features.swype.enableArrowsButtonsOverScrollPanes)
            ui.scrollers.update('wrp_radio_list')
    }

    // build a playable item
    buildListItem(text, id, j, opts, rdItem, listId, listName) {
        if (opts === undefined) opts = null

        const item = document.createElement('div')
        const $item = $(item)

        $item.attr('data-id', id)
        $item.attr('data-text', text)
        $item.addClass('wrp-list-item')
        $item.removeClass('hidden')
        if (j & 1)
            $item.addClass('wrp-list-item-a')
        else
            $item.addClass('wrp-list-item-b')

        const $textBox = $('<div class="wrp-list-item-text-container">' + text + '</div>')
        $item.append($textBox)

        if (opts != null) {

            if (opts.count !== undefined) {

                const n2 = document.createElement('div')
                const $n2 = $(n2)
                $n2.addClass('wrp-list-item-box')

                $n2.text(opts.count)
                item.appendChild(n2)
            }
        }

        if (rdItem != null) {

            // rad item : control box

            const isHistoryList = listId == RadioList_List && listName == RadioList_History

            const existsInFavorites =
                rdItem.favLists.length == 0 ? false :
                    (rdItem.favLists.length == 1 && rdItem.favLists[0] != RadioList_History)
                    || rdItem.favLists.length > 1

            const butHeartOnVis = existsInFavorites ? '' : 'hidden'
            const butHeartOn =
                `<img name="heart_on" src="./img/icons8-heart-fill-48.png" width="32" height="32" alt="heart" class="wrp-rad-item-icon ${butHeartOnVis}">`
            const butHeartOffVis = !existsInFavorites ? '' : 'hidden'
            const butHeartOff =
                `<img name="heart_off" src="./img/icons8-heart-outline-48.png" width="32" height="32" alt="heart" class="wrp-rad-item-icon ${butHeartOffVis}">`

            const butRemove = isHistoryList ?
                `<img name="trash" src="./img/trash-32.png" width="32" height="32" alt="heart" class="wrp-rad-item-icon">`
                : ''

            $item.addClass('wrp-list-item-2h')
            const $subit = $(
                `<div class="wrp-list-item-sub hidden">
<span class="wrp-item-info-text"></span>
<div class="wrp-item-controls-container">
${butRemove}${butHeartOn}${butHeartOff}
</div>
</div>`)
            const disabledCl = 'but-icon-disabled'
            const $butOn = $subit.find('img[name="heart_on"]')
            $butOn
                .on('click', e => {
                    e.preventDefault()
                    if ($(e.currentTarget).hasClass(disabledCl)) return
                    // TODO: change call target
                    this.favorites.removeFavorite(rdItem, $item, $butOn, $butOff)
                })

            const $butOff = $subit.find('img[name="heart_off"]')
            $butOff
                .on('click', e => {
                    e.preventDefault()
                    if ($(e.currentTarget).hasClass(disabledCl)) return
                    // TODO: change call target
                    this.favorites.addFavorite(rdItem, $item, listId, listName, $butOn, $butOff)
                })

            if (isHistoryList)
                $subit.find('img[name="trash"]')
                    .on('click', e => {
                        e.preventDefault()
                        if ($(e.currentTarget).hasClass(disabledCl)) return
                        this.history.removeFromHistory(rdItem, $item, listId, listName, $butOn, $butOff)
                    })

            $item.append($subit)

            if (opts != null) {

            }
        }

        return { item: item, $item: $item }
    }

    // init a playable item
    initItemRad($rad, $item, o) {
        const $textContainer = $item.find('.wrp-list-item-text-container')
        $textContainer.on('click', async () => {

            if (this.uiState.isRadOpenDisabled()) return

            $rad.find('.item-selected')
                .removeClass('item-selected')
            this.foldLoadingRadItem()
            $item.addClass('item-selected')

            $('#wrp_radio_url').text(o.url)
            $('#wrp_radio_name').text(o.name)
            $('#wrp_radio_box').text(o.groups.join(' '))
            const $i = $('#wrp_img')
            $i.attr('data-w', null)
            $i.attr('data-h', null)

            // setup up media image
            if (o.logo != null && o.logo !== undefined && o.logo != '') {
                // get img
                $i.addClass('hidden')
                $i.attr('width', null)
                $i.attr('height', null)
                $i.attr('data-noimg', null)
                $i.removeClass('wrp-img-half')
                var url = o.logo
                if (settings.net.enforceHttps)
                    url = url.replace('http://', 'https://')
                $i.attr('src', url)

            } else {
                // no img
                $i.addClass('hidden')
                this.noImage()
            }

            const channel = ui.getCurrentChannel()
            if (channel != null && channel !== undefined) {

                this.loadingRDItem = o
                this.$loadingRDItem = $item
                this.clearAppStatus()
                this.playEventsHandlers.initAudioSourceHandlers()
                this.playEventsHandlers.onLoading(o)

                // plays the item
                const pl = async () => {

                    // turn on channel

                    // update pause state
                    this.playEventsHandlers.onPauseStateChanged()

                    // setup channel media
                    await app.updateChannelMedia(
                        ui.getCurrentChannel(),
                        o.url
                    )

                    // update ui state
                    this.uiState.updateCurrentRDItem(o)
                }

                if (oscilloscope.pause)
                    app.toggleOPause(async () => await pl())
                else
                    await pl()
            }
        })
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

    updateLoadingRadItem(statusText, $item) {
        var $ldgRDItem = $item || this.$loadingRDItem
        if ($ldgRDItem == null) return
        const $subit = $ldgRDItem.find('.wrp-list-item-sub')
        const $statusText = $ldgRDItem.find('.wrp-item-info-text')
        $ldgRDItem.attr('data-text', statusText)
        $statusText.text(statusText)
        $subit.removeClass('hidden')
    }

    updateRadItem(item, $item, $butOn, $butOff) {
        const favs = this.favorites.getItemFavoritesFiltered(item)
        if (favs.length > 0) {
            $butOn.removeClass('hidden')
            $butOff.addClass('hidden')
        } else {
            $butOn.addClass('hidden')
            $butOff.removeClass('hidden')
        }
    }

    foldLoadingRadItem() {
        if (this.$loadingRDItem == null && this.loadingRDItem == null) return
        const $subit = this.$loadingRDItem.find('.wrp-list-item-sub')
        $subit.addClass('hidden')
    }

    foldUnfoldRadItem($rdItem, folded) {
        const $subit = $rdItem.find('.wrp-list-item-sub')
        if (folded)
            $subit.addClass('hidden')
        else
            $subit.removeClass('hidden')
    }

    setupItemOptions($artBut, opts) {
        const $n = $artBut.find('.wrp-list-item-box')
        $n.text(opts.count)
    }

    updateRadList(lst, listId, listName) {
        const $rad = $('#wrp_radio_list')
        if ($rad.length > 0)
            $rad[0].innerHTML = ''
        this.buildRadListItems(lst, listId, listName),
            this.filteredListCount = lst.length
        this.updateBindings()
        if (settings.debug.trace)
            logger.log('update rad list')
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
        this.updateRadList(this.itemsAll, RadioList_All)
        this.setCurrentRDList(this.uiState.RDList(RadioList_All, null, null))
    }

    noImage() {
        const $i = $('#wrp_img')
        $i[0].src = './img/icon.ico'
        $i.attr('data-noimg', '1')
        $i.attr('width', null)
        $i.attr('height', null)
        $i.attr('data-w', null)
        $i.attr('data-h', null)
    }

    showImage() {
        const $i = $('#wrp_img')
        const noimg = $i.attr('data-noimg') != null
        if (noimg)
            $i.addClass('wrp-img-half')

        $i.removeClass('ptransparent')
        $i.removeClass('hidden')

        var iw = $i[0].width
        var ih = $i[0].height
        const dw = $i.attr('data-w')
        const dh = $i.attr('data-h')
        if (dw != null && dh != null) {
            // case: resize
            iw = dw
            ih = dh
        } else {
            $i.attr('data-w', iw)
            $i.attr('data-h', ih)
        }
        var r = iw / ih

        const $c = $('#left-pane')
        const cw = $c.width()
        const ch = $c.height()
        var rw = iw / cw
        var rh = ih / ch

        // auto zoom
        if (!noimg) {
            iw *= 2
            ih *= 2
        }

        // limit bounds
        if (iw >= ih) {
            // square or landscape
            if (iw > cw) {
                iw = cw
                ih = iw / r
            }
            if (ih > ch) {
                ih = ch
                iw = r * ih
            }
        } else {
            // portrait
            if (ih > ch) {
                ih = ch
                iw = r * ih
            }
            if (iw > cw) {
                iw = cw
                ih = iw / r
            }
        }
        $i.attr('width', iw + 'px')
        $i.attr('height', ih + 'px')

        //this.ignoreNextShowImage = false

        if (!this.resizeEventInitialized) {
            ui.onResize.push(() => {
                this.showImage()
            })
            this.resizeEventInitialized = true
        }

        if (!this.tabsController.preserveCurrentTab
            && !this.uiState.favoriteInputState
        ) {
            this.tabsController.selectTab('btn_wrp_logo')
            this.tabsController.onTabChanged($('#btn_wrp_logo'))
        }
        else
            this.tabsController.preserveCurrentTab = false
    }

    initBtn($container, item, $item, t, currentRDList) {
        $item.on('click', e => {
            const $e = $(e.currentTarget)
            if ($e.hasClass('but-icon-disabled')) return
            if (currentRDList.listId == RadioList_List
                && this.uiState.favoriteInputState
            )
                // favorite select
                // TODO: change call target
                this.favorites.endAddFavorite($item, currentRDList, false)
            else {
                // normal select
                this.infosPane.hideInfoPane()
                this.clearListsSelection()
                $item.addClass('item-selected')
                this.updateRadList(t, currentRDList.listId, currentRDList.name)
                this.setCurrentRDList(currentRDList)
            }
        })
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

// utils

function toUpperCaseWorldsFirstLetters(g) {
    return g.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => word.toUpperCase())
}

function remove(t, e) {
    const i = index(t, e)
    if (i == -1) return
    t.splice(i, 1)
}

function index(t, e) {
    for (var i = 0; i < t.length; i++)
        if (t[i] == e) return i
    return -1
}

function quote(s) {
    return '"' + s + '"'
}
