var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Tesselator = require("./Tesselator");
var LevelTesselator = (function (_super) {
    __extends(LevelTesselator, _super);
    function LevelTesselator() {
        _super.call(this);
        this.levelNode = Atomic.player.currentScene.getChild("LevelNode");
        if (!this.levelNode) {
            console.log("Creating a new level node");
            this.levelNode = Atomic.player.currentScene.createChild("LevelNode");
        }
        this.levelNode.position = [0, 0, 0];
        this.levelGeometry = this.levelNode.getOrCreateComponent("CustomGeometry");
        this.levelGeometry.setCastShadows(true);
    }
    LevelTesselator.prototype.tesselate = function () {
        var tmxFile = Atomic.cache.getResource("TmxFile2D", "Level/TestLevel.tmx");
        this.levelGeometry.setNumGeometries(3);
        for (var i = 0; i < tmxFile.getNumLayers(); i++) {
            var layer = tmxFile.getLayer(i);
            if (layer.getName() == "walls") {
                this.levelGeometry.beginGeometry(0, Atomic.TRIANGLE_LIST);
                this.tesselateWalls(layer);
                this.levelGeometry.commit();
            }
            if (layer.getName() == "floor") {
                this.levelGeometry.beginGeometry(1, Atomic.TRIANGLE_LIST);
                this.tesselateFloorOrCeil(layer);
                this.levelGeometry.commit();
            }
            if (layer.getName() == "ceil") {
                this.levelGeometry.beginGeometry(2, Atomic.TRIANGLE_LIST);
                this.tesselateFloorOrCeil(layer, false);
                this.levelGeometry.commit();
            }
        }
        this.levelGeometry.setMaterial(Atomic.cache.getResource("Material", "Materials/LevelMaterial.material"));
        var vertices = 0;
        for (var i = 0; i < this.levelGeometry.getNumGeometries(); i++) {
            vertices += this.levelGeometry.getNumVertices(i);
        }
        console.log("TOTAL VERTICES: " + vertices);
    };
    LevelTesselator.prototype.tesselateFloorOrCeil = function (floorLayer, floor) {
        if (floor === void 0) { floor = true; }
        for (var x = 0; x < floorLayer.width; x++) {
            for (var y = 0; y < floorLayer.height; y++) {
                var tile = floorLayer.getTile(x, y);
                if (!tile)
                    continue;
                if (floor) {
                    Tesselator.addQuad(this.levelGeometry, [x, -0.5, y], [Tesselator.toRad(90), 0, 0], tile.getGid() - 1);
                }
                else {
                    Tesselator.addQuad(this.levelGeometry, [x, 0.5, y], [Tesselator.toRad(-90), 0, 0], tile.getGid() - 1);
                }
            }
        }
    };
    LevelTesselator.prototype.tesselateWalls = function (wallsLayer) {
        for (var x = 0; x < wallsLayer.width; x++) {
            for (var y = 0; y < wallsLayer.height; y++) {
                var tile = wallsLayer.getTile(x, y);
                if (!tile)
                    continue;
                var tileN = wallsLayer.getTile(x, y - 1);
                var tileS = wallsLayer.getTile(x, y + 1);
                var tileW = wallsLayer.getTile(x - 1, y);
                var tileE = wallsLayer.getTile(x + 1, y);
                if (!tileN) {
                    Tesselator.addQuad(this.levelGeometry, [x, 0, (y - 0.5)], [0, 0, 0], tile.getGid() - 1);
                }
                if (!tileS) {
                    Tesselator.addQuad(this.levelGeometry, [x, 0, (y + 0.5)], [0, Tesselator.toRad(180), 0], tile.getGid() - 1);
                }
                if (!tileW) {
                    Tesselator.addQuad(this.levelGeometry, [(x - 0.5), 0, y], [0, Tesselator.toRad(90), 0], tile.getGid() - 1);
                }
                if (!tileE) {
                    Tesselator.addQuad(this.levelGeometry, [(x + 0.5), 0, y], [0, Tesselator.toRad(-90), 0], tile.getGid() - 1);
                }
            }
        }
    };
    return LevelTesselator;
})(Tesselator);
module.exports = LevelTesselator;
