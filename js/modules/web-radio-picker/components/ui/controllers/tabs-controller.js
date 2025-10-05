/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class TabsController {

    tabs = ['btn_wrp_tag_list',
        'btn_wrp_lang_list',
        'btn_wrp_art_list',
        'btn_wrp_play_list',
        'btn_wrp_logo']

    infTabs = ['btn_wrp_inf', 'btn_log_pane']

    // ask to not change current tab automatically (eg. case restore ui state)
    preserveCurrentTab = false

    initTabs() {
        ui.tabs.initTabs(this.tabs, {
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

    onTabChanged($tab) {
        const c = $tab[0]
        const $cnv = $(app.canvas)
        if (c.id == 'btn_wrp_logo') {
            $cnv.removeClass('hidden')
            ui.vizTabActivated = true
        }
        else {
            $cnv.addClass('hidden')
            ui.vizTabActivated = false
        }
        uiState.updateCurrentTab(c.id)
        //this.focusTabSelectedItem($tab)

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
        ui.tabs.selectTab(tabId, this.tabs)
        return this
    }

}