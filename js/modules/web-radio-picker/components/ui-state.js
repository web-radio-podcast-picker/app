/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class UIState {

    // RDList is the right pane container. can holds an item list or not (eg. info pane)
    // struct RDList { listId, name, $item }
    currentRDList = null
    currentRDList_Back = null
    // current playable item ref
    currentRDItemRef = null
    // history of current items refs
    RDItemsRefsHistory = []
    // the tab that opens the list (listId -> tabId)
    listTabId = null
    // list id -> tab id
    listIdToTabId = {
        'RadioList_List': 'btn_wrp_play_list',
        'RadioList_All': 'btn_wrp_all_radios',  // not a tab
        'RadioList_Art': 'btn_wrp_art_list',
        'RadioList_Lang': 'btn_wrp_lang_list',
        'RadioList_Tag': 'btn_wrp_tag_list'
    }

    wrpp = null

    init(wrpp) {
        this.wrpp = wrpp
        return this
    }

    updateCurrentRDList(newList) {
        this.currentRDList_Back = this.currentRDList
        this.currentRDList = newList
        console.log('currentRDList=' + JSON.stringify(this.uiState.currentRDList))
    }

    // a playable item (not a group)
    updateCurrentItem(rdItem) {
        const rdItemRef = this.wrpp.radiosLists.radioRef(

        )
    }

    // build a RDList struct
    RDList(listId, name, $item) {
        return {
            listId: listId,
            name: name,
            $item: $item
        }
    }
}

