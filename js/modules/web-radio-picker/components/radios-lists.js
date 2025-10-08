/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class RadiosLists {

    // list id to containers ids
    listIdToPanelId = {
        'List': 'opts_wrp_play_list',
        'All': 'wrp_radio_list',
        'Art': 'opts_wrp_art_list',
        'Lang': 'opts_wrp_lang_list',
        'Tag': 'opts_wrp_tag_list',
        'rad': 'wrp_radio_list'
    }

    // radio lists
    lists = {}

    addList(listId, name, isSystem) {
        if (isSystem === undefined) isSystem = false
        if (!this.lists[name]) {
            this.lists[name] = this.radioList(listId, name, isSystem)
        }
        return this.lists[name]
    }

    addToList(name, radItem) {
        const list = this.getList(name)
        if (list == null) return
        if (list.items.includes(radItem)) return
        list.items.push(radItem)
    }

    getList(name) {
        return this.lists[name]
    }

    renameList(id, name) {
        // rename the list itself
        const list = this.getList(id)
        delete this.lists[id]
        if (list == null) return
        this.lists[name] = list
        list.name = name
        // renames list in rad items favs
        list.items.forEach(rad => {
            this.removeFavFromList(rad, id)
            rad.favLists.push(name)
        })
        return list
    }

    emptyList(name) {
        const list = this.lists[name]
        // delete in favs lists
        list.items.forEach(rad => {
            this.removeFavFromList(rad, name)
        })
        // empty the favlist
        this.lists[name].items = []
    }

    deleteList(name) {
        const list = this.lists[name]
        // delete in favs lists
        list.items.forEach(rad => {
            this.removeFavFromList(rad, name)
        })
        // delete the favlist
        delete this.lists[name]
    }

    removeFavFromList(rdItem, favName) {
        rdItem.favLists = rdItem.favLists.filter(x => x != favName)
    }

    removeFromList(item, listName) {
        item.favLists = item.favLists.filter(x => x != listName)
        const list = this.getList(listName)
        if (list == null) return
        // compare on id to support clones
        list.items = list.items.filter(x => x.id != item.id)
    }

    findItem(listId, itemId) {
        const list = this.getList(listId)
        if (list == null) return
        var res = null
        list.items.some(o => {
            if (o.id == itemId) {
                res = o
                return true
            }
            return false
        })
        return res
    }

    findListItemByName(name, containerId) {
        const $items = $('#' + containerId).find('.wrp-list-item')
        const t = $items.map((i, e) => {
            return {
                name: e.attributes['data-text'].value,
                item: e
            }
        })
        const r = t.filter((i, x) => x.name == name)
        return (r.length == 0) ? null : r[0]
    }

    findListItemById(id, containerId) {
        const $items = $('#' + containerId).find('.wrp-list-item')
        const t = $items.map((i, e) => {
            return {
                item: e,
                id: e.attributes['data-id'].value
            }
        })
        const r = t.filter((i, x) => x.id == id)
        return (r.length == 0) ? null : r[0]
    }

    findListItemByIdAndListId(id, listId) {
        const panelId = this.listIdToPanelId[listId]
        if (panelId === undefined) return null
        return this.findListItemById(id, panelId)
    }

    // radio list model
    radioList(listId, name, isSystem) {
        return {
            listId: listId,
            name: name,
            items: [],
            isSystem: false
        }
    }

    toJSON() {
        return JSON.stringify(this.lists)
    }

    fromJSON(str) {
        const t = {}
        const lists = JSON.parse(str)
        const names = Object.keys(lists)
        names.forEach(name => {
            const srcList = lists[name]
            t[name] = srcList
            const substItems = []
            // normalize props
            if (srcList.isSystem === undefined)
                srcList.isSystem = srcList.name == RadioList_History
            // transfers props
            srcList.items.forEach(item => {
                const newItem = wrpp.findRadItem(item)

                // copy dynamic properties from storage                
                if (newItem != null) {
                    newItem.favLists = [...item.favLists]
                    // fix history fav
                    if (name == RadioList_History && !newItem.favLists.includes(RadioList_History))
                        newItem.favLists.push(RadioList_History)
                    substItems.push(newItem)
                }
            })
            srcList.items = substItems
        })
        this.lists = t
        this.cleanupHistoryItemsFavorites()
    }

    cleanupHistoryItemsFavorites() {
        // delete unexisting favorites in history items
        const list = this.lists[RadioList_History]
        const listNames = Object.keys(this.lists)
        list.items.forEach(item => {
            const t = [...item.favLists]
            t.forEach(favName => {
                if (!listNames.includes(favName))
                    this.removeFavFromList(item, favName)
            })
        })
    }
}