/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class RadListPathBuilder {

    listIdToLabel(listId) {
        var id = listId
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

    buildPath(listId, listName) {
        const id = this.listIdToLabel(listId)
        const $p = $('#wrp_rad_list_ref')
        $p[0].innerHTML = ''
        if (listId == RadioList_All) return
        const $listIdBut = this.buildPathButton(listId, listId, id, true, true)
        const $listNameBut = this.buildPathButton(listId, listName, listName, false)
        $p.append($listIdBut)
        $p.append($listNameBut)
    }

    buildPathButton(listId, id, text, isTab, hasRightMargin) {
        const rm = hasRightMargin ? ' margin-right' : ''
        const selected = !isTab ? 'selected' : ''
        const $but = $(`<span data-id="${id}" class="menu-item menu-item-blue onoff-small-height no-width ${rm} ${selected}">${text}</span>`)
        $but.on('click', () => {
            this.selectPath(listId, id, isTab)
        })
        return $but
    }

    selectPath(listId, listName, isTab) {
        if (isTab)
            uiState.setTab(listId)
    }
}