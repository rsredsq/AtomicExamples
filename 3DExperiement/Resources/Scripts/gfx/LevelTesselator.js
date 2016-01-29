var gl_matrix_1 = require("gl-matrix");
var TileWidth = 16;
var TileHeight = 16;
var ImageWidth = 256;
var ImageHeight = 256;
var TileSize = 1;
var LevelTesselator = (function () {
    function LevelTesselator() {
        this.matrix = gl_matrix_1.mat4.create();
        this.levelNode = Atomic.player.currentScene.getChild("LevelNode");
        if (!this.levelNode) {
            console.log("Creating a new level node");
            this.levelNode = Atomic.player.currentScene.createChild("LevelNode");
        }
        this.levelNode.position = [0, 0, 0];
        this.levelGeometry = this.levelNode.getOrCreateComponent("CustomGeometry");
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
                    this.addQuad([x * TileSize, -0.5, y * TileSize], [toRad(90), 0, 0], tile.getGid() - 1);
                }
                else {
                    this.addQuad([x * TileSize, 0.5, y * TileSize], [toRad(-90), 0, 0], tile.getGid() - 1);
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
        var v1 = [0.0, 0.0, 0.0];
        var v2 = [0.0, 0.0, 0.0];
        var normal = [0.0, 0.0, 0.0];
        gl_matrix_1.vec3.cross(normal, gl_matrix_1.vec3.sub(v1, verts[1], verts[0]), gl_matrix_1.vec3.sub(v2, verts[2], verts[0]));
        this.levelGeometry.defineVertex(verts[0]);
        this.levelGeometry.defineTexCoord([tx, ty]);
        this.levelGeometry.defineNormal(normal);
        gl_matrix_1.vec3.cross(normal, gl_matrix_1.vec3.sub(v1, verts[2], verts[1]), gl_matrix_1.vec3.sub(v2, verts[3], verts[1]));
        this.levelGeometry.defineVertex(verts[1]);
        this.levelGeometry.defineTexCoord([tx + wx, ty]);
        this.levelGeometry.defineNormal(normal);
        gl_matrix_1.vec3.cross(normal, gl_matrix_1.vec3.sub(v1, verts[3], verts[2]), gl_matrix_1.vec3.sub(v2, verts[4], verts[2]));
        this.levelGeometry.defineVertex(verts[2]);
        this.levelGeometry.defineTexCoord([tx + wx, ty + wy]);
        this.levelGeometry.defineNormal(normal);
        gl_matrix_1.vec3.cross(normal, gl_matrix_1.vec3.sub(v1, verts[4], verts[3]), gl_matrix_1.vec3.sub(v2, verts[5], verts[3]));
        this.levelGeometry.defineVertex(verts[3]);
        this.levelGeometry.defineTexCoord([tx + wx, ty + wy]);
        this.levelGeometry.defineNormal(normal);
        gl_matrix_1.vec3.cross(normal, gl_matrix_1.vec3.sub(v1, verts[5], verts[4]), gl_matrix_1.vec3.sub(v2, verts[0], verts[4]));
        this.levelGeometry.defineVertex(verts[4]);
        this.levelGeometry.defineTexCoord([tx, ty + wy]);
        this.levelGeometry.defineNormal(normal);
        gl_matrix_1.vec3.cross(normal, gl_matrix_1.vec3.sub(v1, verts[0], verts[5]), gl_matrix_1.vec3.sub(v2, verts[1], verts[5]));
        this.levelGeometry.defineVertex(verts[5]);
        this.levelGeometry.defineTexCoord([tx, ty]);
        this.levelGeometry.defineNormal(normal);
    };
    return LevelTesselator;
})();
function toRad(angle) {
    return angle * (Math.PI / 180);
}
module.exports = LevelTesselator;
