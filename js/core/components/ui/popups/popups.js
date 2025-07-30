// popups

class Popups {

    popups = {}

    // @TODO: NOT USED
    setPopupInputWidget($ctrl, inputWidget) {
        const $popup = $ctrl.closest('.popup')
        if ($popup.length == 0) return false
        const popupId = $popup.attr('id')
        const popup = this.popups[popupId]
        popup.inputWidget = inputWidget
        return true
    }

    popup(popupId, controlId) {
        return {
            popupId: popupId,
            controlId: controlId,
            visible: false,
            inputWidget: null,
            align: null
        }
    }

    init_popups() {
        $('.popup').each((i, e) => {
            const $popup = $(e)
            const popupId = $popup.attr('id')
            const popup = this.popup(popupId, null)
            this.popups[popupId] = popup
            $popup
                .find('.popup-close')
                .on('click', (c) => {
                    popup.visible = false
                    this.togglePopup(null, popupId, false)
                    ui.inputWidgets.closeInputWidget()
                })
        })
    }

    togglePopup(controlId, popupId, showState, align) {

        const $popup = $('#' + popupId);
        const visible = !$popup.hasClass('hidden');
        const popup = this.popups[popupId]
        popup.controlId = controlId
        popup.align = align
        var newvis = false

        if (showState === undefined) {
            $popup.toggleClass('hidden');
            if (!visible) {
                newvis = true
                ui.bindings.initBindedControls();
            }
        } else {
            if (!showState)
                $popup.addClass('hidden');
            else {
                $popup.removeClass('hidden');
                newvis = true
                ui.bindings.initBindedControls();
            }
        }

        popup.visible = newvis

        if (newvis) this.updatePopupPositionAndSize(controlId, $popup, align)

        if (!popup.visible)
            ui.inputWidgets.closeInputWidget()
    }

    updatePopupPositionAndSize(controlId, $popup, align) {
        var bounds = $popup[0].getBoundingClientRect()
        var z = Number($popup.css('zoom'))
        if (z === undefined || z == null) z = 1
        const w = bounds.width / z
        const h = bounds.height / z
        var left = 0;
        var top = 0;
        const vs = ui.viewSize()

        if (controlId != null) {
            // left align
            const $ctrl = $(controlId);
            var pos = $ctrl.offset();
            pos.left -= w;
            pos.left -= settings.ui.menuContainerWidth; // 3*1em
            left = pos.left;
            top = pos.top;
        } else {
            if (align == Align_Center_Middle_Top) {
                left = (vs.width - w) / 2.0;
                top = (vs.height - h) / 4.0;
            }
            else {
                if (align == Align_Center_Top) {
                    left = (vs.width - w) / 2.0;
                    top = 12;
                }
                else {
                    // center
                    left = (vs.width - w) / 2.0
                    top = (vs.height - h) / 2.0
                }
            }
        }
        // repos if out
        if (left < 0) left = 0
        if (top < 0) top = 0
        // resize if outfit
        const rx = vs.width / w
        const ry = vs.height / h
        if (rx < 1 || ry < 1) {
            if (rx < 1) left = 0
            if (ry < 1) top = 0
            const zoom = Math.min(rx, ry)
            $popup.css('zoom', zoom)
            // center
            bounds = $popup[0].getBoundingClientRect()
            switch (align) {
                case Align_Center_Middle_Top:
                    left = (vs.width - bounds.width) / 2.0 / zoom;
                    top = (vs.height - bounds.height) / 4.0 / zoom;
                    break
                case Align_Center_Top:
                    left = (vs.width - bounds.width) / 2.0 / zoom
                    break
                default:
                    left = (vs.width - bounds.width) / 2.0 / zoom
                    top = (vs.heght - bounds.height) / 2.0 / zoom
                    break
            }
        } else {
            $popup.css('zoom', 1)
        }
        $popup.css('left', left + 'px');
        $popup.css('top', top + 'px');
    }

    updatePopupsPositionAndSize() {
        const $popups = $('.popup').not('[class*="hidden"]')
        $popups.each((i, e) => {
            const $popup = $(e)
            const popupId = $popup.attr('id')
            const popup = this.popups[popupId]
            this.updatePopupPositionAndSize(popup.controlId, $popup, popup.align)
        })
    }
}