/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class TabsController {

    tabs = ['btn_wrp_tag_list',
        'btn_wrp_lang_list',
        'btn_wrp_art_list',
        'btn_wrp_podcast',
        'btn_wrp_play_list',
        'btn_wrp_logo']

    pdcTabs = [
        'btn_wrp_podcast_lang',
        'btn_wrp_podcast_tag',
        'btn_wrp_podcast_alpha',
        'btn_wrp_podcast_page'
    ]

    infTabs = ['btn_wrp_inf', 'btn_wrp_set', 'btn_log_pane']

    // ask to not change current tab automatically (eg. case restore ui state)
    preserveCurrentTab = false

    tabBeforeOpenPdc = null
    pdcTabSelected = false

    initTabs() {
        ui.tabs.initTabs(this.tabs, {
            onChange: $c => {
                this.onTabChange($c)
            },
            onPostChange: ($c) => {
                this.onTabChanged($c)
            }
        })
        ui.tabs.initTabs(this.infTabs, {
            onPostChange: ($c) => {
                this.onInfTabChanged($c)
            }
        })
    }

    tabControlToPaneId($tab) {
        return $tab.attr('id').replace('btn_', 'opts_')
    }

    onInfTabChanged($tab) {
        if (settings.features.swype.enableArrowsButtonsOverScrollPanes)
            ui.scrollers.update(
                this.tabControlToPaneId($tab))
    }

    // #region ----- lists tabs -----

    onTabChange($tab) {
        const tabId = ui.tabs.selectedTabId(this.tabs)
        if (tabId != null && tabId != 'btn_wrp_podcast')
            this.tabBeforeOpenPdc = tabId
    }

    onTabChanged($tab) {
        const c = $tab[0]
        var cid = c.id
        const $cnv = $(app.canvas)

        // #region close or activate podcast menu

        if (cid == 'btn_wrp_podcast') {
            // reclick on 'podcast' -> close podcast menu
            if (this.pdcTabSelected) {
                this.pdcTabSelected = false
                // go back to tabBeforeOpenPdc
                ui.tabs.selectTab(this.tabBeforeOpenPdc, this.tabs)
                cid = this.tabBeforeOpenPdc
                if (this.tabBeforeOpenPdc == 'btn_wrp_logo')
                    ui.vizTabActivated = true
            }
            else {
                this.pdcTabSelected = true
            }

        } else
            this.pdcTabSelected = false

        if (this.pdcTabSelected)
            this.showPDCTabs()
        else {
            if (cid != 'btn_wrp_podcast')
                this.tabBeforeOpenPdc = cid
            this.showNonPDCListsTabs()
        }

        // #endregion

        if (cid == 'btn_wrp_logo') {
            $cnv.removeClass('hidden')
            ui.vizTabActivated = true
        }
        else {
            $cnv.addClass('hidden')
            ui.vizTabActivated = false
        }

        uiState.updateCurrentTab(c.id)

        return this
    }

    focusTabSelectedItem($tab) {
        const $pane = $('#' + this.tabControlToPaneId($tab))
        const $selected = $pane.find('.item-selected')
        if ($selected.length > 0)
            wrpp.focusListItem($selected[0], false)
        return this
    }

    selectTab(tabId) {
        this.pdcTabSelected = tabId == 'btn_wrp_podcast'
        if (!this.pdcTabSelected)
            this.showNonPDCListsTabs()

        ui.tabs.selectTab(tabId, this.tabs)
        return this
    }

    showNonPDCListsTabs() {
        this.tabs.forEach(tabId => {
            $('#' + tabId).removeClass('hidden')
        })
        this.pdcTabs.forEach(tabId => {
            $('#' + tabId).addClass('hidden')
        })
        $('#btn_wrp_podcast').removeClass('selected')
    }

    showPDCTabs() {
        this.tabs.forEach(tabId => {
            $('#' + tabId).addClass('hidden')
        })
        this.pdcTabs.forEach(tabId => {
            $('#' + tabId).removeClass('hidden')
        })
        $('#btn_wrp_podcast')
            .removeClass('hidden')
            .removeClass('selected')
        $('#btn_wrp_logo').removeClass('hidden')

    }

    // #endregion
}