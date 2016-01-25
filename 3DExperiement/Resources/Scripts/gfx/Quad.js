var gl_matrix_1 = require("gl-matrix");
var Quad = (function () {
    function Quad(width, height) {
        if (width === void 0) { width = 1; }
        if (height === void 0) { height = 1; }
        this.width = width;
        this.height = height;
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.position = gl_matrix_1.vec3.create();
        this.rotation = gl_matrix_1.vec3.create();
        this.verts = [];
    }
    Quad.prototype.tesselate = function (geometry) {
        var sx2 = 1 / 2;
        var sy2 = 1 / 2;
        geometry.beginGeometry(0, Atomic.TRIANGLE_LIST);
        geometry.defineVertex([-sx2, sy2, 0]);
        geometry.defineVertex([sx2, sy2, 0]);
        geometry.defineVertex([sx2, -sy2, 0]);
        geometry.defineVertex([sx2, -sy2, 0]);
        geometry.defineVertex([-sx2, -sy2, 0]);
        geometry.defineVertex([-sx2, sy2, 0]);
        geometry.commit();
    };
    return Quad;
})();
module.exports = Quad;
//# sourceMappingURL=Quad.js.map