/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

const DbLogPfx = '[$$] '

class Db {

    dbName = 'wrpp'
    dbVer = 1
    db = null   // open db
    favoritesStoreName = 'favorites'
    propertiesStoreName = 'properties'
    uiStateStoreName = 'uistate'
    dbReady = false
    #count = 0
    onDbReady = null

    /**
     * open the db. creates it if necessary
     * callback onDbReady when done
     * @param {Function} onDbReady 
     * @returns 
     */
    openDb(onDbReady) {
        this.onDbReady = onDbReady
        const req = indexedDB.open(this.dbName, this.dbVer)
        req.onerror = e => this.dbError(e)
        req.onsuccess = e => {
            this.db = e.target.result
            this.dbReady = true
            if (settings.debug.debug)
                logger.log(DbLogPfx + 'db ready')
            if (this.onDbReady) this.onDbReady()
        }
        req.onupgradeneeded = e => this.createDb(e.target.result)
        return this
    }

    /**
     * create the db
     * @param {IDBDatabase} db 
     */
    createDb(db) {

        if (settings.debug.debug) logger.log(DbLogPfx + 'create db')

        const checkReady = () => {
            this.#count++
            this.dbReady = this.#count == 3
            if (this.dbReady) {
                if (settings.debug.debug)
                    logger.log(DbLogPfx + 'db ready')
                if (this.onDbReady) this.onDbReady()
            }
        }

        // favorites : items without key
        const favoritesStore = db.createObjectStore(
            this.favoritesStoreName, { autoIncrement: true, unique: false })
        // properties : items by key 'key' (key==name+url)
        const propertiesStoreName = db.createObjectStore(
            this.propertiesStoreName, { keyPath: 'key' })
        // uistate : items by key 'storeKey'
        const uiStateStore = db.createObjectStore(
            this.uiStateStoreName, { keyPath: 'storeKey' })

        favoritesStore.transaction.oncomplete = e => checkReady()
        propertiesStoreName.transaction.oncomplete = e => checkReady()
        uiStateStore.transaction.oncomplete = e => checkReady()
    }

    /**
     * save ui state data from UIState.getCurrentUIState().object
     * @param {Object} o 
     */
    saveUIState(o) {

    }

    /**
     * report any db error
     * @param {Event} e 
     */
    dbError(e) {
        console.error(e.target.error?.message)
    }
}