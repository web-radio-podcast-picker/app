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
        $('#btn_power').on('click', () => {
            app.togglePower();
        });
        $('#btn_opause').on('click', () => {
            app.toggleOPause();
        });
        $('#btn_oset').on('click', () => {
            ui.togglePopup(null, 'pop_settings');
            ui.inputWidgets.closeInputWidget();
        });
        $('#vdiv').on('click', () => {
            ui.inputWidgets.openInputWidget('opt_os_dv',
                { targetControlId: 'vdiv' })
        });
        $('#tdiv').on('click', () => {
            ui.inputWidgets.openInputWidget('opt_os_dt',
                { targetControlId: 'tdiv' })
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

    // @TODO: NOT USED
    turnOffMenu() {
        const t = ['#btn_add_ch', '#btn_restart', '#btn_opause'];
        t.forEach(b => {
            $(b)
                .toggleClass('menu-item-disabled');
        });
    }
}