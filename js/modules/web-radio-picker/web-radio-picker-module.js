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

    views = ['view.html']           // module views
    settings = ['settings.js']      // module settings
    datas = [WebRadioPickerDataId]  // module data files

    title = 'Web Radio Picker'
    icon = '☄'

    // <----- end module spec -----

    items = []
    itemsByName = []
    listCount = 0

    init() {
        const mset = settings.modules.web_radio_picker
        const dataUrl = mset.dataUrl
    }

    initView(viewId) {
        const $tag = $('#wrp_tag_list')
        const $rad = $('#wrp_radio_list')
        const keys = Object.keys(this.items)
        var i = 0
        keys.forEach(k => {
            var item = document.createElement('div')
            var $item = $(item)
            $item.addClass('wrp-list-item')
            if (i & 1)
                $item.addClass('wrp-list-item-a')
            else
                $item.addClass('wrp-list-item-b')
            i++
            $item.text(unquote(k))
            $tag[0].appendChild(item)
            this.initTagBtn($item, k)

            const t = this.items[k]
            var j = 0
            t.forEach(n => {
                var item = document.createElement('div')
                var $item = $(item)
                $item.addClass('wrp-list-item')
                $item.text(n.name)
                if (j & 1)
                    $item.addClass('wrp-list-item-a')
                else
                    $item.addClass('wrp-list-item-b')
                j++
                $rad[0].appendChild(item)
                this.initTagRad($item, n)
            })
        })
        $('#wrp_img').on('click', () => {
            $('#wrp_img_holder').addClass('hidden')
        })
    }

    initTagBtn($item, text) {
        $item.on('click', () => {

        })
    }

    initTagRad($item, o) {
        $item.on('click', () => {
            $('#wrp_radio_url').text(o.url)
            if (o.logo != null && o.logo !== undefined && o.logo != '') {
                console.log(o.logo)
                $('#wrp_img').attr('src', o.logo)
                $('#wrp_img_holder').removeClass('hidden')
            } else {
                $('#wrp_img_holder').addClass('hidden')
            }
        })
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

            const item = {
                name: name,
                groupTitle: groupTitle,
                url: url,
                logo: logo
            }

            this.itemsByName['"' + name + '"'] = item

            var grps = groupTitle.split(',')
            grps.forEach(grp => {
                var g = grp
                if (g == '"')
                    g = '*'
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
            });

            this.listCount++

            j += 2
        }
    }
}