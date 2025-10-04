/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class RadListBuilder {

    addToHistoryTimer = null
    wrpp = null

    init(wrpp) {
        this.wrpp = wrpp
        return this
    }

    // build a playable item
    buildListItem(text, id, j, opts, rdItem, listId, listName) {
        if (opts === undefined) opts = null

        const item = document.createElement('div')
        const $item = $(item)

        $item.attr('data-id', id)
        $item.attr('data-text', text)
        $item.addClass('wrp-list-item')
        $item.removeClass('hidden')
        if (j & 1)
            $item.addClass('wrp-list-item-a')
        else
            $item.addClass('wrp-list-item-b')

        const $textBox = $('<div class="wrp-list-item-text-container">' + text + '</div>')
        $item.append($textBox)

        if (opts != null) {

            if (opts.count !== undefined) {

                const n2 = document.createElement('div')
                const $n2 = $(n2)
                $n2.addClass('wrp-list-item-box')

                $n2.text(opts.count)
                item.appendChild(n2)
            }
        }

        if (rdItem != null) {

            // rad item : control box

            const isHistoryList = listId == RadioList_List && listName == RadioList_History

            const existsInFavorites =
                rdItem.favLists.length == 0 ? false :
                    (rdItem.favLists.length == 1 && rdItem.favLists[0] != RadioList_History)
                    || rdItem.favLists.length > 1

            const butHeartOnVis = existsInFavorites ? '' : 'hidden'
            const butHeartOn =
                `<img name="heart_on" src="./img/icons8-heart-fill-48.png" width="32" height="32" alt="heart" class="wrp-rad-item-icon ${butHeartOnVis}">`
            const butHeartOffVis = !existsInFavorites ? '' : 'hidden'
            const butHeartOff =
                `<img name="heart_off" src="./img/icons8-heart-outline-48.png" width="32" height="32" alt="heart" class="wrp-rad-item-icon ${butHeartOffVis}">`

            const butRemove = isHistoryList ?
                `<img name="trash" src="./img/trash-32.png" width="32" height="32" alt="heart" class="wrp-rad-item-icon">`
                : ''

            $item.addClass('wrp-list-item-2h')
            const $subit = $(
                `<div class="wrp-list-item-sub hidden">
<span class="wrp-item-info-text"></span>
<div class="wrp-item-controls-container">
${butRemove}${butHeartOn}${butHeartOff}
</div>
</div>`)
            const disabledCl = 'but-icon-disabled'
            const $butOn = $subit.find('img[name="heart_on"]')
            $butOn
                .on('click', e => {
                    e.preventDefault()
                    if ($(e.currentTarget).hasClass(disabledCl)) return
                    this.wrpp.favorites.removeFavorite(rdItem, $item, $butOn, $butOff)
                })

            const $butOff = $subit.find('img[name="heart_off"]')
            $butOff
                .on('click', e => {
                    e.preventDefault()
                    if ($(e.currentTarget).hasClass(disabledCl)) return
                    this.wrpp.favorites.addFavorite(rdItem, $item, listId, listName, $butOn, $butOff)
                })

            if (isHistoryList)
                $subit.find('img[name="trash"]')
                    .on('click', e => {
                        e.preventDefault()
                        if ($(e.currentTarget).hasClass(disabledCl)) return
                        this.wrpp.history.removeFromHistory(rdItem, $item, listId, listName, $butOn, $butOff)
                    })

            $item.append($subit)

            if (opts != null) {

            }
        }

        return { item: item, $item: $item }
    }

}