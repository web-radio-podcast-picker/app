/*
    Sound card Oscilloscope | Spectrum Analyzer | Signal Generator
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// audio input device manager

audioInputDevice = {

    getMediaStream: async function () {
        try {
            stream = await navigator
                .mediaDevices
                .getUserMedia({
                    audio: true,
                    video: false
                });
            if (settings.debug.info)
                console.log('Media stream obtained:', stream);
            return stream;
        } catch (err) {
            console.error('Error accessing media devices.', err);
        }
    }
}
