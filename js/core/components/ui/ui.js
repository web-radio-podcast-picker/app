/*
    Web Radio Podcast Picker
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
    errExcludes: ['AbortError'],
    errReplaces: [['NotSupportedError', 'no connection']],

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
        }
    },

    setupScreen() {
        screen.orientation.addEventListener('change', () => this.updateOrientation())
        if (screen.lockOrientation) screen.lockOrientation(Screen_Orientation_Landscape)
        document.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        })
        const offIconId = 'wrp_fullscreen_off'
        const onIconId = 'wrp_fullscreen_on'
        document.addEventListener('fullscreenchange', () => {
            if (settings.debug.trace)
                console.log('fullscreen changed')
            if (document.fullscreenElement) {
                $('#' + offIconId).removeClass('hidden')
                $('#' + onIconId).addClass('hidden')
            } else {
                $('#' + onIconId).removeClass('hidden')
                $('#' + offIconId).addClass('hidden')
            }
        })
    },

    initRotateYourDevicePopup() {
        const pid = 'ryd_popup'
        const $popup = $('#' + pid)
    },

    showRotateYourDevicePopup() {
        const pid = 'ryd_popup'
        const $popup = $('#' + pid)
        $popup.removeClass('hidden')
    },

    hideRotateYourDevicePopup() {
        const pid = 'ryd_popup'
        const $popup = $('#' + pid)
        $popup.addClass('hidden')
    },

    init_intro() {
        this.setupScreen()
        this.popups.init_popups()
        this.initRotateYourDevicePopup()
        this.updateOrientation()

        const pid = 'intro_popup'
        const $popup = $('#' + pid)

        $('#sys_app_ver').text(settings.app.kernel.version)
        $('#sys_app_ver_date').text(settings.app.kernel.verDate)
        $('#wrp_app_ver').text(settings.app.wrp.version)
        $('#wrp_app_ver_date').text(settings.app.wrp.verDate)

        this.popups.updatePopupPositionAndSize(null, $popup, null)
        $popup.addClass('opaque')
        $popup.removeClass('transparent')

        $popup.on('click', () => {
            this.hide_intro_popup()
            cui.setFullscreen(true)
            setTimeout(() => {
                $('.module-full-pane').removeClass('transparent')
            }, 200)
        })
    },

    hide_intro() {
        setTimeout(() => {
            this.hide_intro_popup()
        }, settings.ui.introPopupDelay)
    },

    hide_intro_popup() {
        const pid = 'intro_popup'
        const $popup = $('#' + pid)
        //$popup.fadeOut(settings.ui.fadeOutDelay)
        $popup.addClass("hidden")
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
        ///this.popups.init_popups()
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
        var novis = false
        this.errExcludes.forEach(e => {
            try {
                const m = messOrEvent.toString()
                novis |= m.startsWith(e)
            } catch (err) { }
        })
        if (!novis) {

            this.errReplaces.forEach(t => {
                try {
                    const m = messOrEvent.toString()
                    if (m.startsWith(t[0]))
                        messOrEvent = t[1]
                } catch (err) { }
            })

            $('#err_holder')
                .removeClass('hidden')
            const $e = $('#err_txt')
            $e.text(messOrEvent)
            $e.removeClass('hidden')
        }
        console.error(messOrEvent)

        /*  // auto hide timer
            setTimeout(() => {
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
    },

    updateOrientation() {
        const or = this.getOrientation()
        if (or != Screen_Orientation_Landscape)
            this.showRotateYourDevicePopup()
        else
            this.hideRotateYourDevicePopup()
    },

    getOrientation() {
        const orientation = screen.orientation.type;
        var ori = ''
        if (orientation.includes('portrait')) {
            ori = Screen_Orientation_Portrait
        } else if (orientation.includes('landscape')) {
            ori = Screen_Orientation_Landscape
        }
        return ori
    }
}
