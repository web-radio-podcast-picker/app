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

    updateLoadingRadItem(statusText, item, $item) {
        $item ||= this.$loadingRDItem
        item ||= this.loadingRDItem
        if ($item == null) return

        if (item != null) item.metadata.statusText = statusText

        const $subit = $item.find('.wrp-list-item-sub')
        const $statusText = $item.find('.wrp-item-info-text')
        $item.attr('data-text', statusText)
        $statusText.text(statusText)
        $subit.removeClass('hidden')

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
    }

    buildFoldableItem(rdItem, $item, listId, listName, opts, unfolded) {
        // rad item or list item : control box

        const list = radiosLists.getList(listName)
        const isHistoryList = listId == RadioList_List && listName == RadioList_History
        const isRdItem = rdItem != null
        const hasTrash = (rdItem != null && isHistoryList) || (!isRdItem && !list.isSystem)

        const existsInFavorites = isRdItem &&
            (rdItem.favLists.length == 0 ? false :
                (rdItem.favLists.length == 1 && rdItem.favLists[0] != RadioList_History)
                || rdItem.favLists.length > 1)

        const butHeartOnVis = existsInFavorites ? '' : 'hidden'
        const butHeartOn = !isRdItem ? '' :
            `<img name="heart_on" src="./img/icons8-heart-fill-48.png" width="32" height="32" alt="heart" class="wrp-rad-item-icon ${butHeartOnVis}">`
        const butHeartOffVis = !existsInFavorites ? '' : 'hidden'
        const butHeartOff = !isRdItem ? '' :
            `<img name="heart_off" src="./img/icons8-heart-outline-48.png" width="32" height="32" alt="heart" class="wrp-rad-item-icon ${butHeartOffVis}">`

        const butRemove = hasTrash ?
            `<img name="trash" src="./img/trash-32.png" width="32" height="32" alt="heart" class="wrp-rad-item-icon">`
            : ''

        $item.addClass('wrp-list-item-foldable')
        const subitHidden = unfolded ? '' : 'hidden'
        const $subit = $(
            `<div class="wrp-list-item-sub ${subitHidden}">
<span class="wrp-item-info-text"></span>
<div class="wrp-item-controls-container">
${butRemove}${butHeartOn}${butHeartOff}
</div>
</div>`)
        const disabledCl = 'but-icon-disabled'

        if (isRdItem) {
            const $butOn = $subit.find('img[name="heart_on"]')
            $butOn
                .on('click', e => {
                    e.preventDefault()
                    if ($(e.currentTarget).hasClass(disabledCl)) return
                    favorites.removeFavorite(rdItem, $item, $butOn, $butOff)
                })

            const $butOff = $subit.find('img[name="heart_off"]')
            $butOff
                .on('click', e => {
                    e.preventDefault()
                    if ($(e.currentTarget).hasClass(disabledCl)) return
                    favorites.addFavorite(rdItem, $item, listId, listName, $butOn, $butOff)
                })
        }

        if (hasTrash)
            $subit.find('img[name="trash"]')
                .on('click', e => {
                    e.preventDefault()
                    if ($(e.currentTarget).hasClass(disabledCl)) return
                    if (isRdItem)
                        playHistory.removeFromHistory(rdItem, $item, listId, listName, $butOn, $butOff)
                    else
                        favorites.deleteFavoriteList(listName)
                })

        $item.append($subit)

        if (opts != null) {

        }
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