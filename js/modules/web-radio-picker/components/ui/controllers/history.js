/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class History {

    addToHistoryTimer = null
    wrpp = null

    init(wrpp) {
        this.wrpp = wrpp
        return this
    }

    setupAddToHistoryTimer(radItem) {
        const tid = setTimeout(() => this.addToHistory(radItem),
            this.wrpp.getSettings().addToHistoryDelay
        )
        if (this.addToHistoryTimer != null)
            clearTimeout(this.addToHistoryTimer)
        this.addToHistoryTimer = tid
    }

    clearHistoryTimer() {
        if (this.addToHistoryTimer != null)
            clearTimeout(this.addToHistoryTimer)
    }

    addToHistory(o) {
        if (this.wrpp.uiState.favoriteInputState) return
        const historyVisible = this.wrpp.isRDListVisible(RadioList_List, RadioList_History)

        if (settings.debug.debug)
            logger.log('add to history:' + o?.name)
        o.listenDate = Date.now
        var history = this.wrpp.radiosLists.getList(RadioList_History).items
        const itemInList = this.wrpp.findRadItemInList(o, history)
        if (itemInList != null) {
            // move to top: remove -> will be added on top
            history = history.filter(x => x != itemInList)
            this.wrpp.radiosLists.getList(RadioList_History).items = history
        }

        history.unshift(o)
        settings.dataStore.saveAll()

        // update views
        // TODO: change call target
        const list = this.wrpp.updateListsItems()

        // update history list if visible

        if (historyVisible)
            // TODO: restore scroll pos after that
            // TODO: change call target
            this.wrpp.updateCurrentRDList(o)
    }

    // always called from the history list
    removeFromHistory(item, $item, listId, listName, $butOn, $butOff) {
        if (settings.debug.debug)
            logger.log(`remove from history: ${item.name} list=${listId}:${listName}`)

        this.clearHistoryTimer()

        this.wrpp.radiosLists.removeFromList(item, listName)
        if (!oscilloscope.pause)
            app.toggleOPause(() => this.wrpp.playEventsHandlers
                .onPauseStateChanged(true, $item))
        this.wrpp.setPlayPauseButtonFreezeState(true)

        this.wrpp.uiState.updateCurrentRDItem(null, true)
        settings.dataStore.saveAll()

        // update views
        const list = this.wrpp.updateListsItems()

        // update history list if visible

        if (this.wrpp.isRDListVisible(RadioList_List, RadioList_History))
            this.wrpp.updateCurrentRDList(item)

        // clear Media view
        this.wrpp.noImage()
        this.wrpp.clearCurrentRadioView()
        setTimeout(() =>
            app.clearMediaView(), 500)
    }
}