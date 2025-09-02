/*
    Web Radio | Podcast
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// ui

ui = {

    oscilloscope: null,     // reference to the oscilloscope manager
    initialized: false,     // object initialized
    uiInitialized: false,   // indicates if ui is already globally initialized
    popupId: null,          // any id of an html popupId currently opened/showed
    popupCtrlId: null,      // popup control placement if any else null
    bindings: new Bindings(),
    toggles: new Toggles(),
    popups: new Popups(),
    oscilloMenu: new OscilloMenu(),
    channels: new Channels(),
    popupSettings: new PopupSettings(),
    inputWidgets: new InputWidgets(),
    tabs: new Tabs(),

    init(oscilloscope) {

        this.oscilloscope = oscilloscope

        this.oscilloscope.channels.forEach(channel => {
            if (!channel.ui) {
                this.channels.init_channel_btns(channel, channel.view)
                channel.ui = true
            }
        });

        if (!this.uiInitialized) {
            this.init_ui()
            this.uiInitialized = true
            console.log("UI initialized")
            //this.hide_intro()
        }
    },

    init_intro() {
        const pid = 'intro_popup'
        const $popup = $('#' + pid)
        /*if (cui.isSmallDisplay()) {
            $popup.addClass('hidden')
            return
        }*/
        $('#sys_app_ver').text(settings.app.version)
        $('#app_ver_date').text(settings.app.verDate)
        this.popups.updatePopupPositionAndSize(null, $popup, null)
        $popup.removeClass('ptransparent')

        $popup.on('click', () => {

            cui.setFullscreen(true)

            app.openModule('web-radio-picker',
                app.moduleLoader.opts(
                    'wrp_mod_inf_txt_inview',
                    'wrp_mod_err_txt_inview'
                )
            )
            this.hide_intro_popup()
        })
    },

    hide_intro() {
        //if (cui.isSmallDisplay()) return
        setTimeout(() => {
            this.hide_intro_popup()
        }, settings.ui.introPopupDelay)
    },

    hide_intro_popup() {
        const pid = 'intro_popup'
        const $popup = $('#' + pid)
        $popup.fadeOut(settings.ui.fadeOutDelay)
    },

    init_ui() {

        // events
        $(window).resize(() => {
            //oscilloscope.refreshView()
            this.popups.updatePopupsPositionAndSize()
        })
        window.onerror = (messOrEvent, src, line, col, err) => {
            this.showError(messOrEvent, src, line, col, err)
        }

        // properties
        $('input').attr('autocomplete', 'off')

        // bindings
        this
            .bindings.bind(this.bindings.binding(
                'app_ver',
                'settings.app.version',
                { readOnly: true, attr: 'text' }))
            .bindings.bind(this.bindings.binding(
                'app_ver_date',
                'settings.app.verDate',
                { readOnly: true, attr: 'text' }))

        const $c = $('#err_txt')
        $c.on('click', () => {
            $c.text('')
        })

        // menus & popups
        this.oscilloMenu.initMenu()
        this.popups.init_popups()
        this.popupSettings.init()
        this.channels.popupSettings.init()
    },

    getCurrentChannel() {
        return this.channels.popupSettings.editChannel
    },

    getCurrentChannelPath(subPath) {
        return 'ui.channels.popupSettings.editChannel.'
            + ((subPath == null || subPath === undefined) ?
                '' : subPath)
    },

    setupCanvasSize(canvas) {
        const vs = cui.viewSize()
        const htmlWidth = vs.width
        const htmlHeight = vs.height
        var updated = false
        // auto size canvas (maximize)
        if (canvas.width !== htmlWidth) {
            canvas.width = htmlWidth
            updated = true
        }
        if (canvas.height !== htmlHeight) {
            canvas.height = htmlHeight
            updated = true
        }
        return updated
    },

    setupUIComponents() {
        const vs = cui.viewSize()
        const w = vs.width
        const h = vs.height

        // buttons bars

        var $b = $('#buttons_bar')
        const nbButtons = 2
        var left = w - 42 * nbButtons - 118 - 7 * (nbButtons + 1)
        var top = h + settings.ui.buttonBarRelY
        $b.css('left', left + 'px')
        $b.css('top', top + 'px')
        $b.removeClass('hidden')

        $b = $('#buttons_bar2')
        left = w - 118 + 7 + 5 - 4
        $b.css('left', left + 'px')
        $b.css('top', top + 'px')
        $b.removeClass('hidden')

        // bottom views

        var $p = $('#bottom-pane')
        $p.css('left', 50 + 'px')
        var btop = h + settings.ui.infoBarRelY
        $p.css('top', btop + 'px')
        $p.removeClass('hidden')

        const $p2 = $('#right_bottom_pane')
        $p2.css('left', w - 25 * 7 + 'px')
        $p2.css('top', btop + 'px')
        $p2.removeClass('hidden')

        // information

        $p = $('#error_pane')
        $p.css('left', 50 + 'px')
        var btop2 = h + settings.ui.errorBarRelY
        $p.css('top', btop2 + 'px')
        $p.removeClass('hidden')

        // test
        if (false) {
            $p = $('#fft_axe_bottom_pane')
            $p.css('left', 50 + 'px')
            btop = h + settings.ui.fftAxeRelY
            $p.css('top', btop + 'px')
            $p.removeClass('hidden')
        }

        $('#main_menu').removeClass('hidden')

        this.popups.updatePopupsPositionAndSize()
    },

    showError(messOrEvent, src, line, col, err) {
        window.err = {
            messOrEvent: messOrEvent,
            src: src,
            line: line,
            col: col,
            err: err
        }
        $('#err_holder')
            .removeClass('hidden')
        const $e = $('#err_txt')
        $e.text(messOrEvent)
        $e.removeClass('hidden')
        console.error(messOrEvent)
        /*setTimeout(() => {
            $e.text('')
        }, settings.ui.errDisplayTime)*/
    },

    checkSizeChanged() {
        const html = document.querySelector('html')
        const htmlWidth = html.clientWidth
        const htmlHeight = html.clientHeight
        var updated =
            canvas.width !== htmlWidth
            || canvas.height !== htmlHeight
        return updated
    }
}
