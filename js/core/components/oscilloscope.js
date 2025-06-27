// oscilloscope manager

oscilloscope = {

    channels: [],             // array of channels
    audioContext: null,       // audio context for processing

    lastStartTime: null,      // last start time for visualization
    startTime: null,          // start time for visualization
    endTime: null,            // end time for visualization
    scanPeriod: null,         // scan period (in ms, eg view period)
    scanFrq: null,            // scan frequency (in Hz, eg 1000 ms / view period)

    addChannel(channel) {
        // add a channel to the oscilloscope
        channel.view.init(app.canvas, channel);
        this.channels.push(channel);
        // add controls for the Channel
        this.addControls(channel);
    },

    addControls(channel) {
        var $model = $('#channel-pane').clone();
        $model.removeClass('hidden');
        const id = channel.channelId;
        const colors = settings.oscilloscope.channels.colors;
        const colLength = colors.length;
        const colIndex = colLength % id;
        const col = colors[colIndex];
        $model.css('color', col);
        var $elems = $model.find('*');
        $.each($elems, (i, e) => {
            var $e = $(e);
            var id = $e.attr('id');
            if (id !== undefined && id.endsWith('_')) {
                $e.attr('id', id + channel.channelId);
            }
            if ($e.hasClass('channel-label')) {
                $e.css('background-color', col);
            }
        });
        $('#top-panes').append($model);
    },

    async createChannel(sourceId, source) {

        // create a new channel and return it
        const channel = new Channel(this.channels.length + 1, sourceId);

        if (source != null || source != undefined) {

            // source provided
            await this.initChannelFromSource(channel, source);

        } else {
            // dynamic source from classname (sourceId)
        }

        return channel;
    },

    async initChannelFromSource(channel, source) {
        channel.source = source;
        channel.stream = await channel.source.getMediaStream();
        this.audioContext = new AudioContext(); // not before getMediaStream

        if (channel.stream != undefined) {
            if (settings.debug.info)
                console.log("Input media stream ok");

            channel.streamSource = this.audioContext.createMediaStreamSource(channel.stream);
            channel.analyzer = this.audioContext.createAnalyser();
            channel.streamSource.connect(channel.analyzer);

            if (settings.debug.info)
                console.log("Input stream set", channel.analyzer);
        }
        else {
            channel.error = "No input media stream";
            console.error(channel.error);
        }
    }
}
