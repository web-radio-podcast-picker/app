/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class PlayEventsHandlers {

    wrpp = null

    init(wrpp) {
        this.wrpp = wrpp
        return this
    }

    initAudioSourceHandlers() {
        WRPPMediaSource.onLoadError = (err, audio) => this.onLoadError(err, audio)
        WRPPMediaSource.onLoadSuccess = (audio) => this.onLoadSuccess(audio)
        WRPPMediaSource.onCanPlay = (audio) => this.onCanPlay(audio)
    }

    onLoading(item) {
        // TODO: change call target
        this.wrpp.setPlayPauseButtonFreezeState(true)
        const st = 'connecting...'
        if (settings.debug.debug) {
            logger.log(st)
        }
        // TODO: change call target
        this.wrpp.updateLoadingRadItem(st)

        app.channel.connected = false
        $('#wrp_connected_icon').addClass('hidden')
        $('#wrp_connect_error_icon').addClass('hidden')
        $('#wrp_connect_icon').removeClass('hidden')
    }

    onLoadError(err, audio) {
        const st = 'no connection'
        if (settings.debug.debug) {
            logger.log(st)
        }
        // TODO: change call target
        this.wrpp.updateLoadingRadItem(st)

        app.channel.connected = false
        $('#wrp_connected_icon').addClass('hidden')
        $('#wrp_connect_icon').addClass('hidden')
        $('#wrp_connect_error_icon').removeClass('hidden')
        $('#err_txt').text(st)
        $('#err_holder').removeClass('hidden')
    }

    onLoadSuccess(audio) {
        const st = 'connected'
        app.channel.connected = true
        // TODO: change call target
        this.wrpp.updateLoadingRadItem(st)

        // metatadata available: audio.duration

        if (settings.debug.debug) {
            logger.log(st)
            logger.log('duration:' + audio.duration)
        }
        $('#wrp_connect_icon').addClass('hidden')
        $('#wrp_connect_error_icon').addClass('hidden')
        $('#wrp_connected_icon').removeClass('hidden')

        // enable save to history list

        const o = this.wrpp.uiState.currentRDItem
        if (o != null) {

            window.audio = audio
            o.metadata = {
                duration: audio.duration
            }
            this.wrpp.history.setupAddToHistoryTimer(o)
        }
    }

    onCanPlay(audio) {
        // TODO: change call target
        this.wrpp.setPlayPauseButtonFreezeState(false)
        const st = 'playing'
        if (settings.debug.debug) {
            logger.log(st)
        }
        // TODO: change call target
        this.wrpp.updateLoadingRadItem(st)
    }

    onPauseStateChanged(updateRadItemStatusText, $item) {
        if (updateRadItemStatusText)
            // TODO: change call target
            this.wrpp.updateLoadingRadItem(oscilloscope.pause ?
                'pause' : 'playing', $item)
        if (oscilloscope.pause)
            this.wrpp.history.clearHistoryTimer()
        // TODO: change call target
        this.wrpp.updatePauseView()
    }
}