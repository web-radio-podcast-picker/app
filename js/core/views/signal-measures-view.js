// signal measures view
signalMeasuresView = {

    visualize: function () {
        // instant value
        const value = signalMeasures.value;
        const ival = document.querySelector('#ival');
        ival.textContent = value;
    }
}