/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class Favorites {

    addFavorite(item, $item, listId, listName, $butOn, $butOff) {
        if (settings.debug.debug)
            logger.log(`add favorite: ${item.name} (from list=${listId}:${listName})`)

        // must select a fav in lists ui

        uiState.setFavoriteInputState(
            true,
            item,
            $item,
            $butOn, $butOff)
    }

    endAddFavorite($favItem, rdList, isNewFavList) {
        if (settings.debug.debug)
            logger.log(`add favorite to: list=${rdList.listId}:${rdList.name}`)

        const {
            addingFavoriteItem,
            $addingFavoriteItem,
            $addingFavoriteItemButOn,
            $addingFavoriteItemButOff
        } = uiState.getAddingFavoriteItem()

        uiState.setFavoriteInputState(
            false,
            uiState.addingFavoriteItem,
            uiState.$addingFavoriteItem)

        // update fav list
        if (!addingFavoriteItem.favLists.includes(rdList.name))
            addingFavoriteItem.favLists.push(rdList.name)
        radiosLists.addToList(rdList.name, addingFavoriteItem)

        radsItems.updateRadItem(
            addingFavoriteItem,
            $addingFavoriteItem,
            $addingFavoriteItemButOn,
            $addingFavoriteItemButOff)

        // update the fav list
        listsBuilder.updateListsItems()

        settings.dataStore.saveAll()
    }

    addNewFavoriteList() {
        $('#wrp_but_add_fav').addClass('menu-item-disabled')
        const t = radiosLists.lists
        const names = getSortedNames(t)
        const i = names.length
        const listName = "input_list_item"
        const { domItem, $item } = radListBuilder.buildListItem(
            "",
            i,
            i,
            { count: 0 },
            null,
            null,
            null
        )
        const $inp = $('<input type="text" id="' + listName + '">')
        const $container = $item.find('.wrp-list-item-text-container')
        $container.append($inp)

        const item = radiosLists.radioList(RadioList_List, listName)

        $inp.on('keypress', e => {
            logger.log(e)
            const $inp = $(e.currentTarget)
            const text = $inp.length > 0 ? $inp[0].value : null
            const textValid = text !== undefined && text != null && text != ''
            // return
            if (textValid && e.which == 13) {
                this.endNewFavoriteList(item, $item, false)
            }
        })

        uiState.setAddNewFavoriteListInputState(item, $item)
        const listId = 'opts_wrp_play_list'
        const $pl = $('#' + listId)
        $pl.find('.wrp-list-item').addClass('but-icon-disabled')
        uiState.setItemsListState(listId, false)
        $pl.append($item)
        $inp.focus()
    }

    endNewFavoriteList(favItem, $favItem, isCancelled) {
        const listName = "input_list_item"
        const { item, $item } = uiState.getNewFavoriteListInput()
        const $inp = $item.find('#' + listName)
        const text = $inp[0].value
        item.name = text
        const rdList = radiosLists.addList(item.listId, item.name)
        uiState.setAddNewFavoriteListInputState(null, null)
        this.endAddFavorite($favItem, rdList, true)
    }

    getItemFavoritesFiltered(item) {
        const favs = item.favLists.filter(x => x != RadioList_History)
        return favs
    }

    removeFavorite(item, $item, $butOn, $butOff) {
        if (settings.debug.debug)
            logger.log(`remove favorite: ${item.name}`)

        playHistory.clearHistoryTimer()

        const favs = this.getItemFavoritesFiltered(item)
        var delFav = null

        if (favs.length == 1) {
            delFav = favs[0]
            radiosLists.removeFromList(item, delFav)
        }
        radsItems.updateRadItem(item, $item, $butOn, $butOff)

        // update the fav list
        listsBuilder.updateListsItems()

        // update rad list if current is the fav list
        const crdl = uiState.currentRDList
        if (crdl.listId == RadioList_List && crdl.name == delFav)
            radListBuilder
                .updateCurrentRDList(item)

        settings.dataStore.saveAll()
    }

    // always called from the history list
    deleteFavoriteList(listName) {
        if (settings.debug.debug)
            logger.log(`delete favorite list: ${listName}`)

        playHistory.clearHistoryTimer()

        radiosLists.deleteList(listName)

        radListBuilder
            .deleteSelectedListItem('opts_wrp_play_list')
            .clearRadList()

        uiState.updateCurrentRDList(null, true)

        settings.dataStore.saveAll()
    }
}
