/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class RadiosLists {

    // radio lists
    lists = {}

    init() {

    }

    addList(listId, name) {
        if (!this.lists[name])
            this.lists[name] = this.radioList(listId, name)
    }

    getList(name) {
        return this.lists[name]
    }

    findListItemByName(name, containerId) {
        const $items = $('#' + containerId).find('.wrp-list-item')
        const t = $items.map((i, e) => {
            return {
                name: e.childNodes[0].textContent,
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

    // radio list model
    radioList(listId, name) {
        return {
            listId: listId,
            name: name,
            items: []
        }
    }

    toJSON() {
        return JSON.stringify(this.lists)
    }

    fromJSON(str) {
        this.lists = JSON.parse(str)
    }
}