/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// app settings

window.settings = {

    app: {
        kernel: {
            version: '0.9',
            verDate: '8/23/2025'
        },
        wrp: {
            version: '1.2.22.1',
            verDate: '10/8/2025'
        }
    },

    flags: {
        raspberry: null,
        kiosk: null,
        noSwype: null,
        smallDisp: null,
        app: null,
        noviz: null,
        ipho: null
    },

    features: {
        swype: {
            enableArrowsButtonsOverScrollPanes: null,
            speed: 1,
            acceleration: 1.14,
            repeatDelay: 50
        },
        constraints: {
            noFullscreenToggling: null,
            noIntroPopup: null,
            enableRotateYourDevicePopup: null,
            noVisualizers: null,
            isIPhone: null,
            useNavigatorOrientationProperty: null
        },
        smallDisp: {
            increaseSmallText: null
        }
    },

    sys: {
        platform: '?',
        platformText: '?',
        mobile: null
    },

    debug: {
        debug: true,
        trace: false,
        info: true,
        stackTrace: false
    },

    extInput: {
        enabled: false
    },

    audioInput: {
        vScale: 5,              // volt scale (256 digital value corresponding volts) for audio input
        channelsCount: 1,       // number of audio input channels
    },

    input: {
        bufferSize: /*16384*/2048 / 2,  // buffer size (fftSize = bufferSize*2)     
    },

    output: {
        vScale: 1               // volt scale line out (corresponding to 1 = max sound level)
    },

    fft: {
        hScale: 1,              // horizontal linear scale (1: full bandwidth)
        vScale: 1,              // vertical linear scale
        vScaleFactor: 16,       // vScale multiplier
        vBaseOffsetFactor: 3.5, // vertical base y gap offset factor (canvas height fraction)
        bars: 32,
        shape: {
            marginLeft: 2,
            strokeColor: 'black',
            vBarSpace: 2,
            colors: [
                '#00DFFF',
                '#00FF00',
                '#94ED29',
                '#FFFF00',
                '#F8B621',
                '#FA6426',
                '#FF0000',
                '#F226A9',
                '#A820F5'
            ]
        },
        pos: {
            ratioDx: 1.0,
            ratioDy: 1 / 5
        },
        crop: {
            enabled: true,
            maxDb: 0,
            minDb: -100
        },
        grid: {
            opacity: 0.9,       // grid lines opacity
            hDivCount: 16,      // horizontal divs count
            hDivCountSD: 10,    // idem for small display
            dbPerDiv: 25,       // db / div
            dbPerDivSD: 50,     // idem for small display
            color: null,            // initialized from channel color
            commonColor: 'rgba(160,160,170,1)',     // color if several fft with same scale
            lineWidth: 1,
            dash: [2, 2],
            left: 48,
            deltaLeft: 56,
            deltaTop: 7 * 6,
            markers: {
                length: 7 * 3,
                xRel: 6,
                yRel: 14,
                dash: [],
            }
        },
        stroke: {
            lineWidth: 1
        }
    },

    oscilloscope: {
        vPerDiv: 0.5,          // volts per division
        tPerDiv: 1,            // time per division in milliseconds
        defaultFFTViewVisible: true,
        channels: {
            defaultColor: 'rgba(255, 255, 0,1)',
            defaultLineWidth: 1.5,
            shadowColor: 'rgba(0, 0, 0, 0.8)',
        }
    },

    ui: {
        maxRefreshRate: 250,        // maximum views refresh rate in Fps
        clientWidthBorder: 4,       // default border width for client area
        clientHeightBorder: 2,      // default border height for client area
        menuContainerWidth: 42,     // 3 * 1em
        fullscreen: false,
        fftAxeRelY: - 21 - 7 * 6,
        errorBarRelY: - 21 - 7 * 10,
        infoBarRelY: - 21 - 7,
        buttonBarRelY: - 42 - 7 * 7 + 5 * 7,
        compactDisplayMaxHeight: 600,
        introPopupDelay: 4000,      // ms
        fadeOutDelay: 1000,
        popupTransparency: true,
        errDisplayTime: 4000,        // error display time ms
        longInfoDisplayTime: 6000,        // error display time ms
        longErrDisplayTime: 6000        // error display time ms
    },

    net: {
        enforceHttps: true
    },

    // modules settings by modules ids
    modules: {
    }
}

settings.dataStore = new DataStore()

if (settings.debug.info)
    console.log('Settings initialized:', settings)
