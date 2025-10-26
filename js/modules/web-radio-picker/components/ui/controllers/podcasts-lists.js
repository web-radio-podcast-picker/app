/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class PodcastsLists {

    paneId = 'opts_wrp_podcast'

    listIdToPaneId = {}

    constructor(podcasts) {
        this.podcasts = podcasts
        this.listIdToPaneId[Pdc_List_Lang] = 'opts_wrp_podcast_lang'
        this.listIdToPaneId[Pdc_List_Tag] = 'opts_wrp_podcast_tag'
        this.listIdToPaneId[Pdc_List_Letter] = 'opts_wrp_podcast_alpha'
        this.listIdToPaneId[Pdc_List_Pdc] = 'opts_wrp_podcast_pdc'
    }

    updateListView(listId) {
        if (settings.debug.info)
            logger.log('update list view: ' + listId)

        const paneId = this.listIdToPaneId[listId]
        const $pl = $('#' + paneId)
        $pl[0].innerHTML = ''

        switch (listId) {
            case Pdc_List_Lang:
                listsBuilder.buildNamesItems(
                    paneId,
                    this.podcasts.langItems,
                    RadioList_Podcast,
                    this.openLang,
                    (name, data) => data.qty
                )
                break;
            default:
                break;
        }

        this.podcasts.initializedLists[listId] = true
    }

    openLang(e, $item) {
        const name = $item.attr('data-text')
        if (settings.debug.debug)
            console.log('select lang item: ' + name)

        const self = podcasts.podcastsLists
        const item = podcasts.langItems[name]

        const { $e, isDisabled, isSelected, isAccepted } = self.getItemProps(e, $item)
        if (isDisabled) return
        wrpp.clearContainerSelection(self.paneId)
        // fold any unfolded list item
        radsItems.unbuildFoldedItems(self.paneId)
        // unfold selection
        /*radsItems.buildFoldableItem(
            null,
            $item,
            RadioList_Podcast,
            Pdc_List_Lang,
            item.qty,
            true,
            true,
        )*/
        $item.addClass('item-selected')
        podcasts.selection.lang = {
            item: item
        }
    }

    findListItemInView(paneId, item) {
        const $panel = $('#' + paneId)
        const $item = $panel.find('[data-text="' + item.name + '"]')
        return $item
    }

    selectItem(listId, item) {
        const paneId = this.listIdToPaneId[listId]
        wrpp.clearContainerSelection(paneId)
        // fold any unfolded list item
        radsItems.unbuildFoldedItems(paneId)
        const $item = this.findListItemInView(paneId, item)
        $item.addClass('item-selected')
        $item[0].scrollIntoView(ScrollIntoViewProps)
    }

    getItemProps(e, $item) {
        const $e = $(e.currentTarget)
        const isDisabled = $item.hasClass(Class_Icon_Disabled)
        const isSelected = $item.hasClass(Class_Item_Selected)
        const isAccepted = !isDisabled && !isSelected
        if (isDisabled) return { $e: $e, isDisabled: true, isSelected: isSelected, isAccepted: isAccepted }
        return { $e: $e, isDisabled: isDisabled, isSelected: isSelected, isAccepted: isAccepted }
    }

    getSubListId(selection, listId) {
        var subListId = null
        const index = this.podcasts.index.langs
        const countProp = settings.dataProvider.countPropName

        switch (listId) {
            case Pdc_List_Lang:
                subListId = selection.lang != null ?
                    Pdc_List_Tag : null
                break
            case Pdc_List_Tag:
                if (selection.tag != null) {
                    //if (selection.tag.item)
                    const tagItem = selection.tag.item
                    const ref = index[tagItem.code]
                    if (ref[countProp]) {
                        // no letters
                        subListId = Pdc_List_Pdc
                    } else {
                        // letters
                        subListId = Pdc_List_Letter
                    }
                }
                break
            case Pdc_List_Letter:
                if (selection.letter != null)
                    subListId = Pdc_List_Pdc
                break
            // TODO: no subs for pdc at the moment. later must add the parsed emission list by podcast
            case Pdc_List_Pdc:
                break
        }
        return subListId
    }

    // podcast item model
    podcastItem(code, name, qty, favorites) {
        const o = {
            code: code,
            name: name,
            qty: qty
        }
        if (favorites)
            o.favLists = favorites
        return o
    }

    buildLangItems(index) {
        const langItems = {}
        index.props.langs.forEach(lang => {
            const langItem =
                this.podcastItem(
                    lang.code,
                    lang.name,
                    lang.count
                )
            langItems[lang.name] = langItem
        })
        return langItems
    }

    buildLettersItems() {

    }

    buildTagsItems() {

    }
}
