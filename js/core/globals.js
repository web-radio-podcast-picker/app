/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// app globals

const Flag_Raspberry = 'raspberry'
const Flag_Kiosk = 'kiosk'
const Flag_NoSwype = 'noswype'
const Flag_SmallDisp = 'smldisp'

const AudioContext = window.AudioContext || window.webkitAudioContext
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// radios lists
const RadioList_History = 'History'

// sources ids
const Source_Id_AudioInput = 'Audio Input'
const Source_Id_Media = 'Media'
const Source_Id_None = 'None'

// devices ids
const Device_Id_Default = 'default'
const Device_Id_Communications = 'communications'

// devices kinds ids
const Device_Kind_Id_Audio_Input = 'audioinput'
const Device_Kind_Id_Video_Input = 'videoinput'
const Device_Kind_Id_Audio_Output = 'audiooutput'

// generator functions
const Gen_Fn_Sin = 'Sine'
const Gen_Fn_Square = 'Square'
const Gen_Fn_Sawtooth = 'Sawtooth'
const Gen_Fn_Triangle = 'Triangle'

// triggers types
const Trigger_Type_Up = 'Up'
const Trigger_Type_Down = 'Down'

// kbd tags
const Kbd_Op = 'op'
const Kbd_Num = 'num'
const Kbd_Dot = 'dot'
const Kbd_Ch = 'ch'

// popups align
const Align_Center_Middle_Top = 'center-middle-top'
const Align_Center_Top = 'center-top'

// math ops
const Math_Ops = {
    '✕': 'x',
    '+': '+',
    '-': '-',
    '/': '/',
    '.': '.'
}

// units
const Units_Kilos = [null, null, null, '', 'K', 'M', 'G']
const Units_Bytes = [null, null, null, 'b', 'Kb', 'Mb', 'Gb']
const Units_Frequencies = [null, null, null, 'Hz', 'kHz', 'mHz', 'gHz']
const Units_Volts = ['nV', 'µV', 'mV', 'V', 'kV', 'mgV', 'gV']
const Units_Volts_Steps = [
    1 / 1000000000,
    1 / 1000000,
    [1 / 10, 100.0],
    1,
    1000,
    1000000,
    1000000000
]

// view layouts
const Half_Bottom = 'half bottom'
const Half_Top = 'half top'
const Full = 'full'

// screen
const Screen_Orientation_Portrait = 'portrait'
const Screen_Orientation_Landscape = 'landscape'
