/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// store items dynamic properties
// is a cache object key -> properties

class PropertiesStore {

    data = {}

    constructor() {
        this.init()
    }

    init() {
        this.data[StoreObjectKeyName] = 'properties'
    }

    toObject() {
        return this.data
    }

    fromObject(o) {
        this.data = o
        this.init()
    }

    getProps(item) {
        return {
            metadata: item.metadata,
            favLists: item.favLists
        }
    }

    setProps(item, props) {
        item.metadata = props.metadata
        item.favLists = props.favLists
    }

    save(item) {
        wrpp.checkItemKey(item)
        const key = item.key
        this.data[key] = this.getProps(item)
    }

    load(item) {
        const key = item.key
        const props = this.data[key]
        if (p)
            setProps(item, props)
    }

    check(item) {
        const key = item.key
    }
}