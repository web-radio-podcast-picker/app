/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class PodcastRSSParser {

    parse(str) {
        const parser = new DOMParser()

        if (settings.debug.debug)
            window.str = str

        const xmlDoc = parser.parseFromString(str, 'application/xml')

        // channel infos

        const channel = xmlDoc.querySelector('channel')
        const e = null

        // channel global data

        const podcast = {
            title: channel.querySelector('title')?.textContent || e,
            link: channel.querySelector('link')?.textContent || e,
            description: channel.querySelector('description')?.textContent || e,
            language: channel.querySelector('language')?.textContent || e,
            copyright: channel.querySelector('copyright')?.textContent || e,
            lastBuildDate: channel.querySelector('lastBuildDate')?.textContent || e,
            generator: channel.querySelector('generator')?.textContent || e,
            managingEditor: channel.querySelector('managingEditor')?.textContent || e,
            webMaster: channel.querySelector('webMaster')?.textContent || e,
            itunes: {
                author: channel.querySelector('itunes\\:author')?.textContent || e,
                subtitle: channel.querySelector('itunes\\:subtitle')?.textContent || e,
                summary: channel.querySelector('itunes\\:summary')?.textContent || e,
                explicit: channel.querySelector('itunes\\:explicit')?.textContent || e,
                type: channel.querySelector('itunes\\:type')?.textContent || e,
                owner: {
                    name: channel.querySelector('itunes\\:owner itunes\\:name')?.textContent || e,
                    email: channel.querySelector('itunes\\:owner itunes\\:email')?.textContent || e
                },
                image: channel.querySelector('itunes\\:image')?.getAttribute('href') || e,
                categories: Array.from(channel.querySelectorAll('itunes\\:category'))
                    .map(cat => cat.getAttribute('text'))
            },
            image: channel.querySelector('image > url')?.textContent || e,
            episodes: []
        }

        // channel episodes

        const items = channel.querySelectorAll('item')

        podcast.episodes = Array.from(items).map(item => ({
            title: item.querySelector('title')?.textContent || e,
            pubDate: item.querySelector('pubDate')?.textContent || e,
            guid: item.querySelector('guid')?.textContent || e,
            audioUrl: item.querySelector('enclosure')?.getAttribute('url') || e,
            duration: item.querySelector('itunes\\:duration')?.textContent || e,
            summary: item.querySelector('itunes\\:summary, summary')?.textContent || e,
            description: item.querySelector('description')?.textContent || e,
            explicit: item.querySelector('itunes\\:explicit')?.textContent || e,
            episodeType: item.querySelector('itunes\\:episodeType')?.textContent || e,
            image: item.querySelector('itunes\\:image')?.getAttribute('href') || e
        }))

        if (settings.debug.debug)
            console.log(podcast)

        return podcast
    }


}
