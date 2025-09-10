/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// media source

class WRPPMediaSource {

    audio = null        // audio tag
    source = null       // media source
    url = null          // media url

    static onLoadError = null      // on load error handler
    static onLoadSuccess = null    // on load success handler

    static sourceInitialized = false
    static sourcePlugged = false

    constructor() {
        this.init()
    }

    init() {
        const tagId = 'audio_tag'
        this.url = settings.media.demo.stereoAudioMediaURL
        this.audio = $('#' + tagId)[0]

        if (WRPPMediaSource.sourceInitialized) return
        WRPPMediaSource.sourceInitialized = true

        this.audio.addEventListener('loadedmetadata', (ev) => {
            // equivalent to a load success event
            if (settings.debug.trace)
                console.log('Metadata loaded:', this.audio.src)

            if (WRPPMediaSource.onLoadSuccess != null)
                WRPPMediaSource.onLoadSuccess(this.audio)
        })

        this.audio.addEventListener('error', () => {
            const err = this.getAudioSourceError()
            if (settings.debug.trace)
                console.log(err)

            if (err.code != MediaError.MEDIA_ERR_ABORTED
                && WRPPMediaSource.onLoadError != null) WRPPMediaSource.onLoadError(err, this.audio)
        })

        this.audio.addEventListener('canplay', async (o) => {
            if (settings.debug.trace) {
                console.log('can play')
                console.log(o)
            }
            if (!WRPPMediaSource.sourcePlugged) {
                await oscilloscope.initChannelForMedia(app.channel)
                WRPPMediaSource.sourcePlugged = true
            }
            app.playChannelMedia(app.channel)
        })

        this.audio.crossOrigin = "anonymous"

    }

    createAudioSource(audioContext, url, tagId) {

        /*if (this.source != null) {
            this.audio.src = url
            return
        }*/

        this.deleteSource()
        //this.audio = new Audio()
        //this.audio = $('#' + tagId)[0]
        this.source = audioContext.createMediaElementSource(this.audio)
        //this.audio.src = url
        return this.source
    }

    getAudioSourceError() {
        if (this.audio == null || this.audio.error == null) return null
        const err = this.audio.error
        return {
            'code': err.code,
            'message': err.message
        }
    }

    deleteSource() {
        if (this.audio == null) return
        this.audio.pause()
        //this.audio.src = ''
        ///this.audio = null
        //this.init()
        //this.updateBindings()
    }

    getMediaStream() {
        // let tell it is a stream
        return this
    }

    createMediaStreamSource(channel) {
        // it should have been already created
        if (this.source == null)
            throw new Error('source not initialized')
        return this.source
    }

    play() {
        return this.audio.play()
    }
}