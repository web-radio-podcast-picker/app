/*
    Sound card Oscilloscope | Signal Analyzer Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
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
