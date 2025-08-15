/*
    Sound card Oscilloscope | Spectrum Analyzer | Signal Generator
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// module loader

class ModuleLoader {

    modules = []

    isLoaded(url) {
        return this.modules[url] !== undefined
    }

    // eg. ./modules/web-radio-picker
    load(url) {
        url = url + '.js'
        // load the script
        $.getScript(url)
            .done(function (script, textStatus) {
                console.log("Script loaded successfully: " + textStatus);
                const t = url.split('/')
                var n = t[t.length - 1]
                n = toCamelCase(n)
                const cl = n + 'Module'
                const o = eval('new ' + cl + '()')
            })
            .fail(function (jqxhr, settings, exception) {
                //console.error("Error loading script: " + exception);
                ui.showError(exception)
            });
        //this.modules[url] = o
    }

}
