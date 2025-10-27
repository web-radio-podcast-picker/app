/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class RadsItems {

    // current loading item if any
    loadingRDItem = null
    $loadingRDItem = null

    isLoadingItemSet() {
        return this.loadingRDItem != null && this.$loadingRDItem != null
    }

    setLoadingItem(loadingRDItem, $loadingRDItem) {
        this.loadingRDItem = loadingRDItem
        this.$loadingRDItem = $loadingRDItem
        return this
    }

    getLoadingItem() {
        return {
            loadingRDItem: this.loadingRDItem,
            $loadingRDItem: this.$loadingRDItem
        }
    }

    setTitleIconsVisibility($item, visible) {
        const $p = $item.find('.icon-rad-fav')
        if (visible)
            $p.removeClass(Class_Hidden)
        else
            $p.addClass(Class_Hidden)
    }

    updateLoadingRadItem(statusText, item, $item) {
        $item ||= this.$loadingRDItem
        item ||= this.loadingRDItem
        if ($item == null) return

        if (item != null) {
            wrpp.checkMetaData(item)
            item.metadata.statusText = statusText
        }

        const $subit = $item.find('.wrp-list-item-sub')
        const $statusText = $item.find('.wrp-item-info-text')
        $item.attr('data-status-text', statusText)
        $statusText.text(statusText)
        $subit.removeClass('hidden')
        this.setTitleIconsVisibility($item, false)

        return this
    }

    setLoadingItemMetadata(key, val, item) {
        item ||= this.loadingRDItem
        if (item == null) return
        wrpp.checkMetaData(item)
        item.metadata[key] = val
        return this
    }

    updateRadItem(item, $item, $butOn, $butOff) {
        const favs = favorites.getItemFavoritesFiltered(item)
        if (favs.length > 0) {
            $butOn.removeClass('hidden')
            $butOff.addClass('hidden')
        } else {
            $butOn.addClass('hidden')
            $butOff.removeClass('hidden')
        }
        this.setTitleIconsVisibility($item, false)
    }

    updateRadItemView(item, $item) {
        if (item === undefined || item == null) return
        if ($item === undefined || $item == null) return
        const $butOn = $item.find('img[name="heart_on"]')
        const $butOff = $item.find('img[name="heart_off"]')
        const $text2 = $item.find('.wrp-item-info-text2')
        const $text = $item.find('.wrp-list-item-text-container')
        const $statusText = $item.find('.wrp-item-info-text')
        $text.text(item.name)
        wrpp.checkMetaData(item)
        $statusText.text(item.metadata.statusText)
        const favName = favorites.getFavName(item) || ''
        $text2.text(favName)
        this.updateRadItem(item, $item, $butOn, $butOff)
    }

    buildFoldableItem(rdItem, $item, listId, listName, opts, unfolded, noList) {
        // rad item or list item : control box
        // -- only foldable: listId==RadioList_List items OR any rad item

        const list = noList == true ? null : radiosLists.getList(listName)
        const isFavList = listId == RadioList_List
        const isHistoryList = listId == RadioList_List && listName == RadioList_History
        const isRdItem = rdItem != null
        const hasTrash = (rdItem != null && isHistoryList) || (!isRdItem && !list?.isSystem && !noList)
        const isEditable = (!isRdItem && !list?.isSystem && !noList)
        const canEmpty = !isRdItem && isFavList

        const existsInFavorites = isRdItem &&
            (rdItem.favLists.length == 0 ? false :
                (rdItem.favLists.length == 1 && rdItem.favLists[0] != RadioList_History)
                || rdItem.favLists.length > 1)
        const favName = rdItem != null ? (favorites.getFavName(rdItem) || '') : ''

        // remove favorite
        const butHeartOnVis = existsInFavorites ? '' : 'hidden'
        const butHeartOn = !isRdItem ? '' :
            `<img name="heart_on" src="./img/icons8-heart-fill-48.png" width="32" height="32" alt="heart" class="wrp-rad-item-icon ${butHeartOnVis}">`
        // add favorite
        const butHeartOffVis = !existsInFavorites ? '' : 'hidden'
        const butHeartOff = !isRdItem ? '' :
            `<img name="heart_off" src="./img/icons8-heart-outline-48.png" width="32" height="32" alt="heart" class="wrp-rad-item-icon ${butHeartOffVis}">`
        // edit
        const butEditVis = !existsInFavorites ? '' : 'hidden'
        const butEdit = !isEditable ? '' :
            `<img name="pen_edit" src="./img/icons8-pen-100.png" width="32" height="32" alt="pen" class="wrp-rad-item-icon ${butEditVis}">`
        // delete        
        const butRemove = hasTrash ?
            `<img name="trash" src="./img/trash-32.png" width="32" height="32" alt="remove" class="wrp-rad-item-icon">`
            : ''
        // empty 
        const butEmpty = canEmpty ?
            `<img name="empty" src="./img/icons8-delete-all-50.png" width="32" height="32" alt="empty" class="wrp-rad-item-icon">`
            : ''

        $item.addClass('wrp-list-item-foldable')
        const subitHidden = unfolded ? '' : 'hidden'

        const text2 = !isRdItem ? '' :
            `<span class="wrp-item-info-text2">${favName}</span>`
        const $subit = $(
            `<div class="wrp-list-item-sub ${subitHidden}">
<span class="wrp-item-info-text"></span>
${text2}
<div class="wrp-item-controls-container">
${butRemove}${butHeartOn}${butHeartOff}${butEmpty}${butEdit}
</div>
</div>`)
        var $butOn = null
        var $butOff = null

        if (isRdItem) {
            $butOn = $subit.find('img[name="heart_on"]')
            $butOn
                .on('click', e => {
                    e.preventDefault()
                    if ($(e.currentTarget).hasClass(Class_Icon_Disabled)) return
                    favorites.removeFavorite(rdItem, $item, $butOn, $butOff)
                })

            $butOff = $subit.find('img[name="heart_off"]')
            $butOff
                .on('click', e => {
                    e.preventDefault()
                    if ($(e.currentTarget).hasClass(Class_Icon_Disabled)) return
                    favorites.addFavorite(rdItem, $item, listId, listName, $butOn, $butOff)
                })
        }

        if (isEditable)
            $subit.find('img[name="pen_edit"]')
                .on('click', e => {
                    e.preventDefault()
                    if ($(e.currentTarget).hasClass(Class_Icon_Disabled)) return
                    favorites.editFavoriteListName($item, listId, listName)
                })

        if (hasTrash)
            $subit.find('img[name="trash"]')
                .on('click', e => {
                    e.preventDefault()
                    if ($(e.currentTarget).hasClass(Class_Icon_Disabled)) return
                    if (isRdItem)
                        playHistory.removeFromHistory(rdItem, $item, listId, listName, $butOn, $butOff)
                    else
                        favorites.deleteFavoriteList($item.attr('data-text'))
                })

        if (canEmpty)
            $subit.find('img[name="empty"]')
                .on('click', e => {
                    e.preventDefault()
                    if ($(e.currentTarget).hasClass(Class_Icon_Disabled)) return
                    if (!isRdItem)
                        favorites.emptyFavoriteList($item.attr('data-text'))
                })

        $item.append($subit)

        if (opts != null) {

        }
    }

    setButtonStatus($item, buttonName, enabled) {
        const $but = $item.find('img[name="' + buttonName + '"]')
        if (enabled)
            $but.removeClass(Class_Icon_Disabled)
        else
            $but.addClass(Class_Icon_Disabled)
    }

    setAllButtonsStatus($item, enabled) {
        const t = [
            'heart_on', 'heart_off',
            'pen_edit',
            'trash'
        ]
        t.forEach(x => {
            this.setButtonStatus($item, x, enabled)
        })
    }

    unbuildFoldableItem($item) {
        $item.removeClass('wrp-list-item-foldable')
        const $subit = $item.find('.wrp-list-item-sub')
        if ($subit.length == 0) return
        $subit[0].innerHTML = ''
        $subit.remove()
        return this
    }

    unbuildFoldedItems(listId) {
        $.each(
            $('#' + listId)
                .find('.wrp-list-item-foldable'),
            (i, e) => {
                radsItems.unbuildFoldableItem($(e))
            })
        return this
    }
}