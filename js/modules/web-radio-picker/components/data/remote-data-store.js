/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class RemoteDataStore {

    getPodcastsIndex(callback) {
        const url = this.storeUrl(settings.dataProvider.stationsStoreIndex)
            + 'podcasts-flat-index.txt'
        this.get(url, callback)
    }

    getPodcastsList(store, langCode, tagName, letterName, callback) {

        var url = this.storeUrl(store)
            + settings.dataProvider.podcastStoreRootFolder + '/'
            + toHex(langCode) + '/'
            + toHex(tagName) + '/'
        if (letterName != null)
            url += toHex(letterName) + '/'
        url += 'list.txt'

        this.get(url, callback)
    }

    storeUrl(index) {
        const url = settings.dataProvider.baseUrl
            + 'data' + index + '/'
        return url
    }

    get(url, callback) {
        if (settings.debug.debug)
            logger.log('GET ' + url)
        fetch(url)
            .then(response => {
                if (response.ok) return response.text()
                else throw new Error(response.statusText + ' ' + response.url)
            })
            .then(data => callback(data)) // you can use response body here
    }
}