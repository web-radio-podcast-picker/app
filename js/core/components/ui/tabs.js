/*
    Sound card Oscilloscope | Signal Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// tabs

class Tabs {

    initTabs(tabs, opts) {
        const t = this
        if (opts === undefined || opts == null) opts = {}
        tabs.forEach(e => {
            const $c = $('#' + e)
            $c.on('click', () => {
                if (!$c.hasClass('selected')
                    && !$c.hasClass('menu-item-disabled')) {

                    if (opts.onChange)
                        opts.onChange($c)

                    t.selectTab($c.attr('id'), tabs)

                    if (opts.onPostChange)
                        opts.onPostChange($c)
                }
            })
        })
        return ui
    }

    tabIdToPaneId(tabId) {
        if (tabId === undefined || tabId == null) return null
        return tabId.replace('btn_', 'opts_')
    }

    setTabPaneVisibility(tabId, vis) {
        const pId = this.tabIdToPaneId(tabId)
        const $p = $('#' + pId)
        if (!vis)
            $p.addClass('hidden')
        else
            $p.removeClass('hidden')
    }

    setSelectedTabPaneVisibility(vis, tabs) {
        const tabId = this.selectedTabId(tabs)
        this.setTabPaneVisibility(tabId, vis)
    }

    selectedTabId(tabs) {
        var r = null
        tabs.forEach(e => {
            const $t = $('#' + e)
            const pId = this.tabIdToPaneId(e)
            const $p = $('#' + pId)
            if ($t.hasClass('selected') &&
                !$t.hasClass('disabled')) {
                r = e
            }
        })
        return r
    }

    selectTab(selectedTabId, tabs) {
        tabs.forEach(e => {
            const $t = $('#' + e)
            const pId = this.tabIdToPaneId(e)
            const $p = $('#' + pId)
            if ($t.hasClass('selected') &&
                !$t.hasClass('disabled')) {
                $t.removeClass('selected')
                $p.addClass('hidden')
            }
            if ($t.attr('id') == selectedTabId) {
                $t.addClass('selected')
                $p.removeClass('hidden')
            }
        })
        ui.inputWidgets.closeInputWidget()
    }
}