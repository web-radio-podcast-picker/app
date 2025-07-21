drag = {

    props(minx, maxx, miny, maxy) {
        return {
            minx: minx,
            maxx: maxx,
            miny: miny,
            maxy: maxy
        }
    },

    isDragging($c) {
        return $c.attr('data-drag-on') == 'true'
    },

    setIsDragging($c, st) {
        $c.attr('data-drag-on', st)
    },

    startDrag($c) {
        if (this.isDragging($c)) return
        console.log('start drag')
        const offset = $c.offset()
        $c.attr('data-drag-left', offset.left)
        $c.attr('data-drag-top', offset.top)
        this.setIsDragging($c, true)
    },

    stopDrag($c) {
        if (!this.isDragging($c)) return
        $c.attr('data-drag-ix', null)
        var iy = $c.attr('data-drag-iy', null)
        this.setIsDragging($c, false)
    },

    drag($c, e) {
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
        const dx = x - ix
        const dy = y - iy
        //console.log(dx + ' - ' + dy)
        $c.attr('data-drag-dx', dx)
        $c.attr('data-drag-dy', dy)
        const nx = Number($c.attr('data-drag-left')) + dx
        const ny = Number($c.attr('data-drag-top')) + dy
        //console.log(nx + ' - ' + ny)
        $c.css('left', nx + 'px')
        $c.css('top', ny + 'px')
    },

    addDragControl(controlId, d) {
        const $c = $('#' + controlId)
        const $body = $('body')
        $c.on('mousedown', (e) => {
            this.startDrag($c)
        })
        $c.on('mouseup', (e) => {
            this.stopDrag($c)
        })
        $body.on('mouseleave', (e) => {
            this.stopDrag($c)
        })
        $body.on('mousemove', (e) => {
            this.drag($c, e)
        })
    }
}