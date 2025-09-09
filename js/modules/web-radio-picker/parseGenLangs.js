// parse & generate podcasts langs files & data

// input: languages.json
lang = {

    gl: [],
    langKeys: [],

    run: function () {
        console.log('run')

        // lang keys translations

        const trsk = Object.getOwnPropertyNames(langTrs)
        trs = []
        langs.forEach(tn => {
            const n = this.normalizeName(tn[0])
            this.langKeys.push(n)
            if (trsk.includes(n)) {
                const nk = langTrs[n]
                trs[n] = nk
            }
        })
        this.trs = trs

        // lang name -> groups

        langs.forEach(tn => {

            var n = tn[0]
            const q = tn[1]
            //console.log(n)

            const lst = n.split(',')
            lst.forEach(x => {

                // fix/translate lang key
                x = this.normalizeName(x)
                var trsl = null
                if (trsk.includes(x)) {
                    x = langTrs[x]
                    trsl = x
                }

                const t = x.split('-')
                const t2 = x.split('_')

                const prs = (s, t, q) => {
                    if (t.length != 2) return
                    const baseName = this.normalizeName(t[0])
                    if (this.langKeys.includes(baseName)) {
                        this.addToCat(baseName, s, q)
                        //if (trsl!=null)
                    }
                    else {
                        this.addToCat(s, s, q)
                        //if (trsl!=null)
                    }
                }

                if (t.length == 2 || t2.length == 2) {
                    prs(x, t, q)
                    prs(x, t2, q)
                } else {
                    this.addToCat(x, x, q)
                }
            })
        })

        // langs -> unclassified
        const u = []
        gl2 = []

        for (tnk in this.gl) {
            const tn = this.gl[tnk]
            const t = tn[0]
            var k = 0
            var lang = null
            t.forEach(n => {
                const ln = this.findLang(n)
                if (lang == null && ln != null)
                    lang = ln
                k += ln == null ? 0 : 1
            })
            if (k == 0) {
                // lang unknown
                u[tnk] = tn
            } else {
                tn.push(lang)
            }
        }

        // remove unclassified
        for (tnk in u) {
            const tn = u[tnk]
            delete this.gl[tnk]
        }

        // rebuild keys
        for (tnk in this.gl) {
            const tn = this.gl[tnk]
            gl2[tn[2].en] = tn
        }
        this.gl = gl2

        console.log(Object.getOwnPropertyNames(u).length)
        console.log(u)

        console.log('')

        console.log(Object.getOwnPropertyNames(this.gl).length)
        console.log(this.gl)
    },

    findLang(n) {
        const t = this.langRef
        res = null
        for (lnk in t) {
            const ln = t[lnk]
            if (ln['639-1'] == n
                || ln['639-2'] == n
                || ln.de == n
                || ln.en == n
                || ln.fr == n
            ) {
                res = ln
                return res
            }
        }
        return res
    },

    normalizeName(s) {
        if (s === undefined || s == null) return
        return s
            .replaceAll('"', '')
            .replaceAll('[', '')
            .replaceAll(']', '')
            .replaceAll('(', '')
            .replaceAll(')', '')
            .replaceAll('.', '')
            .replaceAll('$', '')
            .replaceAll('#', '')
            .replaceAll('<', '')
            .replaceAll('>', '')
            .replaceAll('?', '')
            .replaceAll("'", '')
            .toLowerCase()
            .trim()
    },

    addToCat(s, n, q) {
        if (this.gl[s] === undefined)
            this.gl[s] = [[], 0]
        if (!this.gl[s][0].includes(n)) {
            this.gl[s][0].push(n)
        }
        this.gl[s][1] += q
    },

    async init() {
        await this.loadJSON()
        this.run()
    },

    async loadJSON() {
        const r = await fetch('./iso-639-2.json')
        this.langRef = await r.json()
    }
}

document.addEventListener('DOMContentLoaded', function () {
    lang.init()
}, false)
