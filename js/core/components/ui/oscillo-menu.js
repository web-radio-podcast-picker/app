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
                ui.togglePopup(null, 'pop_settings');
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
    }

    reflectOscilloPauseState() {
        $('#btn_opause').text(oscilloscope.pause ? '▶' : '⏸');
    }

    toggleMenu() {
        const $mb = $('#top-right-menu-body');
        $mb.toggleClass('hidden');
        const visible = !$mb.hasClass('hidden');
        $('#btn_menu').text(!visible ? '▼' : '▲');
        if (visible)
            ui.initBindedControls();
        else
            ui.inputWidgets.closeInputWidget(); 0
    }
}