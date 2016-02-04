
class PostProcess {
    construct() {
        
    }
    
    start() {
        var viewport = Atomic.renderer.getViewport(0);
        var renderPath = viewport.renderPath;
        renderPath.append(<Atomic.XMLFile> Atomic.cache.getResource("XMLFile", "Shaders/Dithering.xml"));
    }
}

export = PostProcess;