// grid view

class GridView {

    canvas = null;      // canvas for visualization
    drawn = null;       // true if grid already drawn

    init(canvas) {
        this.canvas = canvas;
        ui.setupCanvasSize(this.canvas);
    }

    enableViewUpdate() {
        this.drawn = false; // reset drawn flag
    }

    run() {

        const updated = ui.setupCanvasSize(this.canvas);

        if (updated || !this.drawn) {

            const canvasHeight = this.canvas.height;
            const canvasWidth = this.canvas.width;
            const dc = this.canvas.getContext('2d');
            dc.clearRect(0, 0, canvasWidth, canvasHeight);

            const vDivCount = settings.oscilloscope.grid.vDivCount;
            const divw = canvasWidth / settings.oscilloscope.grid.hDivCount;
            const divh = canvasHeight / vDivCount;
            const timePerDiv = oscilloscope.getTimePerDiv(divw);

            var dx = 0;
            for (var x = 0; x < canvasWidth; x += divw) {

                this.drawGridLine(dc, x, 0, x, canvasHeight - 1);

                var y = 0;
                for (var dy = 0; dy <= vDivCount; dy++) {
                    this.drawGridLine(dc, 0, y, canvasWidth - 1, y);
                    var v = (vDivCount / 2 - (y / divh)) * settings.oscilloscope.vPerDiv
                        .toFixed(5);
                    this.drawUnit(dc, 0, y, vround(v) + 'v');

                    if (dy == vDivCount - 1) {
                        this.drawUnit(dc,
                            x, y
                        + settings.oscilloscope.grid.units.timeUnityRel,
                            tround(dx * timePerDiv * 1000) + 'ms');
                    }

                    y += divh;
                }
                dx++;
            }

            this.drawn = true;
        }
    }

    drawUnit(dc, x, y, t) {
        dc.font = settings.oscilloscope.grid.units.font;
        dc.fillStyle = settings.oscilloscope.grid.units.color;
        const xrel = settings.oscilloscope.grid.units.xRel;
        const yrel = settings.oscilloscope.grid.units.yRel;
        dc.fillText(t, x + xrel, y + yrel);
    }

    drawGridLine(dc, x1, y1, x2, y2) {
        dc.beginPath();
        dc.moveTo(x1, y1);
        dc.lineTo(x2, y2);
        dc.strokeStyle = settings.oscilloscope.grid.color;
        dc.lineWidth = settings.oscilloscope.grid.lineWidth;
        dc.stroke();
    }

}
