"atomic component";

import {vec3, quat} from "gl-matrix";
import {Tween} from "TWEEN";

import utils = require("Scripts/Utils");

const ROTATION_SPEED = 500.0;
const WALKING_SPEED = 250.0;

class CameraController extends Atomic.JSComponent {
    
    x: number;
    y: number;
    
    yaw: number;
    pitch: number;
    
    leftTween: Tween;
    rightTween: Tween;
    
    forwardTween: Tween;
    backwardTween: Tween;
    
    walking: boolean;
    rotating: boolean;
    
    headbob:number;
    ticks:number;
    
    start() {
        this.yaw = this.pitch = 0;
        
        this.x = this.node.position[0];
        this.y = this.node.position[2];
        
        this.rotating = this.walking = false;
        
        this.ticks = 0;
        this.headbob = 0
        
        Atomic.input.setMouseMode(Atomic.MM_RELATIVE);
        
        this.forwardTween = new Tween(this).to({x: this.x + Math.sin(utils.radians(this.yaw)), y: this.y + Math.cos(utils.radians(this.yaw))}, WALKING_SPEED).onStart((object?: any, valuesEnd?:any) => {
            if (!this.isFree(valuesEnd.x, valuesEnd.y)) {
                this.forwardTween.stop();
                return;
            }
            this.walking = true;   
        }).onUpdate((object?:any) => {
            this.headbob = Math.abs(Math.sin(this.ticks)*0.2);
            this.node.position = [this.x, this.headbob, this.y];
        }).onComplete((object?:any) => {
            this.walking = false;
            if (Atomic.input.getKeyDown(Atomic.KEY_W)) {
                this.forwardTween.to({x: this.x + Math.sin(utils.radians(this.yaw)), y: this.y + Math.cos(utils.radians(this.yaw))}, WALKING_SPEED).start();
            }
        });
        
        this.backwardTween = new Tween(this).to({x: this.x - Math.sin(utils.radians(this.yaw)), y: this.y - Math.cos(utils.radians(this.yaw))}, WALKING_SPEED).onStart((object?: any, valuesEnd?:any) => {
            if (!this.isFree(valuesEnd.x, valuesEnd.y)) {
                this.backwardTween.stop();
                return;
            }
            this.walking = true;
        }).onUpdate((object?:any) => {
            this.headbob = Math.abs(Math.sin(this.ticks)*0.2);
            this.node.position = [this.x, this.headbob, this.y];
        }).onComplete((object?:any) => {
            this.walking = false;
            if (Atomic.input.getKeyDown(Atomic.KEY_S)) {
                this.backwardTween.to({x: this.x - Math.sin(utils.radians(this.yaw)), y: this.y - Math.cos(utils.radians(this.yaw))}, WALKING_SPEED).start();
            }
        });
        
        this.leftTween = new Tween(this).to({yaw: this.yaw - 90}, ROTATION_SPEED).onStart((object?: any) => {
            this.rotating = true;   
        }).onUpdate((object?:any) => {
            this.node.rotation = utils.QuatFromEuler(this.pitch, this.yaw, 0.0);
        }).onComplete((object?:any) => {
            this.rotating = false;   
            if (Atomic.input.getKeyDown(Atomic.KEY_A)) {
                this.leftTween.to({yaw: this.yaw - 90}, ROTATION_SPEED).start();
            }
        });
        
        this.rightTween = new Tween(this).to({yaw: this.yaw + 90}, ROTATION_SPEED).onStart((object?: any) => {
            this.rotating = true;   
        }).onUpdate((object?:any) => {
            this.node.rotation = utils.QuatFromEuler(this.pitch, this.yaw, 0.0);
        }).onComplete((object?:any) => {
            this.rotating = false;
            if (Atomic.input.getKeyDown(Atomic.KEY_D)) {
                this.rightTween.to({yaw: this.yaw + 90}, ROTATION_SPEED).start();
            }
        });
    }
    
    update(delta) {
        if(this.walking)
            this.ticks += delta;
        
        if (this.walking || this.rotating) return;
        
        if (Atomic.input.getKeyPress(Atomic.KEY_W)) {
            this.forwardTween.to({x: this.x + Math.sin(utils.radians(this.yaw)), y: this.y + Math.cos(utils.radians(this.yaw))}, WALKING_SPEED).start();
        }
        if (Atomic.input.getKeyPress(Atomic.KEY_S)) {
            this.backwardTween.to({x: this.x - Math.sin(utils.radians(this.yaw)), y: this.y - Math.cos(utils.radians(this.yaw))}, WALKING_SPEED).start();
        }
        if (Atomic.input.getKeyPress(Atomic.KEY_A)) {
            this.leftTween.to({yaw: this.yaw - 90}, ROTATION_SPEED).start();
        }
        if (Atomic.input.getKeyPress(Atomic.KEY_D)) {
            this.rightTween.to({yaw: this.yaw + 90}, ROTATION_SPEED).start();
        }

        if (Atomic.input.getKeyPress(Atomic.KEY_ESC) && Atomic.input.getMouseMode() == Atomic.MM_RELATIVE) {
            Atomic.input.setMouseMode(Atomic.MM_ABSOLUTE);
        } 
    }
    
    //TODO: reimplement that function, because it's incredibly unoptimized!
    isFree(x, y){
        var tmxFile:Atomic.TmxFile2D = <Atomic.TmxFile2D> Atomic.cache.getResource("TmxFile2D", "Level/TestLevel.tmx");
        var wallsLayer:Atomic.TmxTileLayer2D;
        for(let i = 0; i < tmxFile.getNumLayers(); i++) {
            let layer = tmxFile.getLayer(i);
            if (layer.name == "walls") {
                wallsLayer = <Atomic.TmxTileLayer2D> layer;
                break;    
            }
        }
        return wallsLayer.getTile(x, y) == null;
    }
    
}

export = CameraController;