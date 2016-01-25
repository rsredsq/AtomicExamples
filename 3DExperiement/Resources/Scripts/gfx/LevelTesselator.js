var gl_matrix_1 = require("gl-matrix");
var TileWidth = 32;
var TileHeight = 32;
var ImageWidth = 64;
var ImageHeight = 256;
var TileSize = 1;
var LevelTesselator = (function () {
    function LevelTesselator() {
        this.matrix = gl_matrix_1.mat4.create();
        this.levelNode = Atomic.player.currentScene.getChild("LevelNode");
        if (!this.levelNode)
            this.levelNode = Atomic.player.currentScene.createChild("LevelNode");
        this.levelGeometry = this.levelNode.getOrCreateComponent("CustomGeometry");
        this.levelGeometry.setMaterial(Atomic.cache.getResource("Material", "Materials/LevelMaterial.material"));
    }
    LevelTesselator.prototype.tesselate = function () {
        var tmxFile = Atomic.cache.getResource("TmxFile2D", "Level/TestLevel.tmx");
        var wallsLayer = tmxFile.getLayer(0);
        this.levelGeometry.beginGeometry(0, Atomic.TRIANGLE_LIST);
        for (var i = 0; i < tmxFile.getNumLayers(); i++) {
            var layer = tmxFile.getLayer(i);
            if (layer.getName() == "walls")
                this.tesselateWalls(layer);
            if (layer.getName() == "floor")
                this.tesselateFloorOrCeil(layer);
            if (layer.getName() == "ceil")
                this.tesselateFloorOrCeil(layer, false);
        }
        this.levelGeometry.commit();
        console.log("TOTAL VERTICES: " + this.levelGeometry.getNumVertices(0));
    };
    LevelTesselator.prototype.tesselateFloorOrCeil = function (floorLayer, floor) {
        if (floor === void 0) { floor = true; }
        for (var x = 0; x < floorLayer.width; x++) {
            for (var y = 0; y < floorLayer.height; y++) {
                var tile = floorLayer.getTile(x, y);
                if (!tile)
                    continue;
                if (floor) {
                    this.addQuad([x * TileSize, 0.5, y * TileSize], [toRad(-90), 0, 0], tile.getGid() - 1);
                }
                else {
                    this.addQuad([x * TileSize, -0.5, y * TileSize], [toRad(90), 0, 0], tile.getGid() - 1);
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
                    this.addQuad([x * TileSize, 0, (y - 0.5) * TileSize], [0, 0, 0], tile.getGid() - 1);
                }
                if (!tileS) {
                    this.addQuad([x * TileSize, 0, (y + 0.5) * TileSize], [0, toRad(180), 0], tile.getGid() - 1);
                }
                if (!tileW) {
                    this.addQuad([(x - 0.5) * TileSize, 0, y * TileSize], [0, toRad(90), 0], tile.getGid() - 1);
                }
                if (!tileE) {
                    this.addQuad([(x + 0.5) * TileSize, 0, y * TileSize], [0, toRad(-90), 0], tile.getGid() - 1);
                }
            }
        }
    };
    LevelTesselator.prototype.addQuad = function (position, rotation, tileId) {
        var m = gl_matrix_1.mat4.identity(this.matrix);
        var sx2 = 1 / 2;
        var sy2 = 1 / 2;
        gl_matrix_1.mat4.translate(m, m, position);
        if (rotation[0])
            gl_matrix_1.mat4.rotateX(m, m, rotation[0]);
        if (rotation[1])
            gl_matrix_1.mat4.rotateY(m, m, rotation[1]);
        if (rotation[2])
            gl_matrix_1.mat4.rotateZ(m, m, rotation[2]);
        var verts = [
            [-sx2, sy2, 0],
            [sx2, sy2, 0],
            [sx2, -sy2, 0],
            [sx2, -sy2, 0],
            [-sx2, -sy2, 0],
            [-sx2, sy2, 0]
        ];
        gl_matrix_1.vec3.transformMat4(verts[0], verts[0], m);
        gl_matrix_1.vec3.transformMat4(verts[1], verts[1], m);
        gl_matrix_1.vec3.transformMat4(verts[2], verts[2], m);
        gl_matrix_1.vec3.transformMat4(verts[3], verts[3], m);
        gl_matrix_1.vec3.transformMat4(verts[4], verts[4], m);
        gl_matrix_1.vec3.transformMat4(verts[5], verts[5], m);
        var tx = (Math.floor(tileId * TileWidth) % ImageWidth) / ImageWidth;
        var ty = (Math.floor(tileId * TileWidth / ImageWidth) * TileHeight) / ImageHeight;
        var wx = TileWidth / ImageWidth;
        var wy = TileHeight / ImageHeight;
        this.levelGeometry.defineVertex(verts[0]);
        this.levelGeometry.defineTexCoord([tx, ty + wy]);
        this.levelGeometry.defineVertex(verts[1]);
        this.levelGeometry.defineTexCoord([tx + wx, ty + wy]);
        this.levelGeometry.defineVertex(verts[2]);
        this.levelGeometry.defineTexCoord([tx + wx, ty]);
        this.levelGeometry.defineVertex(verts[3]);
        this.levelGeometry.defineTexCoord([tx + wx, ty]);
        this.levelGeometry.defineVertex(verts[4]);
        this.levelGeometry.defineTexCoord([tx, ty]);
        this.levelGeometry.defineVertex(verts[5]);
        this.levelGeometry.defineTexCoord([tx, ty + wy]);
    };
    return LevelTesselator;
})();
function toRad(angle) {
    return angle * (Math.PI / 180);
}
module.exports = LevelTesselator;
//# sourceMappingURL=LevelTesselator.js.map