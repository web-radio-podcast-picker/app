/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

const Id_Popup_Info = 'info_popup'

class Dialogs {

    autoHideInfoPopupTimer = null

    showInfoPopup(text) {
        const $popup = $('#' + Id_Popup_Info)
        const $txt = $popup.find('.info-popup-text')
        $txt.text(text)
        ui.popups.showPopup(null, Id_Popup_Info, null, this.appearFunc)
        this.startAutoHideInfoPopupTimer()
    }

    appearFunc($e) {
        window.$e = $e
        //$e.addClass('transparent').removeClass('hidden')
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
