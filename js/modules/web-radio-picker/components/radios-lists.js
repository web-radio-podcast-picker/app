/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

const FavoritesJSONExportValidatorTag = 'WRPP-FavoritesJSONExportValidatorTag'

class RadiosLists {

    validator = FavoritesJSONExportValidatorTag

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

    deleteAllLists() {
        const ids = Object.getOwnPropertyNames(this.lists)
        ids.forEach(id => {
            if (id != [RadioList_History])
                this.deleteList(id)
        })
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
        if (list == null) return null
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

    findItemByNameAndUrl(listId, name, url) {
        const list = this.getList(listId)
        if (list == null) return null
        var res = null
        list.items.some(o => {
            if (o.name == name && o.url == url) {
                res = o
                return true
            }
            return false
        })
        return res
    }

    findListItemByName(name, containerId) {
        const $items = $('#' + containerId).find('.wrp-list-item')
        // TODO: use 'some' operator to speed up this
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
        // TODO: use 'some' operator to speed up this
        const t = $items.map((i, e) => {
            return {
                item: e,
                id: e.attributes['data-id'].value
            }
        })
        const r = t.filter((i, x) => x.id == id)
        return (r.length == 0) ? null : r[0]
    }

    findListItemByName(name, containerId) {
        const $items = $('#' + containerId).find('.wrp-list-item')
        // TODO: use 'some' operator to speed up this
        const t = $items.map((i, e) => {
            return {
                item: e,
                id: e.attributes['data-text'].value
            }
        })
        const r = t.filter((i, x) => x.id == name)
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
            isSystem: isSystem !== undefined ? isSystem : false
        }
    }

    exportToClipboard() {
        this.lists[FavoritesJSONExportValidatorTag]
            = FavoritesJSONExportValidatorTag
        const txt = this.toJSON(true)
        delete this.lists[FavoritesJSONExportValidatorTag]
        window.exportedFavorites = txt
        copyToClipboard(txt)
    }

    async importFromClipboard() {
        const txt = await readFromClipboard()
        window.importedFavorites = txt
        const o = JSON.parse(txt)
        return this.importFavoritesJSONExport(o)
    }

    importFavoritesJSONExport(o) {
        if (o[FavoritesJSONExportValidatorTag] === undefined)
            throw new Error('favorites JSON export is not a valid object')
        delete o[FavoritesJSONExportValidatorTag]
        delete o[RadioList_History]
        const names = Object.keys(o)
        if (settings.debug.info) {
            logger.log('favorites lists: ' + names.length)
            logger.log(names.join(','))
        }
        // merge favorites
        var importedItems = 0
        var importedLists = 0
        names.forEach(name => {
            const srcList = o[name]
            var tgtList = this.lists[name]
            if (tgtList === undefined) {
                // add list
                tgtList = this.radioList(srcList.listId, srcList.name, false)
                this.lists[name] = tgtList
                importedLists++
                if (settings.debug.info)
                    logger.log('add favorite list: ' + name)
            }
            // update target list
            srcList.items.forEach(srcItem => {
                const tgtItem = this.findItemByNameAndUrl(name, srcItem.name, srcItem.url)
                if (tgtItem == null) {
                    // add favorite
                    const newItem = wrpp.findRadItem(srcItem)
                    if (newItem != null) {
                        // merge favs lists
                        this.merge(srcItem.favLists, newItem.favLists)
                        // add to favlist
                        tgtList.items.push(newItem)
                        importedItems++
                        if (settings.debug.info)
                            logger.log('add to favorite list "' + name + '" : ' + srcItem.name)
                    }
                    else
                        logger.warn('skip item not in db: ' + srcItem.name)
                } else {
                    // already in target fav list. update favlist nevertheless
                    this.merge(srcItem.favLists, tgtItem.favLists)
                }
            })
        })
        if (settings.debug.info) {
            logger.log('favorites lists imported: ' + importedLists)
            logger.log('favorites imported: ' + importedItems)
        }
        return {
            importedLists: importedLists,
            importedItems: importedItems
        }
    }

    toJSON(applyFormat) {
        return !applyFormat ? JSON.stringify(this.lists)
            : JSON.stringify(this.lists, null, 2)
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

    equalTo(rdList1, rdList2) {
        return rdList1 == null
            || rdList2 == null
            || (rdList1.listId == rdList2.listId
                && rdList1.name == rdList2.name)
    }

    merge(from, into) {
        if (from == null || into == null) return
        from.forEach(x => {
            if (!into.includes(x))
                into.push(x)
        })
    }
}