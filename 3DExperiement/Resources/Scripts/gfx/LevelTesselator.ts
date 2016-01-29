import {vec3, mat4} from "gl-matrix";

const TileWidth = 16;
const TileHeight = 16;
const ImageWidth = 256;
const ImageHeight = 256;
const TileSize = 1;

class LevelTesselator {
    
    levelNode: Atomic.Node;
    levelGeometry: Atomic.CustomGeometry;
    
    private matrix:Array<number>;
    
    constructor() {
        this.matrix = mat4.create();
        
        this.levelNode = Atomic.player.currentScene.getChild("LevelNode");
        
        if (!this.levelNode) {
            console.log("Creating a new level node");
            this.levelNode = Atomic.player.currentScene.createChild("LevelNode");
        }
        this.levelNode.position = [0, 0, 0];
        this.levelGeometry = <Atomic.CustomGeometry> this.levelNode.getOrCreateComponent("CustomGeometry");
    }
    
    tesselate() {
        var tmxFile:Atomic.TmxFile2D = <Atomic.TmxFile2D> Atomic.cache.getResource("TmxFile2D", "Level/TestLevel.tmx");
        
        this.levelGeometry.setNumGeometries(3);
        
        //this.levelGeometry.beginGeometry(0, Atomic.TRIANGLE_LIST);
        
        for (let i = 0; i < tmxFile.getNumLayers(); i++) {
            var layer = tmxFile.getLayer(i);
            if (layer.getName() == "walls") {
                this.levelGeometry.beginGeometry(0, Atomic.TRIANGLE_LIST);
                this.tesselateWalls(<Atomic.TmxTileLayer2D> layer);
                this.levelGeometry.commit();
                //this.levelGeometry.setMaterialIndex(0, <Atomic.Material> Atomic.cache.getResource("Material", "Materials/LevelMaterial.material"));
            }
            if (layer.getName() == "floor") {
                this.levelGeometry.beginGeometry(1, Atomic.TRIANGLE_LIST);
                this.tesselateFloorOrCeil(<Atomic.TmxTileLayer2D> layer);
                this.levelGeometry.commit();
                //this.levelGeometry.setMaterialIndex(1, <Atomic.Material> Atomic.cache.getResource("Material", "Materials/LevelMaterial.material"));
            }
            if (layer.getName() == "ceil") {
                this.levelGeometry.beginGeometry(2, Atomic.TRIANGLE_LIST);
                this.tesselateFloorOrCeil(<Atomic.TmxTileLayer2D> layer, false);    
                this.levelGeometry.commit();
                //this.levelGeometry.setMaterialIndex(2, <Atomic.Material> Atomic.cache.getResource("Material", "Materials/LevelMaterial.material"));
            }
        }
        
        this.levelGeometry.setMaterial(<Atomic.Material> Atomic.cache.getResource("Material", "Materials/LevelMaterial.material"));
        
        var vertices:number = 0;
        
        for (let i = 0; i < this.levelGeometry.getNumGeometries(); i++) {
            vertices += this.levelGeometry.getNumVertices(i);
        }
        console.log("TOTAL VERTICES: " + vertices);
    }
    
    //TODO remove the floor tiles from the places where wall tiles already exists
    tesselateFloorOrCeil(floorLayer: Atomic.TmxTileLayer2D, floor: boolean = true) {
        for (var x = 0; x < floorLayer.width; x++) {
            for (var y = 0; y < floorLayer.height; y++) {
                var tile = floorLayer.getTile(x, y);
                if (!tile) continue;
                if (floor) {
                    this.addQuad([x * TileSize, -0.5, y * TileSize], [toRad(90), 0, 0], tile.getGid() - 1);                    
                } else {
                    this.addQuad([x * TileSize, 0.5, y * TileSize], [toRad(-90), 0, 0], tile.getGid() - 1);                                        
                }
            }
        }
    }
    
    tesselateWalls(wallsLayer: Atomic.TmxTileLayer2D) {
        for (var x = 0; x < wallsLayer.width; x++) {
            for (var y = 0; y < wallsLayer.height; y++) {
                var tile = wallsLayer.getTile(x, y);
                if (!tile) continue;
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
    }
    
    addQuad(position: Array<number>, rotation: Array<number>, tileId: number) {
        var m = mat4.identity(this.matrix);
        
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
        
		var tx = (Math.floor(tileId * TileWidth) % ImageWidth) / ImageWidth;
		var ty = (Math.floor(tileId * TileWidth / ImageWidth) * TileHeight) / ImageHeight;
		var wx = TileWidth / ImageWidth;
		var wy = TileHeight / ImageHeight;
        
        var v1:number[] = [0.0, 0.0, 0.0];
        var v2:number[] = [0.0, 0.0, 0.0];
        var normal:number[] = [0.0, 0.0, 0.0];
        
        vec3.cross(normal, vec3.sub(v1, verts[1], verts[0]), vec3.sub(v2, verts[2], verts[0]));
        
        this.levelGeometry.defineVertex(verts[0]);
        this.levelGeometry.defineTexCoord([tx, ty]);
        this.levelGeometry.defineNormal(normal);
        
        vec3.cross(normal, vec3.sub(v1, verts[2], verts[1]), vec3.sub(v2, verts[3], verts[1]));
        
        this.levelGeometry.defineVertex(verts[1]);
        this.levelGeometry.defineTexCoord([tx + wx, ty]);
        this.levelGeometry.defineNormal(normal);
        
        vec3.cross(normal, vec3.sub(v1, verts[3], verts[2]), vec3.sub(v2, verts[4], verts[2]));
        
        this.levelGeometry.defineVertex(verts[2]);
        this.levelGeometry.defineTexCoord([tx + wx, ty + wy]);
        this.levelGeometry.defineNormal(normal);
                
        vec3.cross(normal, vec3.sub(v1, verts[4], verts[3]), vec3.sub(v2, verts[5], verts[3]));
        
        this.levelGeometry.defineVertex(verts[3]);
        this.levelGeometry.defineTexCoord([tx + wx, ty + wy]);
        this.levelGeometry.defineNormal(normal);
                
        vec3.cross(normal, vec3.sub(v1, verts[5], verts[4]), vec3.sub(v2, verts[0], verts[4]));
        
        this.levelGeometry.defineVertex(verts[4]);
        this.levelGeometry.defineTexCoord([tx, ty + wy]);
        this.levelGeometry.defineNormal(normal);
                
        vec3.cross(normal, vec3.sub(v1, verts[0], verts[5]), vec3.sub(v2, verts[1], verts[5]));
        
        this.levelGeometry.defineVertex(verts[5]);
        this.levelGeometry.defineTexCoord([tx, ty]);
        this.levelGeometry.defineNormal(normal);
    }
}

function toRad(angle:number) {
  return angle * (Math.PI / 180);
}

export = LevelTesselator;