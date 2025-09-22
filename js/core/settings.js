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
            version: '1.2.5',
            verDate: '9/22/2025'
        }
    },

    flags: {
        raspberry: null,
        kiosk: null
    },

    sys: {
        platform: '?',
        platformText: '?',
        mobile: null
    },

    debug: {
        debug: true,
        trace: true,
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

    generator: {
        defaultFrq: 250,        // initial generator (oscillator) frq
        defaultFn: Gen_Fn_Sin,  // default fn
        defaultModulation: {
            frqMin: 500,        // frequency modulation min hz
            frqMax: 1500,       // frequency modulation max hz
            frqRate: 5,         // frequency modulation rate hz
            ampMin: 0.1,        // gain modulation min x
            ampMax: 1,          // gain modulation max x
            ampRate: 0.5,       // gain modulation rate hz
            sensitivity: 0.001  // ramp delta v check
        },
        modTimerSteps: 500
    },

    trigger: {
        defaultType: Trigger_Type_Up,
        sensitivity: 0.1,
        threshold: 0.2,
        timeThreshold: 1
    },

    markers: {
        trigger: {
            yRel: -10,           // rel y to the base widget y of value point
        },
        lines: {
            avgDash: [10, 10],
            avgOpacity: 0.7,
            limDash: [5, 10],
            limOpacity: 0.7,

            trigger: {
                dash: [5, 10],
                opacity: 0.7,
                color: 'rgba(255, 0, 0,1)',
                width: 1
            },
            triggerS: {
                dash: [5, 10],
                opacity: 0.7,
                color: 'rgba(255, 174, 0, 1)',
                width: 1
            },

            width: 1
        }
    },

    renderers: {
        bright: {
            baseLum: 50,
            ampFactor: 1 / 4
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
            // channels colors
            colors: [
                // mandatory rgba notation
                'rgba(0, 255, 255,1)',
                'rgba(255, 255, 0,1)',
                'rgba(144, 238, 144,1)',
                'rgba(255, 0, 255,1)',
                'rgba(173, 216, 230,1)',
                'rgba(255, 192, 203,1)',
                'rgba(255, 165, 0,1)',
                'rgba(255, 0, 0,1)',
                'rgba(255, 255, 255,1)'
            ]
        },
        grid: {
            color: '#333333',
            hDivCount: 10,
            vDivCount: 10,
            lineWidth: 1,
            units:
            {
                font: '14px Arial',
                color: '#555555',
                xRel: 6,
                yRel: -4,
                timeUnityRel: 20
            }
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

    media: {
        demo: {
            radiosUrls: [
                // jazz
                'https://knkx-live-a.edge.audiocdn.com/6285_128k',
                // rock
                'https://corus.leanstream.co/CJKRFM-MP3',
                // reggae
                'http://hestia2.cdnstream.com/1301_128',
                // mixed styles
                'https://mixed-choize.stream.laut.fm/mixed-choize',
                // 70
                'http://stream.dbmedia.se/gk70talMP3',
                // pop
                'http://ice.stream.frequence3.net/frequence3ac-128.mp3',
                // Turk
                'https://live.radyositesihazir.com:10997/stream?type=http&nocache=99881',
                // Chinese
                'http://lhttp.qingting.fm/live/5022521/64k.mp3',
                'http://lhttp.qingting.fm/live/15318194/64k.mp3'
            ],
            stereoAudioMediaURL: 'https://knkx-live-a.edge.audiocdn.com/6285_128k'
        }
    },

    net: {
        enforceHttps: true
    },

    // modules settings by modules ids
    modules: {
    }
}

if (settings.debug.info)
    console.log('Settings initialized:', settings);
