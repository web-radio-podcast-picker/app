/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class ListsBuilder {

    addToHistoryTimer = null
    wrpp = null
    radListBuilder = null

    init(wrpp) {
        this.wrpp = wrpp
        this.radListBuilder = new RadListBuilder().init(this.wrpp)
        return this
    }

    buildTagItems() {
        const $tag = $('#opts_wrp_tag_list')
        const keys = Object.keys(this.wrpp.items)
        var i = 0
        keys.forEach(k => {
            const { item, $item } = this.radListBuilder.buildListItem(
                ifQuoteUnQuote(k),
                i,
                i,
                { count: this.wrpp.items[k].length },
                null,
                null,
                null
            )
            i++
            this.initBtn($tag, item, $item, this.wrpp.items[k],
                this.wrpp.uiState.RDList(RadioList_Tag, k, $item))
            $tag.append($item)
        })
        return this
    }

    buildArtItems() {
        this.buildNamesItems('opts_wrp_art_list', this.wrpp.itemsByArtists, RadioList_Art)
        return this
    }

    buildLangItems() {
        this.buildNamesItems('opts_wrp_lang_list', this.wrpp.itemsByLang, RadioList_Lang)
        return this
    }

    buildListsItems() {
        const $pl = $('#opts_wrp_play_list')
        const t = this.wrpp.radiosLists.lists
        const names = getSortedNames(t)
        var i = 0
        names.forEach(name => {
            const lst = t[name].items
            const { item, $item } = this.radListBuilder.buildListItem(
                name,
                i,
                i,
                { count: lst.length },
                null,
                null,
                null
            )
            i++
            this.initBtn($pl, item, $item, lst,
                this.wrpp.uiState.RDList(RadioList_List, name, $item)
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
            const it = this.wrpp.getPlaysListsItemById(id)
            if (it != null) {
                it.item.scrollIntoView({
                    behavior: 'instant',
                    block: 'center',
                    inline: 'center'
                })
                $(it.item).addClass('item-selected')
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
            const { item, $item } = this.radListBuilder.buildListItem(
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
            this.initBtn($container, item, $item, itemsByName[name],
                this.wrpp.uiState.RDList(listId, name, $item))
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

    initBtn($container, item, $item, t, currentRDList) {
        $item.on('click', e => {
            const $e = $(e.currentTarget)
            if ($e.hasClass('but-icon-disabled')) return
            if (currentRDList.listId == RadioList_List
                && this.wrpp.uiState.favoriteInputState
            )
                // favorite select
                this.wrpp.favorites.endAddFavorite($item, currentRDList, false)
            else {
                // normal select
                this.wrpp.infosPane.hideInfoPane()
                this.wrpp.clearListsSelection()
                $item.addClass('item-selected')
                this.radListBuilder
                    .updateRadList(t, currentRDList.listId, currentRDList.name)
                this.wrpp.setCurrentRDList(currentRDList)
            }
        })
    }
}