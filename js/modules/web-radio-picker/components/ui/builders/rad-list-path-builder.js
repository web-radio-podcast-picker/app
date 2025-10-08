/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class RadListPathBuilder {

    listIdToLabel(listId) {
        var id = listId
        // match consts to ui texts
        switch (listId) {
            case RadioList_List:
                id = 'Favs'
                break
            case RadioList_Tag:
                id = 'Tags'
                break
            case RadioList_Lang:
                id = 'Langs'
                break
            case RadioList_Art:
                id = 'Artists'
                break
            case RadioList_All:
                id = 'All'
                break
            default: break
        }
        return id
    }

    buildRadioViewTagPath(item) {
        const $p = $('#wrp_radio_box')
        $p[0].innerHTML = ''
        if (item == null || item.groups == null) return
        // fav button
        const favs = favorites.getItemFavoritesFiltered(item)
        if (favs.length > 0) {
            const fav = favs[0]
            const $favBut = this.buildFavButton(fav)
            $p.append($favBut)
        }
        // tag path
        const w = 24
        const $img = $(`<img name="fav_but" class="small-tag-icon" src="./img/icons8-tag-50.png" width="${w}" height="${w}" alt="fav_but" class="wrp-rad-item-icon ">`)
        $p.append($img)
        var i = 0
        item.groups.forEach(grp => {
            const $but = this.buildTagPathButton(grp, i > 0)
            $p.append($but)
            i++
        });
        // artist == listName, if any
        if (item.artist == null || item.artist === undefined) return;
        $p.append(this.buildRightChevron())
        $p.append(this.buildArtistButton(item.artist, false))
    }

    buildTopFavPath(listId, listName) {
        const id = this.listIdToLabel(listId)
        const $p = $('#wrp_rad_list_ref')
        $p[0].innerHTML = ''
        const $p2 = $('#wrp_rad_list_ref_name')
        $p2[0].innerHTML = ''
        if (listId == RadioList_All) return
        if (listId == null || listName == null) return
        const $listIdBut = this.buildFavPathButton(listId, listId, id, true, false)
        const $listNameBut = this.buildFavPathButton(listId, listName, listName, false, false, null, null, true)
        $p.append($listIdBut)
        $p.append(this.buildRightChevron().addClass('right-chevron-extended'))
        $p2.append($listNameBut)
    }

    buildRightChevron() {
        const $img = $('<img alt="chevron" src="./img/icons8-right-arrow-24.png" class="right-chevron">')
        return $img
    }

    buildTagPathButton(grp, hasLeftMargin) {
        const rm = hasLeftMargin ? ' hmargin-left' : ''
        const $but = $(`<span data-id="${grp}" class="menu-item menu-item-blue onoff-small-height2 no-width ${rm}">${grp}</span>`)
        $but.on('click', () => {
            this.selectTagPath(grp)
        })
        return $but
    }

    buildArtistButton(artist, hasLeftMargin) {
        const rm = hasLeftMargin ? ' hmargin-left' : ''
        const $but = $(`<span data-id="${artist}" class="menu-item menu-item-blue onoff-small-height2 no-width ${rm}">${artist}</span>`)
        $but.on('click', () => {
            this.selectArtistPath(artist)
        })
        return $but
    }

    buildFavButton(fav) {
        const w = 24
        const $img = $(`<img name="fav_but" class="small-fav-icon" src="./img/icons8-heart-outline-48.png" width="${w}" height="${w}" alt="fav_but" class="wrp-rad-item-icon ">`)
        const $but = this.buildFavPathButton(
            RadioList_List,
            fav,
            fav,
            true,
            true,
            'onoff-small-height2',
            () => {
                this.selectFavList(fav)
            }
        )
        const $div = $('<span class="wrp_radio_box_fav_button"></span>')
        $div.append($img)
        $div.append($but)
        return $div
    }

    selectTagPath(grp) {
        uiState.setTab(RadioList_Tag)   // /!\ do not set currentRDList
        const cLst = uiState.currentRDList
        if (cLst == null
            || (cLst.listId != RadioList_Tag || cLst.name != grp)) {
            const listItem = wrpp.getTagsListsItemByName(grp)
            if (listItem != null) {
                const $item = $(listItem.item)
                listsBuilder.clickListItem($item)
                wrpp.focusListItem(listItem.item)
            }
        }
    }

    selectArtistPath(artist) {

    }

    buildFavPathButton(listId, id, text, isTab, hasRightMargin, cl, onClick, noClick) {
        cl = (cl == null || cl === undefined) ? 'onoff-small-height' : cl
        const rm = hasRightMargin ? ' margin-right' : ''
        const selected = !isTab ? 'selected' : ''
        const butcl = noClick == true ? '' : 'menu-item-blue'
        const $but = $(`<span data-id="${id}" class="${butcl} fav-path-button menu-item ${cl} no-width ${rm} ${selected}">${text}</span>`)
        if (noClick != true)
            $but.on('click', () => {
                this.selectFavPath(listId, id, isTab)
                if (onClick !== undefined && onClick != null)
                    onClick()
            })
        return $but
    }

    selectFavPath(listId, listName, isTab) {
        if (isTab) {
            uiState.setTab(listId)
            const cLst = uiState.currentRDList
            if (cLst == null
                || (cLst.listId != listId || cLst.name != listName)) {
                const listItem = wrpp.getPlaysListsItemByName(listName)
                if (listItem != null) {
                    const $item = $(listItem.item)
                    listsBuilder.clickListItem($item)
                    wrpp.focusListItem(listItem.item)
                }
            }
        }
    }

    selectFavList(listName) {

    }
}