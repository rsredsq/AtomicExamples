var PostProcess = (function () {
    function PostProcess() {
    }
    PostProcess.prototype.construct = function () {
    };
    PostProcess.prototype.start = function () {
        var viewport = Atomic.renderer.getViewport(0);
        var renderPath = viewport.renderPath;
        renderPath.append(Atomic.cache.getResource("XMLFile", "Shaders/Dithering.xml"));
    };
    return PostProcess;
})();
module.exports = PostProcess;
