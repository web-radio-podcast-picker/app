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
    },

    isSmallDisplay() {
        const vs = this.viewSize()
        return vs.height <= settings.ui.compactDisplayMaxHeight
    },

    viewSize() {
        const html = document.querySelector('html');
        return {
            width: html.clientWidth - settings.ui.clientWidthBorder,
            height: html.clientHeight - settings.ui.clientHeightBorder
        };
    },

    setOrientation(horizontal) {
        const vs = this.viewSize()
        const vertical = vs.height >= vs.width
        if (vertical == !horizontal) return

    }
}
