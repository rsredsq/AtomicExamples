import LevelTesselator = require("Scripts/gfx/LevelTesselator");
import PostProcess = require("Scripts/gfx/PostProcess");

class Main {
    static main() {
        Atomic.renderer.setTextureFilterMode(Atomic.FILTER_NEAREST);
        var scene = Atomic.player.loadScene("Scenes/MainScene.scene");
        var t = new LevelTesselator();
        t.tesselate();
        
        var tweenNode = scene.createChild("Tween System");
        tweenNode.createJSComponent("Components/TweenComponent.js");
    }
}

Main.main();

export = Main;