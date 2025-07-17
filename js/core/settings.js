// app settings

window.settings = {

    app: {
        version: '0.6'
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

    generator: {
        defaultFrq: 0           // initial generator (oscillator) frq
    },

    oscilloscope: {
        vPerDiv: 0.02,          // volts per division
        tPerDiv: 1,             // time per division in milliseconds
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
