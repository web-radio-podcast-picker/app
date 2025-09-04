/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

drag = {

    props(minx, maxx, miny, maxy, getInitialValueFunc,
        startMoveCallback, movingCallback, movedCallback) {
        return {
            minx: minx,
            maxx: maxx,
            miny: miny,
            maxy: maxy,
            getInitialValueFunc: getInitialValueFunc,
            startMoveCallback: startMoveCallback,
            movingCallback: movingCallback,
            movedCallback: movedCallback
        }
    },

    isDragging($c) {
        return $c.attr('data-drag-on') == 'true'
    },

    setIsDragging($c, st) {
        $c.attr('data-drag-on', st)
    },

    startDrag($c, d) {
        if (this.isDragging($c)) return
        const offset = $c.offset()
        $c.attr('data-drag-left', offset.left)
        $c.attr('data-drag-top', offset.top)
        this.setIsDragging($c, true)
        const ival = d.getInitialValueFunc()
        $c.attr('data-drag-base', ival)
        if (d.startMoveCallback != null)
            d.startMoveCallback()
    },

    stopDrag($c, d) {
        if (!this.isDragging($c)) return
        $c.attr('data-drag-ix', null)
        $c.attr('data-drag-iy', null)
        this.setIsDragging($c, false)
        if (d.movedCallback != null)
            d.movedCallback(this.deltas($c))
    },

    drag($c, d, e) {
        if (!this.isDragging($c)) return
        var ix = Number($c.attr('data-drag-ix'))
        var iy = Number($c.attr('data-drag-iy'))
        const x = e.pageX
        const y = e.pageY
        if (Number.isNaN(ix)) {
            ix = x
            $c.attr('data-drag-ix', ix)
        }
        if (Number.isNaN(iy)) {
            iy = y
            $c.attr('data-drag-iy', iy)
        }
        var dx = x - ix
        var dy = y - iy

        if ((d.minx != null && dx < d.minx)
            || (d.maxx != null && dx > d.maxx))
            dx = 0
        if ((d.miny != null && dy < d.miny)
            || (d.maxy != null && dy > d.maxy))
            dy = 0

        $c.attr('data-drag-dx', dx)
        $c.attr('data-drag-dy', dy)
        const nx = Number($c.attr('data-drag-left')) + dx
        const ny = Number($c.attr('data-drag-top')) + dy
        $c.css('left', nx + 'px')
        $c.css('top', ny + 'px')

        if (d.movingCallback != null)
            d.movingCallback(
                this.deltas($c),
                Number($c.attr('data-drag-base'))
            )
    },

    addDragControl(controlId, d) {
        const $c = $('#' + controlId)
        const $body = $('body')
        $c.on('mousedown', (e) => {
            this.startDrag($c, d)
        })
        $c.on('mouseup', (e) => {
            this.stopDrag($c, d)
        })
        $body.on('mouseleave', (e) => {
            this.stopDrag($c, d)
        })
        $body.on('mousemove', (e) => {
            this.drag($c, d, e)
        })
    },

    deltas($c) {
        const dx = Number($c.attr('data-drag-dx'))
        const dy = Number($c.attr('data-drag-dy'))
        return { dx: dx, dy: dy }
    }
}