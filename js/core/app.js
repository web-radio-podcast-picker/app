// this is the main app body

var inputDevice = internalSoundcard;
var input = inputDevice.getMediaStream();

if (input != undefined) {

    // input media stream ok

}
else {
    console.error("no input media stream");
}
