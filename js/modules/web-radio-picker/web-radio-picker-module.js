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

    // ----- module spec ----->

    id = 'web_radio_picker'         // unique id
    version = '1.0'
    versionDate = '09/02/2025'
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

    // <----- end module spec -----

    items = []              // all items by group name
    itemsByArtists = []     // item with artist by artist name
    itemsByName = []        // all items by name
    itemsByLang = []        // items by lang (those having one)
    itemsAll = []           // all items
    listCount = 0
    filteredListCount = 0
    tabs = ['btn_wrp_tag_list',
        'btn_wrp_lang_list',
        'btn_wrp_art_list',
        'btn_wrp_play_list',
        'btn_wrp_logo']
    infTabs = ['btn_wrp_inf', 'btn_log_pane']
    addToHistoryTimer = null
    resizeEventInitialized = false
    // pre-processed data
    groupsById = {}
    itemsById = {}

    // components

    m3uDataBuilder = null
    radioDataParser = null
    radiosLists = new RadiosLists()
    uiState = new UIState().init(this)

    constructor() {
        super()
        this.version = settings.app.wrp.version
        this.versionDate = settings.app.wrp.verDate
        this.datas = [
            // radios
            Build_Json_Radio_List ?
                WRP_Radio_List
                : WRP_Json_Radio_List]
        if (Build_Json_Radio_List)
            this.m3uDataBuilder = new M3UDataBuilder().init(this)
        else
            this.radioDataParser = new RadioDataParser().init(this)
        this.radiosLists.init()
        this.radiosLists.addList(RadioList_List, RadioList_History)
        window.wrpp = this
    }

    initTabs() {
        ui.tabs.initTabs(this.tabs, {
            onChange: ($c) => {
                this.onTabChanged($c)
            }
        })
        ui.tabs.initTabs(this.infTabs, {
            onPostChange: ($c) => {
                this.onInfTabChanged($c)
            }
        })
    }

    onInfTabChanged($tab) {
        if (settings.features.swype.enableArrowsButtonsOverScrollPanes)
            ui.scrollers.update($tab.attr('id').replace('btn_', 'opts_'))
    }

    onTabChanged($tab) {
        const c = $tab[0]
        const $cnv = $(app.canvas)
        if (c.id == 'btn_wrp_logo') {
            $cnv.removeClass('hidden')
            ui.vizTabActivated = true
        }
        else {
            $cnv.addClass('hidden')
            ui.vizTabActivated = false
        }
        this.uiState.updateCurrentTab(c.id)
    }

    initView(viewId) {

        settings.dataStore.loadRadiosLists()

        this.initTabs()
        this.buildTagItems()
            .buildArtItems()
            .buildLangItems()
            .buildListsItems()
        //.buildRadItems()  // no initial full list

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
            app.toggleOPause(() => this.updatePauseView())
        })

        $('#btn_wrp_infos').on('click', async () => {
            await this.toggleInfos()
        })

        ui.onResize.push(async () => {
            await this.updateInfoPaneOnResize()
        })

        app.startFramePermanentOperations.push(() => {
            this.updateInfoPaneOnEndOfFrame()
        })

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
    }

    async getRelatedApps() {
        const installedRelatedApps = await navigator.getInstalledRelatedApps?.()
        if (!installedRelatedApps || installedRelatedApps.length == 0) return '?'
        const s = ''
        for (var o in installedRelatedApps)
            s += o.platform + ',' + o.id + ',' + o.url
        return s
    }

    async updateInfoPaneOnResize() {
        $('#ifp_window_size').text(this.getWindowSizeText())
    }

    updateInfoPaneOnEndOfFrame() {
        $('#ifp_FPS').text(this.getFPS())
    }

    getWindowSizeText() {
        return cui.viewSize().width + ' x ' + cui.viewSize().height
    }

    getFPS() {
        return 'lim=' + settings.ui.maxRefreshRate + ' cur=' + vround2(app.frameAvgFPS)
    }

    async initInfoPane() {
        const $pane = $('#opts_wrp_inf')
        const txt = (s, cl) => {
            const isjq = typeof s == 'object'
            const txt = !isjq ? s : ''
            const $n = $('<div class="' + cl + '">' + txt + '</div>')
            if (isjq) $n.append(s)
            $pane.append($n)
        }
        const name = s => {
            txt(s, 'wrp-inf-name')
        }
        const val = (s, id) => {
            if (typeof s != 'object')
                s = $('<span id="' + id + '">' + s + '</span>')
            txt(s, 'wrp-inf-val')
        }
        const w = (k, v) => {
            name(k)
            val(v, 'ifp_' + k.replaceAll(' ', '_'))
        }
        w('user agent', navigator.userAgent)
        w('window size', this.getWindowSizeText())
        w('platform', settings.sys.platformText)
        const appinf = await this.getRelatedApps()
        w('app', settings.app.wrp.version + ' ' + settings.app.wrp.verDate)
        if (appinf != '?')
            val(appinf)
        var ps = window.location.search
        if (ps == null || ps === undefined || ps == '') ps = '-'
        w('parameters', ps)
        w('FPS', this.getFPS())
        w('sampling', settings.input.bufferSize + ' bytes, '
            + frequency(app.channel?.audioContext?.sampleRate).text2
        )
        w('FFT', settings.input.bufferSize * 2 + ' bytes, '
            + settings.fft.bars + ' bars'
        )
        w('project readme',
            $('<a href="https://github.com/franck-gaspoz/web-radio-podcast-picker/blob/main/README.md" target="blank">https://github.com/franck-gaspoz/web-radio-podcast-picker/blob/main/README.md</a>'))
    }

    async toggleInfos() {
        const $but = $('#btn_wrp_infos')
        const $pane = $('#wrp_inf_pane')
        const $radPane = $('#wrp_radio_list')
        $but.toggleClass('selected')
        $pane.toggleClass('hidden')
        $radPane.toggleClass('hidden')
        var scPane = null
        var rd = null
        if (!$pane.hasClass('hidden')) {
            $('#opts_wrp_inf').empty()
            await this.initInfoPane()
            scPane = 'opts_wrp_inf'
            rd = this.uiState.RDList(RadioList_Info, null, null)
        }
        else {
            scPane = 'wrp_radio_list'
            rd = this.uiState.currentRDList_Back
        }
        if (settings.features.swype.enableArrowsButtonsOverScrollPanes)
            ui.scrollers.update(scPane)
        this.setCurrentRDList(rd)
    }

    setCurrentRDList(currentRDList) {
        this.uiState.updateCurrentRDList(currentRDList)
    }

    async hideInfoPane() {
        const $pane = $('#wrp_inf_pane')
        if (!$pane.hasClass('hidden'))
            await this.toggleInfos()
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

    initAudioSourceHandlers() {
        WRPPMediaSource.onLoadError = (err, audio) => this.onLoadError(err, audio)
        WRPPMediaSource.onLoadSuccess = (audio) => this.onLoadSuccess(audio)
    }

    onLoading(item) {
        app.channel.connected = false
        $('#wrp_connected_icon').addClass('hidden')
        $('#wrp_connect_error_icon').addClass('hidden')
        $('#wrp_connect_icon').removeClass('hidden')
    }

    onLoadError(err, audio) {
        app.channel.connected = false
        $('#wrp_connected_icon').addClass('hidden')
        $('#wrp_connect_icon').addClass('hidden')
        $('#wrp_connect_error_icon').removeClass('hidden')
        $('#err_txt')
            .text('no connection')
        $('#err_holder')
            .removeClass('hidden')
    }

    onLoadSuccess(audio) {
        app.channel.connected = true
        // metatadata available: audio.duration
        $('#wrp_connect_icon').addClass('hidden')
        $('#wrp_connect_error_icon').addClass('hidden')
        $('#wrp_connected_icon').removeClass('hidden')
    }

    updateBindings() {
        ui.bindings.updateBindingTarget('wrp_list_count')
    }

    buildListsItems() {
        const $pl = $('#opts_wrp_play_list')
        const t = this.radiosLists.lists
        const names = Object.keys(t)
        names.sort((a, b) => a.localeCompare(b))
        var i = 0
        names.forEach(name => {
            const lst = t[name].items
            const { item, $item } = this.buildListItem(
                name,
                i,
                { count: lst.length }
            )
            i++
            this.initBtn($pl, $item, lst,
                this.uiState.RDList(RadioList_List, name, $item)
            )
            $pl.append($item)
        })
    }

    updateListsItems() {
        const $pl = $('#opts_wrp_play_list')
        $pl.find('*').remove()
        this.buildListsItems()
    }

    buildTagItems() {
        const $tag = $('#opts_wrp_tag_list')
        const keys = Object.keys(this.items)
        var i = 0
        keys.forEach(k => {
            const { item, $item } = this.buildListItem(
                this.ifQuoteUnQuote(k),//unquote(k),
                i,
                { count: this.items[k].length }
            )
            i++
            this.initBtn($tag, $item, this.items[k],
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
                {
                    count: ''
                })
            j++
            btns[name] = $item
            this.initBtn($container, $item, itemsByName[name],
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

    buildRadItems() {
        const keys = Object.keys(this.items)
        var i = 0
        keys.forEach(k => {
            i++
            const t = this.items[k]
            this.buildRadListItems(t)
        })
        return this
    }

    buildRadListItems(items) {
        const $rad = $('#wrp_radio_list')
        var j = 0
        items.forEach(n => {
            const { item, $item } = this.buildListItem(n.name, j)
            j++
            this.initItemRad($rad, $item, n)
            $rad.append($item)
        })
        $rad.scrollTop(0)
        ui.scrollers.update('wrp_radio_list')
    }

    // build a playable item
    buildListItem(text, j, opts) {
        if (opts === undefined) opts = null

        const item = document.createElement('div')
        const $item = $(item)

        $item.addClass('wrp-list-item')
        $item.removeClass('hidden')
        if (j & 1)
            $item.addClass('wrp-list-item-a')
        else
            $item.addClass('wrp-list-item-b')

        $item.text(text)

        if (opts != null) {
            const n2 = document.createElement('div')
            const $n2 = $(n2)
            $n2.addClass('wrp-list-item-box')
            $n2.text(opts.count)
            item.appendChild(n2)
        }

        return { item: item, $item: $item }
    }

    setupItemOptions($artBut, opts) {
        const $n = $artBut.find('.wrp-list-item-box')
        $n.text(opts.count)
    }

    updateRadList(lst, listId) {
        const $rad = $('#wrp_radio_list')
        $rad.find('*').remove()
        this.buildRadListItems(lst, listId)
        this.filteredListCount = lst.length
        this.updateBindings()
        logger.log('update rad list')
    }

    clearFilters() {
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

    allRadios() {
        this.clearFilters()
        this.updateRadList(this.itemsAll, RadioList_All)
        this.setCurrentRDList(this.uiState.RDList(RadioList_All, null, null))
    }

    noImage() {
        const $i = $('#wrp_img')
        $i[0].src = './img/icon.ico'
        $i.attr('data-noimg', '1')
        $i.attr('width', null)
        $i.attr('height', null)
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

        ui.tabs.selectTab('btn_wrp_logo', this.tabs)
        this.onTabChanged($('#btn_wrp_logo'))
    }

    initBtn($container, $item, t, currentRDList) {
        $item.on('click', async () => {
            await this.hideInfoPane()
            this.clearFilters()
            $item.addClass('item-selected')
            this.updateRadList(t, currentRDList.listId)
            this.setCurrentRDList(currentRDList)
        })
    }

    // init a playable item
    initItemRad($rad, $item, o) {
        $item.on('click', async () => {

            $rad.find('.item-selected')
                .removeClass('item-selected')
            $item.addClass('item-selected')

            $('#wrp_radio_url').text(o.url)
            $('#wrp_radio_name').text(o.name)
            $('#wrp_radio_box').text(o.groups.join(' '))
            const $i = $('#wrp_img')
            $i.attr('data-w', null)
            $i.attr('data-h', null)

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
                this.loading = o

                $('#err_txt')
                    .text('')
                $('#err_holder')
                    .addClass('hidden')

                this.initAudioSourceHandlers()
                this.onLoading(o)

                const pl = async () => {

                    // turn on channel
                    this.updatePauseView()

                    // setup channel media
                    await app.updateChannelMedia(
                        ui.getCurrentChannel(),
                        o.url
                    )

                    // update ui state
                    this.uiState.updateCurrentRDItem(o)

                    // add to history
                    const tid = setTimeout(() => this.addToHistory(o),
                        this.getSettings().addToHistoryDelay
                    )
                    if (this.addToHistoryTimer != null)
                        clearTimeout(this.addToHistoryTimer)
                    this.addToHistoryTimer = tid
                }

                if (oscilloscope.pause)
                    app.toggleOPause(async () => await pl())
                else
                    await pl()
            }

        })
    }

    addToHistory(o) {
        o.listenDate = Date.now
        const history = this.radiosLists.getList(RadioList_History).items
        if (history.includes(o))
            // TODO: move to first position instead
            return
        const paneId = 'opts_wrp_play_list'
        //const $pl = $('#' + paneId)

        history.unshift(o)
        this.updateListsItems()
        //const listItem = this.radiosLists.findListItem(RadioList_History, paneId)

        settings.dataStore.saveRadiosLists()
    }

    // radio item model
    radioItem(id, name, groupName, url, logo) {
        return {
            id: id,
            name: name,
            description: null,
            groupTitle: groupName,
            groups: [],
            favLists: [],
            url: url,
            logo: logo,
            artist: null,
            country: null,
            lang: null,
            channels: null
        }
    }

    // set data from .m3u and export to json
    setData(dataId, text) {
        if (dataId == WRP_Radio_List)
            this.m3uDataBuilder.setDataRadioListM3U(text)
        if (dataId == WRP_Json_Radio_List)
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
