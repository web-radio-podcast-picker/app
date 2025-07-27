// app settings

window.settings = {

    app: {
        version: '0.8'
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

    output: {
        vScale: 1               // volt scale line out (corresponding to 1 = max sound level)
    },

    generator: {
        defaultFrq: 250,        // initial generator (oscillator) frq
        defaultFn: Gen_Fn_Sin,      // default fn
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
            yRel: -11,           // rel y to the base widget y of value point
        },
        lines: {
            avgDash: [10, 10],
            avgOpacity: 0.7,
            limDash: [5, 10],
            limOpacity: 0.7,
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
        channels: {
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
        maxRefreshRate: 25,     // maximum views refresh rate in Fps
        clientWidthBorder: 4,   // default border width for client area
        clientHeightBorder: 2,  // default border height for client area
        menuContainerWidth: 42  // 3 * 1em
    }

};

if (settings.debug.info)
    console.log('Settings initialized:', settings);
