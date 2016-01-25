import {vec3, mat4} from "gl-matrix";
//Don't need that
class Quad {
    
    public width: number;
    public height: number;
    
    public color: Atomic.Color;
    
    public position: Array<number>;
    public rotation: Array<number>;
    
    private verts: Array<number>;
    
    constructor(width: number = 1, height: number = 1) {
        this.width = width;
        this.height = height;
        
        this.color = [1.0, 1.0, 1.0, 1.0];
        
        this.position = vec3.create();
        this.rotation = vec3.create();
        
        this.verts = [];
    }
    
    tesselate(geometry:Atomic.CustomGeometry) {
        
        const sx2 = 1 / 2;
        const sy2 = 1 / 2;
        
        geometry.beginGeometry(0, Atomic.TRIANGLE_LIST);
        geometry.defineVertex([-sx2, sy2, 0]);
        geometry.defineVertex([sx2, sy2, 0]);
        geometry.defineVertex([sx2, -sy2, 0]);
        geometry.defineVertex([sx2, -sy2, 0]);
        geometry.defineVertex([-sx2, -sy2, 0]);
        geometry.defineVertex([-sx2, sy2, 0]);
        geometry.commit();
    }
}

export = Quad;