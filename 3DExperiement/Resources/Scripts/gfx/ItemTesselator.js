"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Tesselator = require("./Tesselator");
var TileWidth = 32;
var TileHeight = 32;
var ImageWidth = 256;
var ImageHeight = 256;
var ImagePixWidth = 1;
var ImagePixHeight = 1;
var OffsetX = TileWidth / 2;
var OffsetZ = TileHeight / 2;
var ItemTesselator = (function (_super) {
    __extends(ItemTesselator, _super);
    function ItemTesselator() {
        _super.apply(this, arguments);
    }
    ItemTesselator.tesselateItem = function (geometry, itemId) {
        var items = ItemTesselator.itemsImage;
        var x0 = (Math.floor(itemId * TileWidth) % items.getWidth());
        var y0 = (Math.floor(itemId * TileWidth / items.getWidth()) * items.getHeight());
        var x1 = x0 + TileWidth;
        var y1 = y0 + TileHeight;
        var tid = 0;
        for (var y = y0; y < y1; y++) {
            for (var x = x0; x < x1; x++) {
                var pix = items.getPixel(x, y);
                if (pix[3] <= 0.0) {
                    tid++;
                    if (tid % TileWidth == 0) {
                        tid = tid + ImageWidth - TileWidth;
                    }
                    continue;
                }
                if (tid != 0 && tid % TileWidth == 0) {
                    tid = tid + ImageWidth - TileWidth;
                }
                var pixN = items.getPixel(x, y - 1);
                var pixS = items.getPixel(x, y + 1);
                var pixW = items.getPixel(x - 1, y);
                var pixE = items.getPixel(x + 1, y);
                if (pixN[3] <= 0.0 || y == 0) {
                    Tesselator.addQuad(geometry, [x - OffsetX, 0, (y - 0.5) - OffsetZ], [0, 0, 0], tid, ImagePixWidth, ImagePixHeight);
                }
                if (pixS[3] <= 0.0 || y == (y1 - 1)) {
                    Tesselator.addQuad(geometry, [x - OffsetX, 0, (y + 0.5) - OffsetZ], [0, Tesselator.toRad(180), 0], tid, ImagePixWidth, ImagePixHeight);
                }
                if (pixW[3] <= 0.0 || x == 0) {
                    Tesselator.addQuad(geometry, [(x - 0.5) - OffsetX, 0, y - OffsetZ], [0, Tesselator.toRad(90), 0], tid, ImagePixWidth, ImagePixHeight);
                }
                if (pixE[3] <= 0.0 || x == (x1 - 1)) {
                    Tesselator.addQuad(geometry, [(x + 0.5) - OffsetX, 0, y - OffsetZ], [0, Tesselator.toRad(-90), 0], tid, ImagePixWidth, ImagePixHeight);
                }
                Tesselator.addQuad(geometry, [x - OffsetX, -0.5, y - OffsetZ], [Tesselator.toRad(-90), 0, 0], tid, ImagePixWidth, ImagePixHeight);
                Tesselator.addQuad(geometry, [x - OffsetX, 0.5, y - OffsetZ], [Tesselator.toRad(90), 0, 0], tid, ImagePixWidth, ImagePixHeight);
                tid++;
            }
        }
    };
    ItemTesselator.itemsImage = Atomic.cache.getResource("Image", "Level/items.png");
    return ItemTesselator;
}(Tesselator));
module.exports = ItemTesselator;
