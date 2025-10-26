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

    $getPanel(listId) {
        return $('#' + this.listIdToPaneId[listId])
    }

    updateListView(listId) {
        if (settings.debug.info)
            logger.log('update list view: ' + listId)
        const self = podcasts.podcastsLists
        const sel = self.podcasts.selection

        const paneId = self.listIdToPaneId[listId]
        const $pl = $('#' + paneId)
        $pl[0].innerHTML = ''

        switch (listId) {
            case Pdc_List_Lang:
                listsBuilder.buildNamesItems(
                    paneId,
                    self.podcasts.langItems,
                    RadioList_Podcast,
                    self.openLang,
                    (name, data) => data.qty
                )
                break;
            case Pdc_List_Tag:
                listsBuilder.buildNamesItems(
                    paneId,
                    self.podcasts.tagItems,
                    RadioList_Podcast,
                    self.openTag,
                    (name, data) => data.qty,
                    firstCharToUpper
                )
                break;
            case Pdc_List_Pdc:
                listsBuilder.buildNamesItems(
                    paneId,
                    self.podcasts.pdcItems,
                    RadioList_Podcast,
                    self.openPdc,
                    (name, data) => ''
                )
                break
            default:
                break
        }

        if (!self.podcasts.initializedLists[listId])
            self.podcasts.initializedLists[listId] = true
    }

    openLang(e, $item) {
        podcasts.podcastsLists.openList(
            e,
            $item,
            Pdc_List_Lang,
            name => podcasts.langItems[name],
            (selection, item) => selection.lang = { item: item },
            selection => selection.langSubListId
        )
    }

    openTag(e, $item) {
        podcasts.podcastsLists.openList(
            e,
            $item,
            Pdc_List_Tag,
            name => podcasts.tagItems[name],
            (selection, item) => selection.tag = { item: item },
            selection => selection.tagSubListId
        )
    }

    openPdc(e, $item) {
        const name = $item.attr('data-text')
        if (settings.debug.debug)
            logger.log('open pdc: ' + name)
    }

    openList(e, $item, listId, getItemFunc, updateSelectionFunc, getSubListIdFunc) {
        const name = $item.attr('data-text')
        const item = getItemFunc(name)

        if (settings.debug.debug)
            console.log('select lang item: ' + name)

        const self = podcasts.podcastsLists
        const { $e, isDisabled, isSelected, isAccepted } = self.getItemProps(e, $item)
        if (isDisabled) return

        // #region select item
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
        // #endregion

        // update selection
        const selection = podcasts.selection
        updateSelectionFunc(selection, item)

        podcasts
            .resetSelectionsById(listId)
            .updateSelectionSubListsIds(selection)

        // switch to tab
        const targetTabId = podcasts.listIdToTabId[getSubListIdFunc(selection)]
        $('#' + targetTabId).click()

        settings.dataStore.saveUIState()
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
        // TODO: if emmission item, should be foldable
        // TODO: also if add a text under the name for some particular purpose (eg. description)
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
        const propsPropName = settings.dataProvider.propsPropName

        switch (listId) {
            case Pdc_List_Lang:
                subListId = selection.lang != null ?
                    Pdc_List_Tag : null
                break
            case Pdc_List_Tag:
                if (selection.tag != null) {
                    //if (selection.tag.item)
                    const tagItem = selection.tag.item
                    const ref = index[selection.lang.item.code][tagItem.name]
                    if (ref[propsPropName]) {
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

    buildItems(listId) {
        if (settings.debug.debug)
            logger.log('build items: ' + listId)
        const self = this//podcasts.podcastsLists

        const index = self.podcasts.index
        switch (listId) {
            case Pdc_List_Lang: self.buildLangItems(index)
                return
            case Pdc_List_Tag: self.buildTagsItems(index)
                return
            case Pdc_List_Letter: self.buildLettersItems(index)
                break
            case Pdc_List_Pdc: self.getAndBuildPdcItems(index)
                break
            default:
                break
        }
    }

    buildLangItems(index) {
        const langItems = {}
        const t = index.props.langs
        for (const langk in t) {
            const lang = t[langk]
            const langItem =
                this.podcastItem(
                    lang.code,
                    lang.name,
                    lang.count
                )
            langItems[lang.name] = langItem
        }
        this.podcasts.langItems = langItems
    }

    buildLettersItems(index) {

    }

    buildTagsItems(index) {
        const tagItems = {}
        const countPropName = settings.dataProvider.countPropName
        const storesPropName = settings.dataProvider.storesPropName
        const propsPropName = settings.dataProvider.propsPropName
        const langk = this.podcasts.selection.lang.item.name
        const langRef = index.props.langs[langk]
        const langTags = index.langs[langRef.code]

        const tagsk = Object.getOwnPropertyNames(langTags)
            .filter(x => x != countPropName && x != propsPropName)

        tagsk.forEach(tagk => {
            const tag = langTags[tagk]
            var count = 0

            var props = Object.getOwnPropertyNames(tag)
            if (props.includes(propsPropName)) {
                // no letters
                count += tag[propsPropName][countPropName]
            }

            props = props
                .filter(x => x != countPropName && x != propsPropName)

            if (props.length > 0) {
                // letters
                props.forEach(prop => {
                    count += tag[prop][propsPropName][countPropName]
                })
            }

            const tagItem =
                this.podcastItem(
                    null,
                    tagk,
                    count
                )
            tagItems[tagItem.name] = tagItem
        })
        this.podcasts.tagItems = tagItems
    }

    getAndBuildPdcItems(index) {
        const sel = podcasts.selection
        const langk = sel.lang.item.code
        const tagk = sel.tag.item.name
        const letterk = sel.letter?.item?.name
        remoteDataStore.getPodcastsList(
            langk,
            tagk,
            letterk,
            (data) => {
                podcasts.podcastsLists.buildPdcItems(index, data)
            }
        )
    }

    buildPdcItems(index, data) {
        console.log(data)
    }
}
