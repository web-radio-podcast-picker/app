/*
    Sound card Oscilloscope | Spectrum Analyzer | Signal Generator
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

const WebRadioPickerDataId = 'all_stations.m3u'

// module: web radio picker

class WebRadioPickerModule extends ModuleBase {

    // ----- module spec ----->

    id = 'web_radio_picker'         // unique id
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
    itemsAll = []           // all items
    listCount = 0
    filteredListCount = 0
    grpLisdtIndex = 0
    tabs = ['btn_wrp_tag_list',
        'btn_wrp_art_list',
        'btn_wrp_logo']
    ignoreNextShowImage = false

    init() {
        const mset = settings.modules.web_radio_picker
        const dataUrl = mset.dataUrl
    }

    initTabs() {
        ui.tabs.initTabs(this.tabs)
    }

    initView(viewId) {

        this.initTabs()
        this.buildTagItems()
            .buildArtItems()
            .buildRadItems()

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

        // modules are late binded. have the responsability to init bindings
        this.updateBindings()
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
            this.initTagBtn($tag, $item, k)
        })
        return this
    }

    buildArtItems() {
        const $art = $('#opts_wrp_art_list')
        const keys = Object.keys(this.items)
        var i = 0
        const artId = (name) => 'wrp_' + name
        const artBtns = []

        keys.forEach(k => {
            i++
            const t = this.items[k]
            var j = 0
            t.forEach(n => {

                if (this.isArtistRadio(n)) {
                    const { item, $item } = this.buildListItem(
                        n.name,
                        j,
                        {
                            count: ''
                        })
                    j++
                    $art.append($item)

                    if (this.itemsByArtists[n.name] === undefined)
                        this.itemsByArtists[n.name] = []
                    this.itemsByArtists[n.name].push(n)

                    artBtns[n.name] = $item

                    this.initArtBtn($art, $item, n.name)
                }
            })
        })

        const arts = Object.keys(this.itemsByArtists)
        arts.forEach(artName => {
            const cnt = this.itemsByArtists[artName].length
            this.setupItemOptions(
                artBtns[artName],
                {
                    count: cnt
                }
            )
        })

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
        const $rad = $('#wrp_radio_list')
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

    clearArtFilters() {
        const $art = $('#opts_wrp_art_list')
        $art.find('.item-selected')
            .removeClass('item-selected')
    }

    clearTagFilters() {
        const $tag = $('#opts_wrp_tag_list')
        $tag.find('.item-selected')
            .removeClass('item-selected')
    }

    clearFilters() {
        this.clearArtFilters()
        this.clearTagFilters()
    }

    allRadios() {
        this.clearFilters()
        this.updateRadList(this.itemsAll)
    }

    noImage() {
        const $i = $('#wrp_img')
        $i[0].src = './img/icon.ico'
        $i.addClass('wrp-img-half')
        this.ignoreNextShowImage = true
    }

    showImage() {
        const $i = $('#wrp_img')
        if (!this.ignoreNextShowImage)
            $i.removeClass('wrp-img-half')
        this.ignoreNextShowImage = false
        ui.tabs.selectTab('btn_wrp_logo', this.tabs)
    }

    initTagBtn($tag, $item, grpName) {
        $item.on('click', () => {
            this.clearFilters()
            $item.addClass('item-selected')
            this.updateRadList(this.items[grpName])
        })
    }

    initArtBtn($art, $item, artName) {
        $item.on('click', () => {
            this.clearFilters()
            $item.addClass('item-selected')
            this.updateRadList(this.itemsByArtists[artName])
        })
    }

    initItemRad($rad, $item, o) {
        $item.on('click', () => {

            $rad.find('.item-selected')
                .removeClass('item-selected')
            $item.addClass('item-selected')

            $('#wrp_radio_url').text(o.url)
            $('#wrp_radio_name').text(o.name)
            const groups = o.groupTitle?.split(',')
            $('#wrp_radio_box').text(groups.join(' '))

            if (o.logo != null && o.logo !== undefined && o.logo != '') {
                $('#wrp_img').attr('src', o.logo)
                const channel = ui.getCurrentChannel()
                if (channel != null && channel !== undefined) {
                    this.loading = o
                    app.updateChannelMedia(
                        ui.getCurrentChannel(),
                        o.url
                    )
                }
            } else {
                this.noImage()
            }
        })
    }

    radioItem(name, groupName, url, logo) {
        return {
            name: name,
            groupTitle: groupName,
            url: url,
            logo: logo,
            artist: null,
            country: null,
            lang: null,
            bitRate: null,
            channels: null,
            encode: null
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
                groupTitle = "*"

            const item = this.radioItem(name, groupTitle, url, logo)

            this.itemsByName['"' + name + '"'] = item
            this.itemsAll.push(item)
            this.listCount++

            var grps = groupTitle.split(',')
            grps.forEach(grp => {
                var g = grp
                if (g == '"')
                    g = '*'

                if (g != '*' || grps.length == 1) {
                    // don't put in '*' group if in another group

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

            j += 2
        }
        this.itemsAll.sort((a, b) => a.name.localeCompare(b.name))
        var keys = Object.keys(this.items)
        keys.sort((a, b) => a.localeCompare(b))
        const items = { ...this.items }
        this.items = []
        keys.forEach(k => {
            const t = items[k].sort((a, b) => a.name.localeCompare(b.name))
            this.items[k] = t
        })

        this.filteredListCount = this.listCount
    }
}
