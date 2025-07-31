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

        this.oscilloscope = oscilloscope;

        this.oscilloscope.channels.forEach(channel => {
            if (!channel.ui) {
                this.channels.init_channel_btns(channel, channel.view);
                channel.ui = true;
            }
        });

        if (!this.uiInitialized) {
            this.init_ui();
            this.uiInitialized = true;
            console.log("UI initialized");
        }
    },

    init_ui() {

        // events
        $(window).resize(() => {
            oscilloscope.refreshView()
        })
        window.onerror = (messOrEvent, src, line, col, err) => {
            this.showError(messOrEvent, src, line, col, err)
        }

        // properties
        $('input').attr('autocomplete', 'off');

        // bindings
        this.bindings.bind(this.bindings.binding(
            'app_ver',
            'settings.app.version',
            { readOnly: true, attr: 'text' }));

        const $c = $('#err_txt')
        $c.on('click', () => {
            $c.text('')
            x + 3
        })

        // menus & popups
        this.oscilloMenu.initMenu();
        this.popups.init_popups();
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

    viewSize() {
        const html = document.querySelector('html');
        return {
            width: html.clientWidth - settings.ui.clientWidthBorder,
            height: html.clientHeight - settings.ui.clientHeightBorder
        };
    },

    setupCanvasSize(canvas) {
        const vs = this.viewSize()
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
        return updated;
    },

    setupUIComponents() {
        const vs = this.viewSize()
        const w = vs.width
        const h = vs.height

        var $b = $('#buttons_bar')
        const nbButtons = 1
        var left = w - 118 * nbButtons - 118 + 7
        var top = h - 42 - 7 * 7 + 5 * 7
        $b.css('left', left + 'px')
        $b.css('top', top + 'px')
        $b.removeClass('hidden')

        $b = $('#buttons_bar2')
        left = w - 118 + 7 + 5
        $b.css('left', left + 'px')
        $b.css('top', top + 'px')
        $b.removeClass('hidden')

        var $p = $('#bottom-pane')
        $p.css('left', 50 + 'px')
        var btop = h - 21 - 7 * 6
        $p.css('top', btop + 'px')
        $p.removeClass('hidden')

        var $p = $('#error_pane')
        $p.css('left', 50 + 'px')
        btop = h - 21 - 7 * 10
        $p.css('top', btop + 'px')
        $p.removeClass('hidden')

        const $p2 = $('#right_bottom_pane')
        $p2.css('left', w - 25 * 7 + 'px')
        $p2.css('top', btop + 'px')
        $p2.removeClass('hidden')

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
        $('#err_txt').text(messOrEvent)
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
