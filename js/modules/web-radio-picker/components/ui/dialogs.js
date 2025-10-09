/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

const Id_Popup_Info = 'info_popup'

class Dialogs {

    showInfoPopup(text) {
        const $popup = $('#' + Id_Popup_Info)
        const $txt = $popup.find('.info-popup-text')
        $txt.text(text)
        ui.popups.showPopup(null, Id_Popup_Info)
    }

}
