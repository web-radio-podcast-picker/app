// toggles

class Toggles {

    toggles = []

    setToggle(controlId, state) {
        const $c = $('#' + controlId)
        const path = $c.attr('tag')
        const hasPath = path !== undefined && path != null
        const inverted = $c.attr('data-inverted') == 'true'
        const vstate = inverted ? !state : state

        if (vstate) {
            $c.addClass('on')
            $c.removeClass('off')
        }
        else {
            $c.addClass('off')
            $c.removeClass('on')
        }

        $c.text(vstate ? 'ON' : 'OFF')

        if (hasPath) {
            try {
                eval(path + '=' + state)
            } catch (err) {
                // ignore or debug
                if (settings.debug.debug)
                    console.log(err)
            }
        }
        return this
    }

    updateToggle(controlId, forceVal) {
        const $c = $('#' + controlId)
        const path = $c.attr('tag')
        const hasPath = path !== undefined && path != null
        if (hasPath) {
            // eval context is ui
            try {
                const val =
                    (forceVal !== undefined && forceVal != null) ?
                        forceVal : eval(path)
                this.setToggle(controlId, val)
            } catch (err) {
                // ignore or debug
                if (settings.debug.debug)
                    console.log(err)
            }
        }
    }

    updateToggles() {
        const t = this
        this.toggles.forEach(cid => {
            const $c = $('#' + cid)
            t.updateToggle(cid)
        })
    }

    initToggle(controlId, onChange, path, inverted) {
        const $c = $('#' + controlId)
        const hasPath = path !== undefined && path != null
        if (hasPath)
            $c.attr('tag', path)
        if (inverted === undefined || inverted == null)
            inverted = false
        $c.attr('data-inverted', inverted ? 'true' : 'false')

        $c.on('click', () => {
            this.setToggle(controlId,
                $c.hasClass(
                    inverted ? 'on' : 'off'))
            if (onChange != undefined && onChange != null) onChange($c)
        })
        this.toggles.push(controlId)
        return ui
    }
}