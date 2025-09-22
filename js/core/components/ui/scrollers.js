/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// scrollers

class Scrollers {

    scrollers = []           // array of bindings for controls

    new(scroller) {
        const $sp = $('#' + scroller.scrollPaneId)
        const $btup = $('#' + scroller.upButtonId)
        const $btdo = $('#' + scroller.downpButtonId)
    }

    scroller(scrollPaneId, upButtonId, downButtonId) {
        return {
            scrollPaneId: scrollPaneId,
            upButtonId: upButtonId,
            downButtonId: downButtonId
        }
    }
}