"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TWEEN_1 = require("TWEEN");
var TweenComponent = (function (_super) {
    __extends(TweenComponent, _super);
    function TweenComponent() {
        _super.call(this);
    }
    TweenComponent.prototype.update = function (delta) {
        TWEEN_1.update();
    };
    return TweenComponent;
}(Atomic.JSComponent));
module.exports = TweenComponent;
