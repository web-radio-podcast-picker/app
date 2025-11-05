/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

const DebouncerLogPfx = '[!!] '

class Debouncer {

    minSpanMs = 500

    debounce(func) {

        if (settings.debug.debug)
            Logger.log(DebouncerLogPfx + 'debounce: ' + func)

    }
}