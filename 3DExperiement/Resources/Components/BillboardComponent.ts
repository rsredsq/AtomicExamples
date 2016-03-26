"atomic component";

class BillboardComponent extends Atomic.JSComponent {
    
    billboardSet: Atomic.BillboardSet;
    billboard: Atomic.Billboard;
    
    //do we need a billboard set to display only one billboard?
    start() {
        this.billboardSet = <Atomic.BillboardSet> this.node.getComponent("BillboardSet") || <Atomic.BillboardSet> this.node.createComponent("BillboardSet"); 
        this.billboardSet.setNumBillboards(1);
        this.billboard = this.billboardSet.getBillboard(0);
        this.billboard.setColor([1, 0, 1, 1]);
        this.billboard.setPosition(this.node.position);
        this.billboard.setRotation(this.node.getRotation2D());
        this.billboardSet.commit();
    }
    
    update() {
        
    }
}