"use strict";
class FlowField {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.field = [];
        for (let i = 0; i < width; i++) {
            this.field[i] = [];
            for (let j = 0; j < height; j++) {
                this.field[i][j] = Math.random() * Math.PI * 2;
                // this.field[i][j] = (j / width) * Math.PI
                // this.field[i][j] = 4145 * Math.) % Math.PI*2
            }
        }
    }
    smooth(neighbours) {
        let temp = [];
        for (let i = 0; i < this.width; i++) {
            temp[i] = [];
            for (let j = 0; j < this.height; j++) {
                temp[i][j] = this.field[i][j];
            }
        }
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                // here we're taking the circular mean
                let agg = vec.fromRadians(this.field[i][j]);
                let counted = 0;
                for (let x = i - neighbours; x < i + neighbours; x++) {
                    for (let y = j - neighbours; y < j + neighbours; y++) {
                        if (0 <= x && x < this.width && 0 <= y && y < this.height) {
                            agg._add(vec.fromRadians(temp[x][y]));
                            counted++;
                        }
                        this.field[i][j] = agg.scale(1 / counted).toRadians();
                    }
                }
            }
        }
    }
    sample(point) {
        let x = Math.round(point.x);
        let y = Math.round(point.y);
        if (x < 0 || this.width - 1 < x) {
            x = Math.min(this.width - 1, Math.max(0, x));
        }
        if (y < 0 || this.height - 1 < y) {
            y = Math.min(this.height - 1, Math.max(0, y));
        }
        return this.field[x][y];
    }
    sampleInterpolated(point) {
        let x = point.x;
        let y = point.y;
        if (x < 0 || this.width - 1 < x) {
            x = Math.min(this.width - 1, Math.max(0, x));
        }
        if (y < 0 || this.height - 1 < y) {
            y = Math.min(this.height - 1, Math.max(0, y));
        }
        let floorX = Math.floor(x);
        let floorY = Math.floor(y);
        // get 4 neighbouring values
        let topLeft = this.field[floorX][floorY];
        let topRight = 0;
        if (floorX != this.width - 1) {
            topRight = this.field[floorX + 1][floorY];
        }
        else
            topRight = topLeft;
        let botLeft = 0;
        if (floorY != this.height - 1) {
            topRight = this.field[floorX][floorY + 1];
        }
        else
            botLeft = topLeft;
        let botRight = 0;
        if (floorY != this.height - 1 && floorX != this.width - 1) {
            botRight = this.field[floorX + 1][floorY + 1];
        }
        else
            botRight = (botLeft + topRight) / 2;
        // interpolate between them
        function frac(n) {
            return n - Math.floor(n);
        }
        let topRow = vec.fromRadians(topLeft).lerp(vec.fromRadians(topRight), frac(x));
        let botRow = vec.fromRadians(botLeft).lerp(vec.fromRadians(botRight), frac(x));
        ctx.beginPath();
        ctx.rect(floorX * drawScale, floorY * drawScale, drawScale, drawScale);
        ctx.closePath();
        ctx.stroke();
        return topRow.lerp(botRow, frac(y)).toRadians();
    }
}