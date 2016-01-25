import LevelTesselator = require("Scripts/gfx/LevelTesselator");

class Main {
    static main() {
        Atomic.player.loadScene("Scenes/MainScene.scene");
        var t = new LevelTesselator();
        t.tesselate();
    }
}

Main.main();

export = Main;