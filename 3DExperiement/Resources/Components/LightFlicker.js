"atomic component";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var baseRange = 3;
var flicker = "mmmaaaammmaaaabcdefgabcdefg";
var LightFlicker = (function (_super) {
    __extends(LightFlicker, _super);
    function LightFlicker() {
        _super.apply(this, arguments);
        this.targetValue = baseRange;
        this.index = Math.random() * (flicker.length - 1);
        this.time = 100;
    }
    LightFlicker.prototype.start = function () {
        this.light = this.node.getComponent("Light");
    };
    LightFlicker.prototype.update = function (timestep) {
        this.time += timestep;
        if (this.time > .05) {
            this.index++;
            this.time = 0.0;
            if (this.index >= flicker.length)
                this.index = 0;
            this.targetValue = baseRange * (flicker.charCodeAt(this.index) / 255);
        }
        if (this.light.range < this.targetValue)
            this.light.range += timestep * 10;
        if (this.light.range > this.targetValue)
            this.light.range -= timestep * 10;
    };
    return LightFlicker;
}(Atomic.JSComponent));
module.exports = LightFlicker;
