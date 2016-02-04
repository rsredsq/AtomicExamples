var LevelTesselator = require("Scripts/gfx/LevelTesselator");
var Main = (function () {
    function Main() {
    }
    Main.main = function () {
        Atomic.renderer.setTextureFilterMode(Atomic.FILTER_NEAREST);
        Atomic.player.loadScene("Scenes/MainScene.scene");
        var t = new LevelTesselator();
        t.tesselate();
    };
    return Main;
})();
Main.main();
module.exports = Main;
