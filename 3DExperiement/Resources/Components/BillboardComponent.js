"atomic component";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BillboardComponent = (function (_super) {
    __extends(BillboardComponent, _super);
    function BillboardComponent() {
        _super.apply(this, arguments);
    }
    BillboardComponent.prototype.start = function () {
        this.billboardSet = this.node.getComponent("BillboardSet") || this.node.createComponent("BillboardSet");
        this.billboardSet.setNumBillboards(1);
        this.billboard = this.billboardSet.getBillboard(0);
        this.billboard.setColor([1, 0, 1, 1]);
        this.billboard.setPosition(this.node.position);
        this.billboard.setRotation(this.node.getRotation2D());
        this.billboardSet.commit();
    };
    BillboardComponent.prototype.update = function () {
    };
    return BillboardComponent;
}(Atomic.JSComponent));
