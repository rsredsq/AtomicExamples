import {vec3, mat4} from "gl-matrix";

import Tesselator = require("./Tesselator");

class LevelTesselator extends Tesselator {
    
    levelNode: Atomic.Node;
    levelGeometry: Atomic.CustomGeometry;
    
    constructor() {
        super();
    
        this.levelNode = Atomic.player.currentScene.getChild("LevelNode");
        
        if (!this.levelNode) {
            console.log("Creating a new level node");
            this.levelNode = Atomic.player.currentScene.createChild("LevelNode");
        }
        this.levelNode.position = [0, 0, 0];
        this.levelGeometry = <Atomic.CustomGeometry> this.levelNode.getOrCreateComponent("CustomGeometry");
        this.levelGeometry.setCastShadows(true);
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
        
        console.log("Total vertices: " + vertices);
    }
    
    //TODO remove the floor tiles from the places where wall tiles already exists
    tesselateFloorOrCeil(floorLayer: Atomic.TmxTileLayer2D, floor: boolean = true) {
        for (var x = 0; x < floorLayer.width; x++) {
            for (var y = 0; y < floorLayer.height; y++) {
                var tile = floorLayer.getTile(x, y);
                if (!tile) continue;
                if (floor) {
                    Tesselator.addQuad(this.levelGeometry, [x, -0.5, y], [Tesselator.toRad(90), 0, 0], tile.getGid() - 1);                    
                } else {
                    Tesselator.addQuad(this.levelGeometry, [x, 0.5, y], [Tesselator.toRad(-90), 0, 0], tile.getGid() - 1);                                        
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
                     Tesselator.addQuad(this.levelGeometry, [x, 0, (y - 0.5)], [0, 0, 0], tile.getGid() - 1);                                        
                }
                if (!tileS) {
                    Tesselator.addQuad(this.levelGeometry, [x, 0, (y + 0.5)], [0, Tesselator.toRad(180), 0], tile.getGid() - 1);                    
                }                
                if (!tileW) {
                    Tesselator.addQuad(this.levelGeometry, [(x - 0.5), 0, y], [0, Tesselator.toRad(90), 0], tile.getGid() - 1);                    
                }
                if (!tileE) {
                    Tesselator.addQuad(this.levelGeometry, [(x + 0.5), 0, y], [0, Tesselator.toRad(-90), 0], tile.getGid() - 1);
                }
            }
        }
    }
}




export = LevelTesselator;