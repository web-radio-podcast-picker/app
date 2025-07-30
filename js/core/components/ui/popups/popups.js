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

        if (newvis) this.updatePopupPosition(controlId, $popup, align)

        if (!popup.visible)
            ui.inputWidgets.closeInputWidget()
    }

    updatePopupPosition(controlId, $popup, align) {
        const bounds = $popup[0].getBoundingClientRect()
        const w = bounds.width
        const h = bounds.height
        var left = 0;
        var top = 0;

        if (controlId != null) {
            // left align
            const $ctrl = $(controlId);
            var pos = $ctrl.offset();
            pos.left -= w;
            pos.left -= settings.ui.menuContainerWidth; // 3*1em
            left = pos.left;
            top = pos.top;
        } else {
            const vs = ui.viewSize()
            if (align == 'center-middle-top') {
                left = (vs.width - w) / 2.0;
                top = (vs.height - h) / 4.0;
            }
            else {
                if (align == 'center-top') {
                    left = (vs.width - w) / 2.0;
                    top = 12;
                }
                else {
                    // center
                    left = (vs.width - w) / 2.0;
                    top = (vs.height - h) / 2.0;
                }
            }
        }
        $popup.css('left', left);
        $popup.css('top', top);
    }

    updatePopupsPosition() {
        const $popups = $('.popup').not('[class*="hidden"]')
        $popups.each((i, e) => {
            const $popup = $(e)
            const popupId = $popup.attr('id')
            const popup = this.popups[popupId]
            this.updatePopupPosition(popup.controlId, $popup, popup.align)
        })
    }
}