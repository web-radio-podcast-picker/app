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
        const list = this.getList(id)
        delete this.lists[id]
        this.lists[name] = list
        return list
    }

    deleteList(name) {
        delete this.lists[name]
    }

    removeFromList(item, listName) {
        const list = this.getList(listName)
        if (list == null) return
        // compare on id to support clones
        list.items = list.items.filter(x => x.id != item.id)
        item.favLists = item.favLists.filter(x => x != listName)
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
                if (name == RadioList_History && !item.favLists.includes(RadioList_History))
                    item.favLists.push(RadioList_History)
                if (newItem != null)
                    newItem.favLists = item.favLists

                substItems.push(item)
            })
            srcList.items = substItems
        })
        this.lists = t
    }
}