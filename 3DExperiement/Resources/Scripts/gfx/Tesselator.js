"use strict";
var gl_matrix_1 = require("gl-matrix");
var tempMatrix;
var TileWidth = 16;
var TileHeight = 16;
var ImageWidth = 256;
var ImageHeight = 256;
var TileSize = 1;
var DefaultColor = [1.0, 1.0, 1.0, 1.0];
var Tesselator = (function () {
    function Tesselator() {
    }
    Tesselator.addQuad = function (geometry, position, rotation, tileId, tileWidth, tileHeight, imageWidth, imageHeight) {
        if (tileId === void 0) { tileId = 0; }
        if (tileWidth === void 0) { tileWidth = TileWidth; }
        if (tileHeight === void 0) { tileHeight = TileHeight; }
        if (imageWidth === void 0) { imageWidth = ImageWidth; }
        if (imageHeight === void 0) { imageHeight = ImageHeight; }
        Tesselator.addQuadWithColor(geometry, position, rotation, DefaultColor, tileId, tileWidth, tileHeight, imageWidth, imageHeight);
    };
    Tesselator.addQuadWithColor = function (geometry, position, rotation, color, tileId, tileWidth, tileHeight, imageWidth, imageHeight) {
        if (tileId === void 0) { tileId = 0; }
        if (tileWidth === void 0) { tileWidth = TileWidth; }
        if (tileHeight === void 0) { tileHeight = TileHeight; }
        if (imageWidth === void 0) { imageWidth = ImageWidth; }
        if (imageHeight === void 0) { imageHeight = ImageHeight; }
        var m = gl_matrix_1.mat4.identity(tempMatrix);
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
        var tx = (Math.floor(tileId * tileWidth) % imageWidth) / imageWidth;
        var ty = (Math.floor(tileId * tileWidth / imageWidth) * tileHeight) / imageHeight;
        var wx = tileWidth / imageWidth;
        var wy = tileHeight / imageHeight;
        var v1 = [0.0, 0.0, 0.0];
        var v2 = [0.0, 0.0, 0.0];
        var normal = [0.0, 0.0, 0.0];
        gl_matrix_1.vec3.cross(normal, gl_matrix_1.vec3.sub(v1, verts[1], verts[0]), gl_matrix_1.vec3.sub(v2, verts[2], verts[0]));
        geometry.defineVertex(verts[0]);
        geometry.defineColor(color);
        geometry.defineTexCoord([tx, ty]);
        geometry.defineNormal(normal);
        gl_matrix_1.vec3.cross(normal, gl_matrix_1.vec3.sub(v1, verts[2], verts[1]), gl_matrix_1.vec3.sub(v2, verts[3], verts[1]));
        geometry.defineVertex(verts[1]);
        geometry.defineColor(color);
        geometry.defineTexCoord([tx + wx, ty]);
        geometry.defineNormal(normal);
        gl_matrix_1.vec3.cross(normal, gl_matrix_1.vec3.sub(v1, verts[3], verts[2]), gl_matrix_1.vec3.sub(v2, verts[4], verts[2]));
        geometry.defineVertex(verts[2]);
        geometry.defineColor(color);
        geometry.defineTexCoord([tx + wx, ty + wy]);
        geometry.defineNormal(normal);
        gl_matrix_1.vec3.cross(normal, gl_matrix_1.vec3.sub(v1, verts[4], verts[3]), gl_matrix_1.vec3.sub(v2, verts[5], verts[3]));
        geometry.defineVertex(verts[3]);
        geometry.defineColor(color);
        geometry.defineTexCoord([tx + wx, ty + wy]);
        geometry.defineNormal(normal);
        gl_matrix_1.vec3.cross(normal, gl_matrix_1.vec3.sub(v1, verts[5], verts[4]), gl_matrix_1.vec3.sub(v2, verts[0], verts[4]));
        geometry.defineVertex(verts[4]);
        geometry.defineColor(color);
        geometry.defineTexCoord([tx, ty + wy]);
        geometry.defineNormal(normal);
        gl_matrix_1.vec3.cross(normal, gl_matrix_1.vec3.sub(v1, verts[0], verts[5]), gl_matrix_1.vec3.sub(v2, verts[1], verts[5]));
        geometry.defineVertex(verts[5]);
        geometry.defineColor(color);
        geometry.defineTexCoord([tx, ty]);
        geometry.defineNormal(normal);
    };
    Tesselator.toRad = function (angle) {
        return angle * (Math.PI / 180);
    };
    Tesselator.Ctor = (function () {
        tempMatrix = gl_matrix_1.mat4.create();
    })();
    return Tesselator;
}());
module.exports = Tesselator;
