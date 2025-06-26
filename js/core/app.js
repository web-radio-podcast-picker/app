// this is the main app body

sigapp = {

    run: async function () {

        var inputDevice = internalSoundcard;
        var input = await inputDevice.getMediaStream();

        if (input != undefined) {
            console.log("Input media stream ok");
        }
        else {
            console.error("No input media stream");
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');
    sigapp.run();
}, false);
