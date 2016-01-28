var LevelTesselator = require("Scripts/gfx/LevelTesselator");
var PostProcess = require("Scripts/gfx/PostProcess");
var Main = (function () {
    function Main() {
    }
    Main.main = function () {
        Atomic.player.loadScene("Scenes/MainScene.scene");
        var t = new LevelTesselator();
        t.tesselate();
        var p = new PostProcess();
        p.start();
    };
    return Main;
})();
Main.main();
module.exports = Main;
