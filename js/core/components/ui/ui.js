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
            if (oscilloscope.pause)
                app.requestAnimationFrame();
        });
        // properties
        $('input').attr('autocomplete', 'off');
        // bindins
        this.bindings.bind(this.bindings.binding(
            'app_ver',
            'settings.app.version',
            { readOnly: true, attr: 'text' }));
        // menus & popups
        this.oscilloMenu.initMenu();
        this.popups.init_popups();
        this.popupSettings.init()
        this.channels.popupSettings.init()
    },

    viewSize() {
        const html = document.querySelector('html');
        return { width: html.clientWidth, height: html.clientHeight };
    },

    setupCanvasSize(canvas) {
        const vs = this.viewSize();
        const htmlWidth = vs.width;
        const htmlHeight = vs.height;
        var updated = false;
        // auto size canvas (maximize)
        if (canvas.width !== htmlWidth - settings.ui.clientWidthBorder) {
            canvas.width = htmlWidth - settings.ui.clientWidthBorder;
            updated = true;
        }
        if (canvas.height !== htmlHeight - settings.ui.clientHeightBorder) {
            canvas.height = htmlHeight - settings.ui.clientHeightBorder;
            updated = true;
        }
        return updated;
    },

    checkSizeChanged() {
        const html = document.querySelector('html');
        const htmlWidth = html.clientWidth;
        const htmlHeight = html.clientHeight;
        var updated =
            canvas.width !== htmlWidth - settings.ui.clientWidthBorder
            || canvas.height !== htmlHeight - settings.ui.clientHeightBorder;
        return updated;
    }
}
