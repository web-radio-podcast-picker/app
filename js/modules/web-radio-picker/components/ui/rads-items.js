/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class RadsItems {

    // current loading item if any
    loadingRDItem = null
    $loadingRDItem = null
    // add to history timer if any
    addToHistoryTimer = null

    wrpp = null

    init(wrpp) {
        this.wrpp = wrpp
        return this
    }

    isLoadingItemSet() {
        return this.loadingRDItem != null && this.$loadingRDItem != null
    }

    setLoadingItem(loadingRDItem, $loadingRDItem) {
        this.loadingRDItem = loadingRDItem
        this.$loadingRDItem = $loadingRDItem
    }

    updateLoadingRadItem(statusText, $item) {
        var $ldgRDItem = $item || this.$loadingRDItem
        if ($ldgRDItem == null) return
        const $subit = $ldgRDItem.find('.wrp-list-item-sub')
        const $statusText = $ldgRDItem.find('.wrp-item-info-text')
        $ldgRDItem.attr('data-text', statusText)
        $statusText.text(statusText)
        $subit.removeClass('hidden')
    }

    updateRadItem(item, $item, $butOn, $butOff) {
        const favs = this.wrpp.favorites.getItemFavoritesFiltered(item)
        if (favs.length > 0) {
            $butOn.removeClass('hidden')
            $butOff.addClass('hidden')
        } else {
            $butOn.addClass('hidden')
            $butOff.removeClass('hidden')
        }
    }

}