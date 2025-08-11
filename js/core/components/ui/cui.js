/*
    Sound card Oscilloscope | Signal Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// common ui

cui = {

    setFullscreen(fs, onText, offText, btnId) {
        settings.ui.fullscreen = fs
        if (fs) {
            document.querySelector('body').requestFullscreen(
                { navigationUI: 'hide' }
            )
        }
        else {
            if (document.fullscreenElement)
                document.exitFullscreen()
        }
        $('#' + btnId).html(
            fs ? onText : offText
        )
    }

}
