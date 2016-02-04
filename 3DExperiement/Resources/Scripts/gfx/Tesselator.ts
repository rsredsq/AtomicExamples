import {vec3, mat4} from "gl-matrix";

var tempMatrix:Array<number>;

const TileWidth = 16;
const TileHeight = 16;
const ImageWidth = 256;
const ImageHeight = 256;
const TileSize = 1;

const DefaultColor = [1.0, 1.0, 1.0, 1.0];

class Tesselator {
    
    private static Ctor = (() => {
        tempMatrix = mat4.create();
    })();
    
    public static addQuad(geometry: Atomic.CustomGeometry, position: Array<number>, rotation: Array<number>, tileId: number = 0, tileWidth: number = TileWidth, tileHeight: number = TileHeight, imageWidth: number = ImageWidth, imageHeight: number = ImageHeight) {
        Tesselator.addQuadWithColor(geometry, position, rotation, DefaultColor, tileId, tileWidth, tileHeight, imageWidth, imageHeight);
    }
    
    public static addQuadWithColor(geometry: Atomic.CustomGeometry, position: Array<number>, rotation: Array<number>, color:Array<number>, tileId: number = 0, tileWidth: number = TileWidth, tileHeight: number = TileHeight, imageWidth: number = ImageWidth, imageHeight: number = ImageHeight) {
        var m = mat4.identity(tempMatrix);
        
        const sx2 = 1 / 2;
        const sy2 = 1 / 2;
        
        mat4.translate(m, m, position);
        
        if (rotation[0])
            mat4.rotateX(m, m, rotation[0]);
        if (rotation[1])
            mat4.rotateY(m, m, rotation[1]);
        if (rotation[2])
            mat4.rotateZ(m, m, rotation[2]);
            
        var verts = [
              [-sx2, sy2, 0],
              [sx2, sy2, 0],
              [sx2, -sy2, 0],
              [sx2, -sy2, 0],
              [-sx2, -sy2, 0],
              [-sx2, sy2, 0]
        ];
        
        vec3.transformMat4(verts[0], verts[0], m);
        vec3.transformMat4(verts[1], verts[1], m);
        vec3.transformMat4(verts[2], verts[2], m);
        vec3.transformMat4(verts[3], verts[3], m);
        vec3.transformMat4(verts[4], verts[4], m);
        vec3.transformMat4(verts[5], verts[5], m);
        
		var tx = (Math.floor(tileId * tileWidth) % imageWidth) / imageWidth;
		var ty = (Math.floor(tileId * tileWidth / imageWidth) * tileHeight) / imageHeight;
		var wx = tileWidth / imageWidth;
		var wy = tileHeight / imageHeight;
        
        var v1:number[] = [0.0, 0.0, 0.0];
        var v2:number[] = [0.0, 0.0, 0.0];
        var normal:number[] = [0.0, 0.0, 0.0];
        
        vec3.cross(normal, vec3.sub(v1, verts[1], verts[0]), vec3.sub(v2, verts[2], verts[0]));
        
        geometry.defineVertex(verts[0]);
        geometry.defineColor(color);
        geometry.defineTexCoord([tx, ty]);
        geometry.defineNormal(normal);
        
        vec3.cross(normal, vec3.sub(v1, verts[2], verts[1]), vec3.sub(v2, verts[3], verts[1]));
        
        geometry.defineVertex(verts[1]);
        geometry.defineColor(color);
        geometry.defineTexCoord([tx + wx, ty]);
        geometry.defineNormal(normal);
        
        vec3.cross(normal, vec3.sub(v1, verts[3], verts[2]), vec3.sub(v2, verts[4], verts[2]));
        
        geometry.defineVertex(verts[2]);
        geometry.defineColor(color);
        geometry.defineTexCoord([tx + wx, ty + wy]);
        geometry.defineNormal(normal);
                
        vec3.cross(normal, vec3.sub(v1, verts[4], verts[3]), vec3.sub(v2, verts[5], verts[3]));
        
        geometry.defineVertex(verts[3]);
        geometry.defineColor(color);
        geometry.defineTexCoord([tx + wx, ty + wy]);
        geometry.defineNormal(normal);
                
        vec3.cross(normal, vec3.sub(v1, verts[5], verts[4]), vec3.sub(v2, verts[0], verts[4]));
        
        geometry.defineVertex(verts[4]);
        geometry.defineColor(color);
        geometry.defineTexCoord([tx, ty + wy]);
        geometry.defineNormal(normal);
                
        vec3.cross(normal, vec3.sub(v1, verts[0], verts[5]), vec3.sub(v2, verts[1], verts[5]));
        
        geometry.defineVertex(verts[5]);
        geometry.defineColor(color);
        geometry.defineTexCoord([tx, ty]);
        geometry.defineNormal(normal);
    }

    static toRad(angle: number): number {
        return angle * (Math.PI / 180);
    }

}

export = Tesselator;