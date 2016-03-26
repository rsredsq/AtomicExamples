"atomic component";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ItemTesselator = require("Scripts/gfx/ItemTesselator");
var ItemRendererComponent = (function (_super) {
    __extends(ItemRendererComponent, _super);
    function ItemRendererComponent() {
        _super.apply(this, arguments);
    }
    ItemRendererComponent.prototype.start = function () {
        this.node.scale = [0.01, 0.01, 0.01];
        this.geometry = this.node.getOrCreateComponent("CustomGeometry");
        this.geometry.setNumGeometries(1);
        this.geometry.setCastShadows(true);
        this.geometry.beginGeometry(0, Atomic.TRIANGLE_LIST);
        ItemTesselator.tesselateItem(this.geometry, 0);
        this.geometry.commit();
        this.geometry.setMaterial(Atomic.cache.getResource("Material", "Materials/ItemsMaterial.material"));
        this.node.pitch(90);
    };
    ItemRendererComponent.prototype.update = function (delta) {
    };
    return ItemRendererComponent;
}(Atomic.JSComponent));
module.exports = ItemRendererComponent;
