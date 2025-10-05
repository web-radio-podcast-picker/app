/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class RadListBuilder {

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

        /*if (rdItem != null) {            
        }*/

        return { item: item, $item: $item }
    }

    buildRadListItems(items, listId, listName) {
        const $rad = $('#wrp_radio_list')
        var j = 0
        items.forEach(n => {
            const { item, $item } = this
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

            if (uiState.isRadOpenDisabled()) return

            // unselect & fold last current item
            const $prevItem = $rad.find('.item-selected')
            $prevItem.removeClass('item-selected')
            radsItems.unbuildFoldableItem($prevItem)
            $item.addClass('item-selected')

            // update radio view with new current item
            wrpp.setupRadioView(o)
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
                mediaImage.noImage()
            }

            const channel = ui.getCurrentChannel()
            if (channel != null && channel !== undefined) {

                radsItems.setLoadingItem(o, $item)

                // build foldable item + unfold it
                radsItems.buildFoldableItem(
                    o, $item,
                    uiState.currentRDList?.listId,
                    uiState.currentRDList?.name,
                    {},
                    true
                )

                wrpp.clearAppStatus()
                playEventsHandlers.initAudioSourceHandlers()
                playEventsHandlers.onLoading(o)

                // plays the item
                const pl = async () => {

                    // turn on channel

                    // update pause state
                    playEventsHandlers.onPauseStateChanged()

                    // setup channel media
                    await app.updateChannelMedia(
                        ui.getCurrentChannel(),
                        o.url
                    )

                    // update ui state
                    uiState.updateCurrentRDItem(o)
                }

                if (oscilloscope.pause)
                    app.toggleOPause(async () => await pl())
                else
                    await pl()
            }
        })
    }

    // update the rdList view for the current rdList and the given item
    updateCurrentRDList(item) {
        // find the list item / button
        const rdList = uiState.currentRDList
        if (rdList == null) return
        const itemRef = wrpp.getListItem(rdList)
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
            const it = wrpp.getRadListItemById(id)
            if (it != null) {
                it.item.scrollIntoView({
                    behavior: 'instant',
                    block: 'center',
                    inline: 'center'
                })
                const $item = $(it.item)
                $item.addClass('item-selected')

                // restore item in unfolded state
                radsItems.buildFoldableItem(
                    item,
                    $item,
                    rdList.listId,
                    rdList.name,
                    {},
                    true
                )

                radsItems.setLoadingItem(item, $item)
                radsItems.updateLoadingRadItem(text)
            }
            return { $panel: $pl, $selected: $selected, id: id, it: it }
        }
    }

    updateRadList(lst, listId, listName) {
        const $rad = $('#wrp_radio_list')
        if ($rad.length > 0)
            $rad[0].innerHTML = ''
        this.buildRadListItems(lst, listId, listName)
        wrpp.filteredListCount = lst.length
        wrpp.updateBindings()
        if (settings.debug.trace)
            logger.log('update rad list')
    }
}