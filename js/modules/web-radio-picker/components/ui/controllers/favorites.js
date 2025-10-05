/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class Favorites {

    wrpp = null

    init(wrpp) {
        this.wrpp = wrpp
        return this
    }

    addFavorite(item, $item, listId, listName, $butOn, $butOff) {
        if (settings.debug.debug)
            logger.log(`add favorite: ${item.name} (from list=${listId}:${listName})`)

        // must select a fav in lists ui

        this.wrpp.uiState.setFavoriteInputState(
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
        } = this.wrpp.uiState.getAddingFavoriteItem()

        this.wrpp.uiState.setFavoriteInputState(
            false,
            this.wrpp.uiState.addingFavoriteItem,
            this.wrpp.uiState.$addingFavoriteItem)

        // update fav list
        if (!addingFavoriteItem.favLists.includes(rdList.name))
            addingFavoriteItem.favLists.push(rdList.name)
        this.wrpp.radiosLists.addToList(rdList.name, addingFavoriteItem)

        this.wrpp.radsItems.updateRadItem(
            addingFavoriteItem,
            $addingFavoriteItem,
            $addingFavoriteItemButOn,
            $addingFavoriteItemButOff)

        // update the fav list
        this.wrpp.listsBuilder.updateListsItems()

        settings.dataStore.saveAll()
    }

    addNewFavoriteList() {
        $('#wrp_but_add_fav').addClass('menu-item-disabled')
        const t = this.wrpp.radiosLists.lists
        const names = getSortedNames(t)
        const i = names.length
        const listName = "input_list_item"
        const { domItem, $item } = this.wrpp.listsBuilder.radListBuilder.buildListItem(
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

        const item = this.wrpp.radiosLists.radioList(RadioList_List, listName)

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

        this.wrpp.uiState.setAddNewFavoriteListInputState(item, $item)
        const listId = 'opts_wrp_play_list'
        const $pl = $('#' + listId)
        $pl.find('.wrp-list-item').addClass('but-icon-disabled')
        this.wrpp.uiState.setItemsListState(listId, false)
        $pl.append($item)
        $inp.focus()
    }

    endNewFavoriteList(favItem, $favItem, isCancelled) {
        const listName = "input_list_item"
        const { item, $item } = this.wrpp.uiState.getNewFavoriteListInput()
        const $inp = $item.find('#' + listName)
        const text = $inp[0].value
        item.name = text
        const rdList = this.wrpp.radiosLists.addList(item.listId, item.name)
        this.wrpp.uiState.setAddNewFavoriteListInputState(null, null)
        this.endAddFavorite($favItem, rdList, true)
    }

    getItemFavoritesFiltered(item) {
        const favs = item.favLists.filter(x => x != RadioList_History)
        return favs
    }

    removeFavorite(item, $item, $butOn, $butOff) {
        if (settings.debug.debug)
            logger.log(`remove favorite: ${item.name}`)

        this.wrpp.history.clearHistoryTimer()

        const favs = this.getItemFavoritesFiltered(item)
        var delFav = null

        if (favs.length == 1) {
            delFav = favs[0]
            this.wrpp.radiosLists.removeFromList(item, delFav)
        }
        this.wrpp.radsItems.updateRadItem(item, $item, $butOn, $butOff)

        // update the fav list
        this.wrpp.listsBuilder.updateListsItems()

        // update rad list if current is the fav list
        const crdl = this.wrpp.uiState.currentRDList
        if (crdl.listId == RadioList_List && crdl.name == delFav)
            this.wrpp.listsBuilder.radListBuilder
                .updateCurrentRDList(item)

        settings.dataStore.saveAll()
    }
}
