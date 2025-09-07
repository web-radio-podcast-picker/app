/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

const WebRadioPickerDataId = 'all_stations.m3u'
const WRP_Unknown_Group_Label = 'unclassified'
const WRP_Artists_Group_Label = 'artists'

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
            'view.html',
            'styles.css'
        ]
    ]
    settings = ['settings.json']    // module settings
    datas = [WebRadioPickerDataId]  // module data files

    title = 'Web Radio Picker'
    icon = '☄'

    // <----- end module spec -----

    items = []              // all items by group name
    itemsByArtists = []     // item with artist by artist name
    itemsByName = []        // all items by name
    itemsByLang = []        // items by lang (those having one)
    itemsAll = []           // all items
    history = []            // historic (auto play list)
    listCount = 0
    filteredListCount = 0
    grpLisdtIndex = 0
    tabs = ['btn_wrp_tag_list',
        'btn_wrp_lang_list',
        'btn_wrp_art_list',
        'btn_wrp_play_list',
        'btn_wrp_logo']
    ignoreNextShowImage = false
    addToHistoryTimer = null

    init() {
        const mset = settings.modules.web_radio_picker
        const dataUrl = mset.dataUrl
    }

    initTabs() {
        ui.tabs.initTabs(this.tabs, {
            onChange: ($c) => {
                this.onTabChanged($c)
            }
        })
    }

    onTabChanged($tab) {
        const c = $tab[0]
        const $cnv = $(app.canvas)
        if (c.id == 'btn_wrp_logo')
            $cnv.removeClass('hidden')
        else
            $cnv.addClass('hidden')
    }

    initView(viewId) {

        this.initTabs()
        this.buildTagItems()
            .buildArtItems()
            .buildLangItems()
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

        $('#wrp_fullscreen_on').on('click', () => {
            cui.setFullscreen(true)
        })

        $('#wrp_fullscreen_off').on('click', () => {
            cui.setFullscreen(false)
        })

        $('#wrp_btn_pause_on').on('click', () => {
            app.toggleOPause(() => this.updatePauseView())
        })

        $('#wrp_btn_pause_off').on('click', () => {
            app.toggleOPause(() => this.updatePauseView())
        })

        // modules are late binded. have the responsability to init bindings
        this.updateBindings()
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
        app.channel.mediaSource.onLoadError = (err, audio) => this.onLoadError(err, audio)
        app.channel.mediaSource.onLoadSuccess = (audio) => this.onLoadSuccess(audio)
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

    buildTagItems() {
        const $tag = $('#opts_wrp_tag_list')
        const keys = Object.keys(this.items)
        var i = 0
        keys.forEach(k => {
            const { item, $item } = this.buildListItem(
                unquote(k),
                i,
                { count: this.items[k].length }
            )
            i++
            $tag.append($item)
            this.initBtn($tag, $item, this.items[k])
        })
        return this
    }

    buildNamesItems(containerId, itemsByName) {
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
            $container.append($item)
            btns[name] = $item
            this.initBtn($container, $item, itemsByName[name])
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
        this.buildNamesItems('opts_wrp_lang_list', this.itemsByLang)
        return this
    }

    buildArtItems() {
        this.buildNamesItems('opts_wrp_art_list', this.itemsByArtists)
        return this
    }

    isArtistRadio(r) {
        if (r == null || r.url == null) return false
        const st = this.getSettings()
        var res = false
        st.artistUrlFilters.forEach(x => {
            if (r.url != null && r.url.startsWith(x)) {
                res = true
                return
            }
        })
        return res
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
            $rad.append($item)
            this.initItemRad($rad, $item, n)
        })
    }

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

    updateRadList(lst) {
        const $rad = $('#wrp_radio_list')
        $rad.find('*').remove()
        this.buildRadListItems(lst)
        this.filteredListCount = lst.length
        this.updateBindings()
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
        this.updateRadList(this.itemsAll)
    }

    noImage() {
        const $i = $('#wrp_img')
        $i[0].src = './img/icon.ico'
        $i.addClass('wrp-img-half')
        $i.removeClass('hidden')
        this.ignoreNextShowImage = true
    }

    showImage() {
        const $i = $('#wrp_img')
        if (!this.ignoreNextShowImage)
            $i.removeClass('wrp-img-half')
        const noimg = $i.hasClass('wrp-img-half')
        $i.removeClass('ptransparent')
        $i.removeClass('hidden')
        var iw = $i[0].width
        var ih = $i[0].height
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

        this.ignoreNextShowImage = false
        ui.tabs.selectTab('btn_wrp_logo', this.tabs)
        this.onTabChanged($('#btn_wrp_logo'))
    }

    initBtn($container, $item, t) {
        $item.on('click', () => {
            this.clearFilters()
            $item.addClass('item-selected')
            this.updateRadList(t)
        })
    }

    initItemRad($rad, $item, o) {
        $item.on('click', () => {

            $rad.find('.item-selected')
                .removeClass('item-selected')
            $item.addClass('item-selected')

            $('#wrp_radio_url').text(o.url)
            $('#wrp_radio_name').text(o.name)
            $('#wrp_radio_box').text(o.groups.join(' '))

            if (o.logo != null && o.logo !== undefined && o.logo != '') {
                const $i = $('#wrp_img')
                $i.addClass('ptransparent')
                $i.attr('width', null)
                $i.attr('height', null)
                $i.attr('src', o.logo)
            } else {
                i.addClass('ptransparent')
                $i.attr('width', null)
                $i.attr('height', null)
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

                const pl = () => {
                    this.updatePauseView()
                    app.updateChannelMedia(
                        ui.getCurrentChannel(),
                        o.url
                    )
                    const tid = setTimeout(() => this.addToHistory(o),
                        this.getSettings().addToHistoryDelay
                    )
                    if (this.addToHistoryTimer != null)
                        clearTimeout(this.addToHistoryTimer)
                    this.addToHistoryTimer = tid
                }

                if (oscilloscope.pause)
                    app.toggleOPause(() => pl())
                else
                    pl()
            }

        })
    }

    addToHistory(o) {
        o.listenDate = Date.now
        if (this.history.includes(o)) return
        const $pl = $('#opts_wrp_play_list')

        this.history.unshift(o)

        const { item, $item } = this.buildListItem(
            o.name,
            this.history.length - 1,
            { data: o }
        )
        $pl.prepend($item)
        this.initBtn($pl, $item, [o])
    }

    radioItem(name, groupName, url, logo) {
        return {
            name: name,
            description: null,
            groupTitle: groupName,
            groups: [],
            url: url,
            logo: logo,
            artist: null,
            country: null,
            lang: null,
            bitRate: null,
            channels: null,
            encode: null,
            listenDate: null
        }
    }

    setData(dataId, text) {
        if (dataId != WebRadioPickerDataId) return
        var t = text.split('\n')
        var j = 1
        var n = t.length
        while (j < n) {
            /*
            #EXTINF:-1 tvg-logo="https://kuasark.com/files/stations-logos/aordreamer.png" group-title="(.*),(.*),",AORDreamer
            http://178.33.33.176:8060/stream1
            #EXTINF:-1 tvg-logo="http://hdmais.com.br/universitariafm/wp-content/themes/theme48301/favicon.ico" group-title="Educacao,Universidade",UFC Rádio Universitária 107.9
            http://200.129.35.230:8081/;?type=http&nocache=2705
            */
            var extinf = t[j]
            var i = extinf.lastIndexOf(',')
            const name = extinf.substr(i + 1)

            extinf = extinf.substr(0, i - 1)
            i = extinf.indexOf('group-title="')
            var groupTitle = extinf.substr(i + 13)

            extinf = extinf.substr(0, i - 1)
            i = extinf.indexOf('tvg-logo="')
            const logo = extinf.substr(i + 10).slice(0, -1)

            const url = t[j + 1]
            if (groupTitle.endsWith(','))
                groupTitle = groupTitle.slice(0, -1)

            if (groupTitle.startsWith('(.*)')
                || groupTitle == ''
                || groupTitle == '"'
                || groupTitle == ',')
                groupTitle = WRP_Unknown_Group_Label

            const item = this.radioItem(name, groupTitle, url, logo)

            this.itemsByName['"' + name + '"'] = item
            this.itemsAll.push(item)
            this.listCount++

            if (this.isArtistRadio(item)) {
                if (this.itemsByArtists[name] === undefined)
                    this.itemsByArtists[name] = []
                item.artist = name
                item.groupTitle = groupTitle = WRP_Artists_Group_Label
                this.itemsByArtists[name].push(item)
            }

            const grps = groupTitle.split(',')
            var trgrps = []
            grps.forEach(g => {
                g = this.normalizeGroupName(g, item)
                if (g != null)
                    trgrps.push(g)
            })

            trgrps.forEach(grp => {
                var g = grp

                if (g != WRP_Unknown_Group_Label || grps.length == 1) {
                    // don't put in WRP_Unknown_Group_Label group if in another group
                    item.groups.push(g)

                    g = '"' + g + '"'
                    if (g != null && g != '') {
                        if (this.items[g] === undefined)
                            this.items[g] = []
                        try {
                            this.items[g].push(item)
                        } catch (err) {
                            console.log(err)
                        }
                    }
                    else {
                        console.log(g)
                    }
                }
            })
            item.groups.sort((a, b) => a.localeCompare(b))

            j += 2
        }

        // arrange 'unclassified' group
        this.groupUnclassified()

        // add tag lang
        this.groupByLang()

        // sorts

        this.itemsAll.sort((a, b) => a.name.localeCompare(b.name))

        this.items = this.sortKT(this.items)
        this.itemsByArtists = this.sortKT(this.itemsByArtists)
        this.itemsByLang = this.sortKT(this.itemsByLang)

        this.filteredListCount = this.listCount
    }

    addByKey(k, t, e) {
        if (t[k] === undefined)
            t[k] = []
        t[k].push(e)
    }

    removeByKey(k, t, e) {
        if (t[k] === undefined) return
        const tt = t[k]
        remove(tt, e)
    }

    unclassifiedToTag(tag, item) {
        tag = toUpperCaseWorldsFirstLetters(tag)
        if (item.groups.includes(tag)) return

        const gtag = quote(tag)
        this.addByKey(gtag, this.items, item)

        const nogrp = toUpperCaseWorldsFirstLetters(WRP_Unknown_Group_Label)
        const g = quote(nogrp)
        this.removeByKey(g, this.items, item)
        remove(item.groups, nogrp)

        item.groups.push(tag)
    }

    unclassifiedToLang(lang, item) {
        lang = toUpperCaseWorldsFirstLetters(lang)
        if (item.groups.includes(lang)) return

        this.addByKey(lang, this.itemsByLang, item)
        item.lang = lang

        const nogrp = toUpperCaseWorldsFirstLetters(WRP_Unknown_Group_Label)
        const g = quote(nogrp)
        this.removeByKey(g, this.items, item)
        remove(item.groups, nogrp)

        item.groups.push(lang)
    }

    addTagLang(lang, item) {
        this.unclassifiedToLang(lang, item)
    }

    groupByLang() {
        const st = this.getSettings()
        this.itemsAll.forEach(item => {
            const stw = item.name.toLowerCase()
            const tw = stw.split(' ')
            tw.forEach(word => {
                // existing langs
                st.tagToLang.forEach(tl => {
                    if (tl.includes(word))
                        this.addTagLang(tl[0], item)
                    tl.forEach(tgl => {
                        if (stw == tgl)
                            this.addTagLang(tl[0], item)
                    })
                })
            })
        })
    }

    groupUnclassified() {
        const g = quote(toUpperCaseWorldsFirstLetters(WRP_Unknown_Group_Label))
        const t = [...this.items[g]]
        const st = this.getSettings()
        const tags = Object.keys(this.items)
            .map(x => unquote(x.toLowerCase()))

        // new tags from settings

        var i = 0
        t.forEach(item => {

            const stw = item.name.toLowerCase()
            const tw = stw.split(' ')

            tw.forEach(word => {

                // eventuallly build new tags
                if (st.wordToTag.includes(word))
                    this.unclassifiedToTag(word, item)

                // existing tags
                if (tags.includes(word))
                    this.unclassifiedToTag(word, item)

                // existing langs
                st.tagToLang.forEach(tl => {
                    if (tl.includes(word))
                        this.unclassifiedToLang(tl[0], item)
                })

                // word similarities
                st.tagSimilarities.forEach(sm => {
                    if (sm.includes(word))
                        this.unclassifiedToTag(sm[0], item)
                })
            })
            i++
        })
    }

    sortKT(ar) {
        var keys = Object.keys(ar)
        keys.sort((a, b) => a.localeCompare(b))
        const res = []
        keys.forEach(k => {
            const t = ar[k].sort((a, b) => a.name.localeCompare(b.name))
            res[k] = t
        })
        return res
    }

    normalizeGroupName(g, radioItem) {
        if (g == null || g == '' || g == '*' || g == '"') g = WRP_Unknown_Group_Label

        // case
        g = g.toLowerCase()

        // special
        if (g.startsWith('http://')
            || g.startsWith('https://')) g = WRP_Unknown_Group_Label

        // substitutions
        const st = this.getSettings()
        st.tagSimilarities.some(t => {
            if (t.includes(g)) {
                g = t[0]
                return true
            }
            else
                return false
        })

        // to lang
        st.tagToLang.some(tl => {
            if (tl.includes(g)) {
                g = toUpperCaseWorldsFirstLetters(tl[0])
                if (this.itemsByLang[g] === undefined)
                    this.itemsByLang[g] = []
                this.itemsByLang[g].push(radioItem)
                radioItem.groups.push(g)
                radioItem.lang = g
                // remove tag
                g = null
                return true
            }
            else return false
        })
        if (g == null) return null

        // to artist
        if (st.tagToArtist.includes(g)) {
            g = toUpperCaseWorldsFirstLetters(g)
            if (this.itemsByArtists[g] === undefined)
                this.itemsByArtists[g] = []
            radioItem.artist = g
            radioItem.groupTitle += ',' + WRP_Artists_Group_Label
            this.itemsByArtists[g].push(radioItem)
            // tag Artists
            g = WRP_Artists_Group_Label
            g = toUpperCaseWorldsFirstLetters(g)
            return g
        }

        // deletions
        if (st.removeTags.includes(g))
            // remove tag
            return null

        g = toUpperCaseWorldsFirstLetters(g)
        return g
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
