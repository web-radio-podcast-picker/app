/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class ListsBuilder {

    buildTagItems() {
        const $tag = $('#opts_wrp_tag_list')
        const keys = Object.keys(wrpp.items)
        var i = 0
        keys.forEach(k => {
            const { item, $item } = radListBuilder.buildListItem(
                ifQuoteUnQuote(k),
                i,
                i,
                { count: wrpp.items[k].length },
                null,
                null,
                null
            )
            i++
            this.initListItem($tag, item, $item, wrpp.items[k],
                uiState.RDList(RadioList_Tag, k, $item))
            $tag.append($item)
        })
        return this
    }

    buildArtItems() {
        this.buildNamesItems('opts_wrp_art_list', wrpp.itemsByArtists, RadioList_Art)
        return this
    }

    buildLangItems() {
        this.buildNamesItems('opts_wrp_lang_list', wrpp.itemsByLang, RadioList_Lang)
        return this
    }

    favoriteListItemOpts(lst) {
        return { count: lst.length }
    }

    buildListsItems() {
        const $pl = $('#opts_wrp_play_list')
        const t = radiosLists.lists
        const names = getSortedNames(t)
        var i = 0
        names.forEach(name => {
            const lst = t[name].items
            const { item, $item } = radListBuilder.buildListItem(
                name,
                i,
                i,
                this.favoriteListItemOpts(lst),
                null,
                null,
                null
            )
            i++
            this.initListItem($pl, item, $item, lst,
                uiState.RDList(RadioList_List, name, $item)
            )
            $pl.append($item)
        })
        return this
    }

    updateListsItems() {
        const $pl = $('#opts_wrp_play_list')
        const $selected = $pl.find('.item-selected')
        const id = $selected.attr('data-id')
        const y = $pl.scrollTop()

        if ($pl.length > 0)
            $pl[0].innerHTML = ''
        this.buildListsItems()

        $pl.scrollTop(y)
        if (id !== undefined) {
            // restore selection
            const it = wrpp.getPlaysListsItemById(id)
            if (it != null) {
                it.item.scrollIntoView(ScrollIntoViewProps)
                const $item = $(it.item)
                const name = $item.attr('data-text')
                $item.addClass('item-selected')
                // unfold
                radsItems.buildFoldableItem(
                    null,
                    $item,
                    RadioList_List,
                    name,
                    this.favoriteListItemOpts(
                        radiosLists.getList(name)
                    ),
                    true
                )
            }
            return { $panel: $pl, $selected: $selected, id: id, it: it }
        }
        return { $panel: $pl, $selected: $selected, id: id, it: null }
    }

    buildNamesItems(containerId, itemsByName, listId) {
        const $container = $('#' + containerId)
        var i = 0
        const btns = []
        const keys = Object.keys(itemsByName)
        var j = 0
        keys.forEach(name => {
            const { item, $item } = radListBuilder.buildListItem(
                name,
                j,
                j,
                {
                    count: ''
                },
                null,
                null,
                null)
            j++
            btns[name] = $item
            this.initListItem($container, item, $item, itemsByName[name],
                uiState.RDList(listId, name, $item))
            $container.append($item)
        })

        keys.forEach(name => {
            const cnt = itemsByName[name].length
            this.setupItemOptions(
                btns[name],
                {
                    count: cnt
                }
            )
        })

        return this
    }

    setupItemOptions($artBut, opts) {
        const $n = $artBut.find('.wrp-list-item-box')
        $n.text(opts.count)
    }

    initListItem($container, item, $item, t, currentRDList) {
        const $textContainer = $item.find('.wrp-list-item-text-container')

        $textContainer.on('click', e => {
            const $e = $(e.currentTarget)
            if ($e.hasClass('but-icon-disabled')) return
            const isSelected = $item.hasClass('item-selected')

            if (currentRDList.listId == RadioList_List
                && uiState.favoriteInputState
                && !isSelected
            )
                // favorite select
                favorites.endAddFavorite($item, currentRDList, false)

            else {

                if (isSelected) return

                // clear selections & unbuild folded items
                wrpp.clearListsSelection()

                if (currentRDList.listId == RadioList_List) {

                    radsItems

                        // unfold
                        .buildFoldableItem(
                            null,
                            $item,
                            currentRDList.listId,
                            currentRDList.name,
                            this.favoriteListItemOpts(
                                radiosLists.getList(currentRDList.name)
                            ),
                            true
                        )
                }

                // select
                infosPane.hideInfoPane()
                $item.addClass('item-selected')
                radListBuilder
                    .updateRadList(
                        t,
                        currentRDList.listId,
                        currentRDList.name)
                wrpp.setCurrentRDList(currentRDList)

            }
        })
    }
}