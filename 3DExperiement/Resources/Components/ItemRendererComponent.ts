"atomic component";

import ItemTesselator = require("Scripts/gfx/ItemTesselator");

class ItemRendererComponent extends Atomic.JSComponent {

    geometry: Atomic.CustomGeometry;

    start() {
        this.node.scale = [0.01, 0.01, 0.01];
        
        this.geometry = <Atomic.CustomGeometry> this.node.getOrCreateComponent("CustomGeometry");
        this.geometry.setNumGeometries(1);
        this.geometry.setCastShadows(true);
        
        this.geometry.beginGeometry(0, Atomic.TRIANGLE_LIST);
        ItemTesselator.tesselateItem(this.geometry, 0);
        this.geometry.commit();
        
        this.geometry.setMaterial(<Atomic.Material> Atomic.cache.getResource("Material", "Materials/ItemsMaterial.material"));
        
        this.node.pitch(90);
    }
    
    update(delta) {
        // this.node.yaw(delta * 10);
        // this.node.roll(delta * 80);
        // this.node.pitch(delta * 10);
    }
    
}

export = ItemRendererComponent;