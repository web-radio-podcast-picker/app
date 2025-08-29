/*
    Sound card Oscilloscope | Spectrum Analyzer | Signal Generator
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// media source

class MediaSource {

    audio = null        // audio tag
    source = null       // media source
    url = null          // media url

    constructor() {
        this.init()
    }

    init() {
        this.url = settings.media.demo.stereoAudioMediaURL
    }

    createAudioSource(audioContext, url) {
        this.deleteSource()
        this.audio = new Audio()
        this.audio.addEventListener('loadedmetadata', () => {
            console.log('Metadata loaded:', this.audio.src)
        });
        this.audio.crossOrigin = "anonymous"
        this.source = audioContext.createMediaElementSource(this.audio)
        this.audio.src = url
        return this.source
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