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
    // list id -> tab id
    listIdToTabId = {
        'RadioList_List': 'btn_wrp_play_list',
        'RadioList_All': 'btn_wrp_all_radios',  // not a tab
        'RadioList_Art': 'btn_wrp_art_list',
        'RadioList_Lang': 'btn_wrp_lang_list',
        'RadioList_Tag': 'btn_wrp_tag_list',
        'RadioList_Viz': 'btn_wrp_logo'
    }
    // current group tab
    currentTab = null
    wrpp = null

    init(wrpp) {
        this.wrpp = wrpp
        return this
    }

    updateCurrentTab(tabId) {
        const t = Object.keys(wrpp.uiState.listIdToTabId)
            .map(x => { return { 'listId': x, 'tabId': wrpp.uiState.listIdToTabId[x] } })
            .filter(x => x.tabId == tabId)
        this.currentTab = t.length > 0 ? t[0] : null
        console.log('currentTab=' + JSON.stringify(t))
    }

    updateCurrentRDList(newList) {
        this.currentRDList_Back = this.currentRDList
        this.currentRDList = newList
        console.log('currentRDList=' + JSON.stringify(this.currentRDList))
    }

    // a playable item (not a group) : radioItem
    // build an RD
    updateCurrentRDItem(radioItem) {
        radioItem.ref = this.radioRef()
        console.log('currentRDItem=' + JSON.stringify(radioItem))
    }

    // build a RDList struct
    RDList(listId, name, $item) {
        return {
            listId: listId,
            name: name,
            $item: $item
        }
    }

    // radio reference model - locate a radio in a list
    radioRef() {
        return {
            currentRDList: this.currentRDList,
            currentTab: this.currentTab
        }
    }
}

