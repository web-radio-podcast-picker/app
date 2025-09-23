/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class RadiosLists {

    // radio lists
    lists = []

    init() {

    }

    addList(name) {
        if (!this.lists[name])
            this.lists[name] = this.radioList(name)
    }

    getList(name) {
        return this.lists[name]
    }

    findListItem(name, containerId) {
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

    // radio list model
    radioList(name) {
        return {
            name: name,
            items: []
        }
    }

    // radio reference model - locate a radio in a list
    radioRef() {
        return {
            listName: null,
            category: null,
            item: null
        }
    }

}