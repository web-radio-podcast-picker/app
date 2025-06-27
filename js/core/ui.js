// ui

ui = {

    init() {
        // Initialize UI components   
        this.init_btns(1, app.signalView1);
        this.init_btns(2, app.signalView2);
        console.log("UI initialized");
    },

    init_btns(channel, sigView) {
        // Initialize buttons and other UI elements
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
    }
}