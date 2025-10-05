/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class PlayEventsHandlers {

    initAudioSourceHandlers() {
        WRPPMediaSource.onLoadError = (err, audio) => this.onLoadError(err, audio)
        WRPPMediaSource.onLoadSuccess = (audio) => this.onLoadSuccess(audio)
        WRPPMediaSource.onCanPlay = (audio) => this.onCanPlay(audio)
    }

    onLoading(item) {
        uiState.setPlayPauseButtonFreezeState(true)
        const st = 'connecting...'
        if (settings.debug.debug) {
            logger.log(st)
        }
        radsItems.updateLoadingRadItem(st)

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
        radsItems.updateLoadingRadItem(st)

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
        radsItems.updateLoadingRadItem(st)

        // metatadata available: audio.duration

        if (settings.debug.debug) {
            logger.log(st)
            logger.log('duration:' + audio.duration)
        }
        $('#wrp_connect_icon').addClass('hidden')
        $('#wrp_connect_error_icon').addClass('hidden')
        $('#wrp_connected_icon').removeClass('hidden')

        // enable save to history list

        const o = uiState.currentRDItem
        if (o != null) {

            window.audio = audio
            o.metadata = {
                duration: audio.duration
            }
            playHistory.setupAddToHistoryTimer(o)
        }
    }

    onCanPlay(audio) {
        uiState.setPlayPauseButtonFreezeState(false)
        const st = 'playing'
        if (settings.debug.debug) {
            logger.log(st)
        }
        radsItems.updateLoadingRadItem(st)
    }

    onPauseStateChanged(updateRadItemStatusText, item, $item) {
        if (updateRadItemStatusText)
            radsItems.updateLoadingRadItem(
                oscilloscope.pause ?
                    'pause' : 'playing',
                null,$item)
        if (oscilloscope.pause)
            playHistory.clearHistoryTimer()
        uiState.updatePauseView()
    }
}