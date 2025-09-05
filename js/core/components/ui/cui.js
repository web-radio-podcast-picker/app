/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
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
        if (btnId !== undefined)
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
            width: html.clientWidth /*- settings.ui.clientWidthBorder*/,
            height: html.clientHeight /*- settings.ui.clientHeightBorder*/
        };
    },

    setOrientationLandscape() {
        const vs = this.viewSize()
        const vertical = vs.height >= vs.width
        if (!vertical) return
        var $b = ('body')
        $b.setAttr('rotate', '-90deg')
    },

}
