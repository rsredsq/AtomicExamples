import LevelTesselator = require("Scripts/gfx/LevelTesselator");
import PostProcess = require("Scripts/gfx/PostProcess");

class Main {
    static main() {
        Atomic.renderer.setTextureFilterMode(Atomic.FILTER_NEAREST);
        Atomic.player.loadScene("Scenes/MainScene.scene");
        var t = new LevelTesselator();
        t.tesselate();
        // var p = new PostProcess();
        // p.start();
    }
}

Main.main();

export = Main;