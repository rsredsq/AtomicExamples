"use strict";
var PostProcess = (function () {
    function PostProcess() {
    }
    PostProcess.prototype.construct = function () {
    };
    PostProcess.prototype.start = function () {
        var viewport = Atomic.renderer.getViewport(0);
        var renderPath = viewport.renderPath;
    };
    return PostProcess;
}());
module.exports = PostProcess;
