/*
    Sound card Oscilloscope | Spectrum Analyzer | Signal Generator
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// module loader

class ModuleLoader {

    modules = []

    iuri(uri) {
        return uri + '-module'
    }

    isLoaded(uri) {
        return this.modules[uri] !== undefined
    }

    // eg. ./modules/web-radio-picker
    load(uri, srcUrl, then) {

        if (uri == null) {
            ui.showError('load module failed: uri is not defined')
            return
        }

        if (this.isLoaded(uri)) {
            then(this.modules[uri])
            return
        }

        srcUrl = (srcUrl === undefined || srcUrl == null) ?
            './js/modules/' : ''

        const baseUrl = srcUrl + uri + '/'
        const url = baseUrl + this.iuri(uri) + '.js'

        var o = document.head
        var script = document.createElement('script')
        script.onload = () => {
            const cl = toClassname(uri) + 'Module'
            try {

                // instiantiate & setup module
                const o = eval('new ' + cl + '()')
                o.uri = uri
                this.setup(o, baseUrl, then)

            } catch (err_inst) {
                ui.showError('error instantiate module ' + uri + ' (' + err_inst + ')')
            }
        }
        script.onerror = e => {
            ui.showError('load module ' + uri + ' failed')
            console.log(url)
        }
        script.src = url

        o.appendChild(script)
    }

    setup(o, baseUrl, then) {
        o.validate()
        if (this.modules[o.id] !== undefined)
            throw new Error('module already plugged: ' + o.id)
        o.id = o.id + '_module' // //?

        const cnt = {
            viewsCnt: o.views.length,
            settingsCnt: o.settings.length,
            datasCnt: o.settings.length
        }
        this.loadSettings(o, cnt, baseUrl, () =>
            this.loadDatas(o, cnt, baseUrl, () =>
                this.loadViews(o, cnt, baseUrl, then)
            ))
    }

    loadSettings(o, cnt, baseUrl, then) {
        o.settings.forEach(st => {
            const d = document.createElement('div')
            const $d = $(d)
            const sc = baseUrl + st
            $d.load(sc, (response, status, xhr) => {
                if (status === "success") {

                    const cd = $d.text()
                    eval('settings.modules["' + o.id + '"] = ' + cd)
                    cnt.settingsCnt--
                    if (cnt.settingsCnt == 0) then()

                } else {
                    ui.showError('load view settings "' + sc + '" failed: ' + xhr.status + ' ' + xhr.statusText)
                }
            })
        })
    }

    loadDatas(o, cnt, baseUrl, then) {
        o.datas.forEach(st => {
            const d = document.createElement('div')
            const $d = $(d)
            const sc = baseUrl + st
            $d.load(sc, (response, status, xhr) => {
                if (status === "success") {

                    const cd = $d.text()
                    o.setData(st, cd)
                    cnt.datasCnt--
                    if (cnt.datasCnt == 0) then()

                } else {
                    ui.showError('load view datas "' + sc + '" failed: ' + xhr.status + ' ' + xhr.statusText)
                }
            })
        })
    }

    loadViews(o, cnt, baseUrl, then) {
        // load views
        o.views.forEach(viewId => {
            const sc = baseUrl + viewId
            const c = document.createElement('div')
            const $c = $(c)

            $c.load(sc, (response, status, xhr) => {
                if (status === "success") {

                    this.initView(c, viewId, o)
                    $('body')[0].appendChild(c)

                    this.modules[o.uri] = o

                    ui.popups.initPopup(
                        ui.popups.popup(o.id, null),
                        $c,
                        o.id)

                    cnt.viewsCnt--
                    if (cnt.viewsCnt == 0)
                        then(o, viewId)

                } else {
                    ui.showError('load view "' + sc + '" failed: ' + xhr.status + ' ' + xhr.statusText)
                }
            })
        })
    }

    initView(c, viewId, o) {
        const div = (cl, txt) => {
            const e = document.createElement('div')
            const $e = $(e)
            $e.addClass(cl)
            $e.text(txt)
            return e
        }

        const $c = $(c)
        $c.attr('id', o.id)
        $c.attr('data-author', o.author)
        $c.attr('data-cert', o.cert)
        $c.addClass('popup popup-pane module-pane hidden')

        const but_close = div('popup-close btn-red', '✕')
        const icon = div('popup-icon', o.icon || '⚙')
        const title = div('popup-title', o.title || o.id)

        c.appendChild(but_close)
        c.appendChild(icon)
        c.appendChild(title)

        if (c.childNodes.length > 0) {
            c.insertBefore(title, c.childNodes[0])
            c.insertBefore(icon, c.childNodes[0])
            c.insertBefore(but_close, c.childNodes[0])
        }
    }
}
