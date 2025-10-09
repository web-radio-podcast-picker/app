/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

const Id_Popup_Info = 'info_popup'

class Dialogs {

    autoHideInfoPopupTimer = null
    initialized = false

    infoPopup(text, text2, error, error2, noAutoHide) {
        return {
            text: text,
            text2: text2,
            error: error,
            error2: error2,
            noAutoHide: noAutoHide
        }
    }

    infoPopupError(error, error2, noAutoHide) {
        return {
            text: null,
            text2: null,
            error: error,
            error2: error2,
            noAutoHide: noAutoHide !== undefined ? noAutoHide : true
        }
    }

    showInfoPopup(opts) {
        if (opts == null || opts === undefined) return

        clearTimeout(this.autoHideInfoPopupTimer)

        const $popup = $('#' + Id_Popup_Info)
        if (!this.initialized) {
            $popup.on('click', () => {
                this.hideInfoPopup()
            })
            this.initialized = true
        }

        const $text = $popup.find('.info-popup-text')
        const $text2 = $popup.find('.info-popup-text2')
        const $error = $popup.find('.info-popup-error')
        const $error2 = $popup.find('.info-popup-error2')
        const updVis = (v, $e) => {
            if (v)
                $e.removeClass(Class_Hidden)
            else
                $e.addClass(Class_Hidden)
        }

        // text
        $text.html(opts.text)
        $text2.html(opts.text2)

        // error
        $error.html(opts.error)
        $error2.html(opts.error2)

        updVis(opts.text, $text)
        updVis(opts.text2, $text2)
        updVis(opts.error, $error)
        updVis(opts.error2, $error2)

        ui.popups.showPopup(null, Id_Popup_Info, null, this.appearFunc)
        if (opts.noAutoHide != true)
            this.startAutoHideInfoPopupTimer()
    }

    appearFunc($e) {
        $e.removeClass('hidden').addClass('pop-anim').fadeIn(
            settings.ui.infoPopupFadeInDelay
        )
    }

    hideFunc($e) {
        $e.fadeOut(settings.ui.infoPopupFadeOutDelay)
    }

    startAutoHideInfoPopupTimer() {
        clearTimeout(this.autoHideInfoPopupTimer)
        this.autoHideInfoPopupTimer = setTimeout(
            () => this.hideInfoPopup(this.hideFunc),
            settings.ui.autoHideInfoPopupDelay)
    }

    hideInfoPopup(hideFunc) {
        ui.popups.hidePopup(Id_Popup_Info, hideFunc)
    }

}
