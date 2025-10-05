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

    buildRadListItems(items, listId, listName) {
        const $rad = $('#wrp_radio_list')
        var j = 0
        items.forEach(n => {
            const { item, $item } = this.wrpp.listsBuilder.radListBuilder
                .buildListItem(
                    n.name,
                    n.id,
                    j,
                    null,
                    n,
                    listId,
                    listName
                )
            j++
            this.initItemRad($rad, $item, n)
            $rad.append($item)
        })
        $rad.scrollTop(0)
        if (settings.features.swype.enableArrowsButtonsOverScrollPanes)
            ui.scrollers.update('wrp_radio_list')
    }

    // init a playable item
    initItemRad($rad, $item, o) {
        const $textContainer = $item.find('.wrp-list-item-text-container')
        $textContainer.on('click', async () => {

            if (this.wrpp.uiState.isRadOpenDisabled()) return

            $rad.find('.item-selected')
                .removeClass('item-selected')
            this.foldLoadingRadItem()
            $item.addClass('item-selected')

            $('#wrp_radio_url').text(o.url)
            $('#wrp_radio_name').text(o.name)
            $('#wrp_radio_box').text(o.groups.join(' '))
            const $i = $('#wrp_img')
            $i.attr('data-w', null)
            $i.attr('data-h', null)

            // setup up media image
            if (o.logo != null && o.logo !== undefined && o.logo != '') {
                // get img
                $i.addClass('hidden')
                $i.attr('width', null)
                $i.attr('height', null)
                $i.attr('data-noimg', null)
                $i.removeClass('wrp-img-half')
                var url = o.logo
                if (settings.net.enforceHttps)
                    url = url.replace('http://', 'https://')
                $i.attr('src', url)

            } else {
                // no img
                $i.addClass('hidden')
                this.wrpp.noImage()
            }

            const channel = ui.getCurrentChannel()
            if (channel != null && channel !== undefined) {

                this.wrpp.radsItems.setLoadingItem(o, $item)
                this.wrpp.clearAppStatus()
                this.wrpp.playEventsHandlers.initAudioSourceHandlers()
                this.wrpp.playEventsHandlers.onLoading(o)

                // plays the item
                const pl = async () => {

                    // turn on channel

                    // update pause state
                    this.wrpp.playEventsHandlers.onPauseStateChanged()

                    // setup channel media
                    await app.updateChannelMedia(
                        ui.getCurrentChannel(),
                        o.url
                    )

                    // update ui state
                    this.wrpp.uiState.updateCurrentRDItem(o)
                }

                if (oscilloscope.pause)
                    app.toggleOPause(async () => await pl())
                else
                    await pl()
            }
        })
    }

    foldLoadingRadItem() {
        if (!this.wrpp.radsItems.isLoadingItemSet()) return
        const $subit = this.wrpp.radsItems.$loadingRDItem
            .find('.wrp-list-item-sub')
        $subit.addClass('hidden')
    }

    foldUnfoldRadItem($rdItem, folded) {
        const $subit = $rdItem.find('.wrp-list-item-sub')
        if (folded)
            $subit.addClass('hidden')
        else
            $subit.removeClass('hidden')
    }

    // update the rdList view for the current rdList and the given item
    updateCurrentRDList(item) {
        // find the list item / button
        const rdList = this.wrpp.uiState.currentRDList
        if (rdList == null) return
        const itemRef = this.wrpp.getListItem(rdList)
        if (itemRef == null || itemRef.item == null) return

        // get the target items panel props
        const $pl = $('#wrp_radio_list')
        const $selected = $pl.find('.item-selected')
        const id = $selected.attr('data-id')
        // get dynamic item props
        const text = $selected.attr('data-text')
        const y = $pl.scrollTop()

        // open the list
        const r = itemRef.item.click()

        // restore the position & selection
        $pl.scrollTop(y)
        if (id !== undefined) {
            const it = this.wrpp.getRadListItemById(id)
            if (it != null) {
                it.item.scrollIntoView({
                    behavior: 'instant',
                    block: 'center',
                    inline: 'center'
                })
                const $item = $(it.item)
                $item.addClass('item-selected')
                this.wrpp.radsItems.setLoadingItem(item, $item)
                this.wrpp.radsItems.updateLoadingRadItem(text)
            }
            return { $panel: $pl, $selected: $selected, id: id, it: it }
        }
    }
}