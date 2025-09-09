/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// media source

class MediaSource {

    audio = null        // audio tag
    source = null       // media source
    url = null          // media url

    onLoadError = null      // on load error handler
    onLoadSuccess = null    // on load success handler

    constructor() {
        this.init()
    }

    init() {
        this.url = settings.media.demo.stereoAudioMediaURL
    }

    createAudioSource(audioContext, url, tagId) {
        this.deleteSource()
        //this.audio = new Audio()
        this.audio = $('#' + tagId)[0]

        this.audio.addEventListener('loadedmetadata', (ev) => {
            // equivalent to a load success event
            if (settings.debug.trace)
                console.log('Metadata loaded:', this.audio.src)

            if (this.onLoadSuccess != null)
                this.onLoadSuccess(this.audio)
        })

        this.audio.addEventListener('error', () => {
            const err = this.getAudioSourceError()
            if (settings.debug.trace)
                console.log(err)

            if (err.code != MediaError.MEDIA_ERR_ABORTED
                && this.onLoadError != null) this.onLoadError(err, this.audio)
        })

        this.audio.crossOrigin = "anonymous"
        this.source = audioContext.createMediaElementSource(this.audio)
        this.audio.src = url
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
        this.audio.src = ''
        this.audio = null
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