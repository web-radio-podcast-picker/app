/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// scrollers

class Scrollers {

    scrollers = []           // array of bindings for controls

    new(scroller) {
        const $scrollPanes =
            scroller.scrollPaneIds.map(value => $('#' + value))

        const $activeScrollPane = $scrollPanes.reduce((acc, $sp) =>
            $sp.hasClass('hidden') ? acc : $sp)

        scroller.$scrollPanes = $scrollPanes
        scroller.$activeScrollPane = $activeScrollPane
        const $btup = $('#' + scroller.upButtonId)
        const $btdo = $('#' + scroller.downButtonId)

        const click = (e, isUp) => this.clickUpDown(scroller, $(e.target), isUp)
        $btup.on('mousedown', e => click(e, true))
        $btdo.on('mousedown', e => click(e, false))
        const target = e => this.unclick(scroller, $(e.target))
        $btup.on('mouseup', e => target(e))
        $btdo.on('mouseup', e => target(e))

        return this
    }

    clickUpDown(scroller, $but, isUp) {
        $but.addClass('selected')
        console.log(scroller.$activeScrollPane)
    }

    unclick(scroller, $but) {
        $but.removeClass('selected')
    }

    scroller(scrollPaneIds, upButtonId, downButtonId) {
        return {
            scrollPaneIds: scrollPaneIds,
            upButtonId: upButtonId,
            downButtonId: downButtonId
        }
    }
}