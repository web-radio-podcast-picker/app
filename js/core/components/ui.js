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

        // close
        $('#btn_closech_' + channel)
            .on('click', () => {
                app.deleteChannel(channel);
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
    },

    addControls(channel) {
        var $model = $('#channel-pane').clone();
        $model.removeClass('hidden');
        const id = channel.channelId;
        $model.attr('id', 'channel-pane_' + id);
        const colors = settings.oscilloscope.channels.colors;
        const colLength = colors.length;
        const colIndex = (id - 1) % colLength;
        const col = colors[colIndex];
        $model.css('color', col);
        channel.color = col;
        $model.find('#channel-label').text('CH' + channel.channelId);
        var $elems = $model.find('*');
        $.each($elems, (i, e) => {
            var $e = $(e);
            var eid = $e.attr('id');
            if (eid !== undefined && eid.endsWith('_')) {
                $e.attr('id', eid + id);
            }
            if ($e.hasClass('channel-label')) {
                $e.css('background-color', col);
            }
        });
        $('#top-panes').append($model);
    },

    removeControls(channel) {
        // remove the controls of a channel
        var $ctlr = $('#channel-pane_' + channel.channelId);
        $ctlr.remove();
    }

}