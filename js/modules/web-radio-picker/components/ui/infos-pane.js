/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class InfosPane {

    wrpp = null

    init(wrpp) {
        this.wrpp = wrpp
        return this
    }

    initEventsHandlers() {
        ui.onResize.push(async () => {
            await this.updateInfoPaneOnResize()
        })

        app.startFramePermanentOperations.push(() => {
            this.updateInfoPaneOnEndOfFrame()
        })
    }

    initInfoPane() {
        const $pane = $('#opts_wrp_inf')
        const txt = (s, cl) => {
            const isjq = typeof s == 'object'
            const txt = !isjq ? s : ''
            const $n = $('<div class="' + cl + '">' + txt + '</div>')
            if (isjq) $n.append(s)
            $pane.append($n)
        }
        const name = s => {
            txt(s, 'wrp-inf-name')
        }
        const val = (s, id) => {
            if (typeof s != 'object')
                s = $('<span id="' + id + '">' + s + '</span>')
            txt(s, 'wrp-inf-val')
        }
        const w = (k, v) => {
            name(k)
            val(v, 'ifp_' + k.replaceAll(' ', '_'))
        }
        const appinf = '?'//await this.getRelatedApps()
        w('app', settings.app.wrp.version + ' ' + settings.app.wrp.verDate)
        if (appinf != '?')
            val(appinf)
        w('user agent', navigator.userAgent)
        const brand = navigator.userAgentData?.brands.map(x => x?.brand)?.join(' | ')
        w('brand', brand)
        w('iphone', settings.features.constraints.isIPhone ? 'yes' : 'no')
        w('window size', this.getWindowSizeText())
        w('platform', settings.sys.platformText)
        w('mobile', settings.sys.mobile ? 'yes' : 'no')
        var ps = window.location.search
        if (ps == null || ps === undefined || ps == '') ps = '-'
        w('parameters', ps)
        w('FPS', this.getFPS())
        w('sampling', settings.input.bufferSize + ' bytes, '
            + frequency(app.channel?.audioContext?.sampleRate).text2
        )
        w('FFT', settings.input.bufferSize * 2 + ' bytes, '
            + settings.fft.bars + ' bars'
        )
        const sep = () => {
            w($('<br>'), '')
            w($('<hr>'), '')
            w($('<br>'), '')
        }
        sep()

        w('credits', 'icons by <a href="https://icons8.com/" target="blank">Icons8</a>')
        val('testing by Gaspard Moyrand', 'ifp_tgp')
        w('project readme',
            $('<a href="https://github.com/franck-gaspoz/web-radio-podcast-picker/blob/main/README.md" target="_blank">https://github.com/franck-gaspoz/web-radio-podcast-picker/blob/main/README.md</a>'))

        sep()

        const cpy =
            `Web Radio Podcast Picker
Copyright(C) 2025 Franck Gaspoz
contact: <a href="mailto:franck.gaspoz@gmail.com">franck.gaspoz@gmail.com</a>

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation version 2.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
`
        txt(cpy.replaceAll('\n', '<br>'), 'wrp-inf-val')
    }

    toggleInfos() {
        const uiState = this.wrpp.uiState
        const $but = $('#btn_wrp_infos')
        const $pane = $('#wrp_inf_pane')
        const $radPane = $('#wrp_radio_list')
        $but.toggleClass('selected')
        $pane.toggleClass('hidden')
        $radPane.toggleClass('hidden')
        var scPane = null
        var rd = null
        if (!$pane.hasClass('hidden')) {
            $('#opts_wrp_inf').empty()
            this.initInfoPane()
            scPane = 'opts_wrp_inf'
            rd = uiState.RDList(RadioList_Info, null, null)
        }
        else {
            scPane = 'wrp_radio_list'
            rd = uiState.currentRDList_Back
        }
        if (settings.features.swype.enableArrowsButtonsOverScrollPanes)
            ui.scrollers.update(scPane)
        // TODO: change call target
        this.wrpp.setCurrentRDList(rd)
    }

    hideInfoPane() {
        const $pane = $('#wrp_inf_pane')
        if (!$pane.hasClass('hidden'))
            this.toggleInfos()
    }

    async updateInfoPaneOnResize() {
        $('#ifp_window_size').text(this.getWindowSizeText())
    }

    updateInfoPaneOnEndOfFrame() {
        $('#ifp_FPS').text(this.getFPS())
    }

    async getRelatedApps() {
        const installedRelatedApps = await navigator.getInstalledRelatedApps?.()
        if (!installedRelatedApps || installedRelatedApps.length == 0) return '?'
        const s = ''
        for (var o in installedRelatedApps)
            s += o.platform + ',' + o.id + ',' + o.url
        return s
    }

    getWindowSizeText() {
        return cui.viewSize().width + ' x ' + cui.viewSize().height
    }

    getFPS() {
        return 'lim=' + settings.ui.maxRefreshRate + ' cur=' + vround2(app.frameAvgFPS)
    }

}