// app settings

window.settings = {

    app: {
        version: '0.7'
    },

    debug: {
        debug: true,
        trace: true,
        info: true
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
        defaultFn: 'Sine',      // default fn
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
        sensitivity: 0.2,
        threshold: 0.1,
        timeThreshold: 4
    },

    oscilloscope: {
        vPerDiv: 0.5,          // volts per division
        tPerDiv: 1,            // time per division in milliseconds
        channels: {
            // channels colors
            colors: [
                'cyan',
                'yellow',
                'lightgreen',
                'magenta',
                'lightblue',
                'pink',
                'orange',
                'red',
                'white'
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
