// ui

ui = {

    oscilloscope: null, // reference to the oscilloscope manager

    init(oscilloscope) {
        this.oscilloscope = oscilloscope;
        this.oscilloscope.channels.forEach(channel => {
            this.init_btns(channel.channelId, channel.view);
        });
        console.log("UI initialized");
    },

    init_btns(channel, sigView) {
        // Initialize buttons and other UI elements

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

        // menu buttons
        $('#btn_menu').on('click', () => {
            $('#top-right-menu-body').toggleClass('hidden');
        });
    }
}