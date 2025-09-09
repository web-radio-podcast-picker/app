// parse & generate podcasts langs files & data

// input: languages.json
lang = {

    gl: [],

    run: function () {
        console.log('run')

        langs.forEach(n => {

            //console.log(n)
            n = n.toLowerCase()

            const lst = n.split(',')
            lst.forEach(x => {

                x = x.trim()
                const t = x.split('-')
                const t2 = x.split('_')

                const prs = (s, t) => {
                    if (t.length != 2) return
                    if (langs.includes(t[0])) {
                        this.addToCat(t[0], s)
                    }
                }

                if (t.length == 2 || t2.length == 2) {
                    prs(x, t)
                    prs(x, t2)
                } else {
                    this.addToCat(x, x)
                }
            })
        })

        console.log(this.gl)
    },

    addToCat(s, n) {
        if (this.gl[s] === undefined)
            this.gl[s] = []
        if (!this.gl[s].includes(n))
            this.gl[s].push(n)
    }
}