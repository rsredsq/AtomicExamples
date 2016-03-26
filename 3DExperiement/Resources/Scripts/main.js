"use strict";
var LevelTesselator = require("Scripts/gfx/LevelTesselator");
var Main = (function () {
    function Main() {
    }
    Main.main = function () {
        Atomic.renderer.setTextureFilterMode(Atomic.FILTER_NEAREST);
        var scene = Atomic.player.loadScene("Scenes/MainScene.scene");
        var t = new LevelTesselator();
        t.tesselate();
        var tweenNode = scene.createChild("Tween System");
        tweenNode.createJSComponent("Components/TweenComponent.js");
    };
    return Main;
}());
Main.main();
module.exports = Main;
