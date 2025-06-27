// ui

ui = {

    oscilloscope: null, // reference to the oscilloscope manager
    uiInitialized: false,

    init(oscilloscope) {
        this.oscilloscope = oscilloscope;
        this.oscilloscope.channels.forEach(channel => {
            if (!channel.ui) {
                this.init_btns(channel.channelId, channel.view);
                channel.ui = true;
            }
        });
        if (!this.uiInitialized) {
            this.init_ui();
            this.uiInitialized = true;
        }
        console.log("UI initialized");
    },

    init_btns(channel, sigView) {
        // Initialize buttons and other UI elements for a channel

        // channel pause buttons
        const $e = $('#btn_pause_' + channel);
        const fn = () => {
            if (!sigView.pause) {
                $e.text('||');
            } else {
                $e.text('▶');
            }
        }
        fn(); // Set initial button text
        $e.on('click', () => {
            sigView.pause = !sigView.pause;
            fn();
        });
    },

    init_ui() {
        // menu buttons
        $('#btn_menu').on('click', () => {
            $('#top-right-menu-body').toggleClass('hidden');
        });
        $('#btn_add_ch').on('click', async () => {
            await app.addChannel();
        });
    }
}