/*
    Sound card Oscilloscope | Signal Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// oscillo menu
class OscilloMenu {

    initMenu() {
        // menu buttons
        $('#btn_menu').on('click', () => {
            this.toggleMenu();
        });
        $('#btn_add_ch').on('click', async () => {
            if (app.powerOn)
                await app.addChannel();
        });
        $('#btn_restart').on('click', () => {
            if (app.powerOn)
                window.location.reload(false);
        });
        $('#btn_opause').on('click', () => {
            if (app.powerOn)
                app.toggleOPause();
        });
        $('#btn_oset').on('click', () => {
            if (app.powerOn) {
                ui.popups.togglePopup(null, 'pop_settings');
                ui.inputWidgets.closeInputWidget();
            }
        });
        $('#vdiv').on('click', () => {
            if (app.powerOn) {
                ui.inputWidgets.openInputWidget('opt_os_dv',
                    { targetControlId: 'vdiv' })
            }
        });
        $('#tdiv').on('click', () => {
            if (app.powerOn) {
                ui.inputWidgets.openInputWidget('opt_os_dt',
                    { targetControlId: 'tdiv' })
            }
        });
        $('#btn_fs').on('click', () => {
            settings.ui.fullscreen = !settings.ui.fullscreen
            this.setFullscreen(settings.ui.fullscreen)
        })

        this.setFullscreen(false)
    }

    setFullscreen(fs) {
        settings.ui.fullscreen = fs
        if (fs) {
            document.querySelector('body').requestFullscreen(
                { navigationUI: 'hide' }
            )
        }
        else {
            if (document.fullscreenElement)
                document.exitFullscreen()
        }
        $('#btn_fs').text(
            fs ? '☐' : '⛶'
        )
    }

    reflectOscilloPauseState() {
        $('#btn_opause').text(oscilloscope.pause ? '▶' : '||');
    }

    toggleMenu() {
        const $mb = $('#main_menu-body');
        $mb.toggleClass('hidden');

        const visible = !$mb.hasClass('hidden');
        $('#btn_menu').text(!visible ? '▼' : '▲');
        if (visible) {
            $('#buttons_bar').removeClass('hidden')
            $('#buttons_bar2').removeClass('hidden')
            ui.bindings.initBindedControls()
        }
        else {
            $('#buttons_bar').addClass('hidden')
            $('#buttons_bar2').addClass('hidden')
            ui.inputWidgets.closeInputWidget()
        }
    }
}