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
    currentRDItem = null
    // history of current items refs
    RDItemsRefsHistory = []
    // list id -> tab id
    listIdToTabId = {
        'List': 'btn_wrp_play_list',
        'All': 'btn_wrp_all_radios',  // not a tab
        'Art': 'btn_wrp_art_list',
        'Lang': 'btn_wrp_lang_list',
        'Tag': 'btn_wrp_tag_list',
        'Viz': 'btn_wrp_logo'         // not a tab
        // RadioList_Info
    }
    // current group tab
    currentTab = null
    wrpp = null
    disableSave = false
    // rd lists cur & back memo
    memRDLists = null
    // ui in favorite input state if true
    favoriteInputState = false

    init(wrpp) {
        this.wrpp = wrpp
        return this
    }

    setTab(listId) {
        if (this.listIdToTabId[listId]) {
            const tabId = this.listIdToTabId[listId]
            $('#' + tabId).click()
        }
    }

    updateCurrentTab(tabId, skipSave) {
        const t = Object.keys(wrpp.uiState.listIdToTabId)
            .map(x => { return { 'listId': x, 'tabId': wrpp.uiState.listIdToTabId[x] } })
            .filter(x => x.tabId == tabId)
        this.currentTab = t.length > 0 ? t[0] : null
        if (skipSave !== true && !this.disableSave)
            settings.dataStore.saveUIState()
        if (settings.debug.trace)
            logger.log('currentTab=' + JSON.stringify(t))
    }

    #setRDList(rdList) {
        const acceptNoName = [
            RadioList_All
            /*RadioList_Info*/
        ]
        const skipInit = [
            RadioList_Info
        ]
        if (skipInit.includes(rdList.listId)) return

        this.updateCurrentRDList(rdList, true)
        if (((rdList?.name || null) == null)
            && !acceptNoName.includes(rdList.listId))
            return
        const itemRef = this.wrpp.getListItem(rdList)
        if (itemRef == null) return
        const r = itemRef.item.click()
    }

    updateCurrentRDList(newList, skipSave) {
        this.currentRDList_Back = this.currentRDList
        this.currentRDList = newList
        if (skipSave !== true && !this.disableSave)
            settings.dataStore.saveUIState()
        if (settings.debug.trace)
            logger.log('currentRDList=' + JSON.stringify(this.currentRDList))
    }

    getCurrentRDLists() {
        return {
            cur: this.uiState.currentRDList,
            back: this.uiState.currentRDList_Back
        }
    }

    #setRDItem(rdItem) {
        var radItem = this.wrpp.findRadItem(rdItem)
        if (radItem == null) return
        var item = this.wrpp.getRadListItem(radItem)
        if (item != null) {
            const $item = $(item.item)
            this.wrpp.focusListItem(item.item)
            $item.find('.wrp-list-item-text-container').click()
        }
    }

    // a playable item (not a group) : radioItem
    // build an RD
    updateCurrentRDItem(radioItem, skipSave) {
        if (radioItem != null)
            radioItem.ref = this.radioRef()
        this.currentRDItem = radioItem
        if (skipSave !== true && !this.disableSave)
            settings.dataStore.saveUIState()
        if (settings.debug.trace)
            logger.log('currentRDItem=' + JSON.stringify(radioItem))
    }

    // build a RDList struct
    RDList(listId, name, $item) {
        return {
            listId: listId,
            name: name,
            $item: $item
        }
    }

    getCurrentUIState() {
        return {
            currentRDList: {
                listId: this.currentRDList?.listId || null,
                name: this.currentRDList?.name || null
            },
            currentRDList_Back: {
                listId: this.currentRDList_Back?.listId || null,
                name: this.currentRDList_Back?.name || null
            },
            currentTab: {
                listId: this.currentTab?.listId || null,
                name: this.currentTab?.tabId || null
            },
            currentRDItem: this.currentRDItem
        }
    }

    restoreUIState(state) {
        this.disableSave = true
        if (state.currentRDList_Back != null)
            this.#setRDList(state.currentRDList_Back)
        if (state.currentRDList != null)
            this.#setRDList(state.currentRDList)
        if (state.currentTab != null)
            this.setTab(state.currentTab.listId)
        this.wrpp.preserveCurrentTab = true
        // ---
        if (state.currentRDItem != null)
            this.#setRDItem(state.currentRDItem)
        this.disableSave = false
    }

    // radio reference model - locate a radio in a list
    radioRef() {
        return {
            currentRDList: this.currentRDList,
            currentTab: this.currentTab
        }
    }

    toJSON() {
        const state = this.getCurrentUIState()
        return JSON.stringify(state,)
    }

    fromJSON(s) {
        const state = JSON.parse(s)
        this.restoreUIState(state)
    }

    // ----- UI freeze & editing status management -----

    memoRDLists() {
        this.memRDLists = {
            cur: this.currentRDList,
            back: this.currentRDList_Back
        }
    }

    setFavoriteInputState(enabled) {
        if (enabled) {

            this.memoRDLists()
            const wrpp = this.wrpp
            this.setTab(RadioList_List)
            const menuItemDisabledCl = 'menu-item-disabled'
            ui.tabs
                .freezeTabs(wrpp.tabs,
                    'btn_wrp_play_list',
                    menuItemDisabledCl)
                .freezeTabs(['btn_wrp_all_radios'], null, menuItemDisabledCl)
            this.setInfoButtonState(false)
            this.setCurrentRadItemButtonsState(false)
            this.setRadItemsListState(false)

        } else {

        }
        this.favoriteInputState = enabled
    }

    setInfoButtonState(enabled) {
        const $cnt = $('#btn_wrp_infos')
        const $bt = $cnt.find('img')
        const disabledCl = 'but-icon-disabled'
        const disabledBtCl = 'menu-item-disabled'
        if (!enabled) {
            $cnt.addClass(disabledCl)
            $bt.addClass(disabledBtCl)
        }
        else {
            $cnt.removeClass(disabledCl)
            $bt.removeClass(disabledBtCl)
        }
    }

    setCurrentRadItemButtonsState(enabled) {
        const wrpp = this.wrpp
        const item = this.currentRDItem
        if (item == null) return
        const $item = $(wrpp.getRadListItemById(item.id).item)
        const $buts = $item.find('.wrp-rad-item-icon ')
        const disabledCl = 'but-icon-disabled'
        if (!enabled) {
            $buts.addClass(disabledCl)
        }
        else {
            $buts.removeClass(disabledCl)
        }
    }

    setRadItemsListState(enabled) {
        const disabledCl = 'but-icon-disabled'
        const $items = $('#wrp_radio_list')
            .find('.wrp-list-item:not([class~="item-selected"]')
        if (!enabled)
            $items.addClass(disabledCl)
        else
            $items.removeClass(disabledCl)
    }

    isRadOpenDisabled() {
        return this.favoriteInputState
    }
}

