// app settings
window.settings = {

    debug: {
        trace: true,
        info: true
    },

    audioInput: {
        vScale: 5,  // volt scale (256 digital value corresponding volts) for audio input
    },

    oscilloscope: {
        vPerDiv: 1,             // volts per division
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
            color: '#444444',
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
        clientWidthBorder: 0,   // default border width for client area
        clientHeightBorder: 4   // default border height for client area
    }

};

if (settings.debug.info)
    console.log('Settings initialized:', settings);
