"atomic component";

import {vec3, quat} from "gl-matrix";

const MOVE_SPEED = 10.0;
const MOUSE_SENSITIVITY = 0.1;

class CameraController extends Atomic.JSComponent {
    
    yaw: number;
    pitch: number;
    
    start() {
        this.yaw = 0;
        this.pitch = 0;
        //Atomic.input.setMouseMode(Atomic.MM_WRAP);
    }
    
    update(delta) {
        var forward = false;
        var left = false;
        var right = false;
        var backward = false;
        var mouseX = Atomic.input.getMouseMoveX();
        var mouseY = Atomic.input.getMouseMoveY();
        
        if (Atomic.input.getKeyDown(Atomic.KEY_W)) {
            forward = true;
        }
        if (Atomic.input.getKeyDown(Atomic.KEY_S)) {
            backward = true;
        }
        if (Atomic.input.getKeyDown(Atomic.KEY_A)) {
            left = true;
        }
        if (Atomic.input.getKeyDown(Atomic.KEY_D)) {
            right = true;
        }

        this.yaw += mouseX * MOUSE_SENSITIVITY;
        //this.pitch += mouseY * MOUSE_SENSITIVITY;

        if (this.pitch < -90) {
            this.pitch = -90;
        }

        if (this.pitch > 90) {
            this.pitch = 90;
        }

        // Construct new orientation for the camera scene node from yaw and pitch. Roll is fixed to zero
        this.node.rotation = QuatFromEuler(this.pitch, this.yaw, 0.0);

        let speed = MOVE_SPEED * delta;

        //translate camera on the amount of speed value
        if (forward) {
            this.node.translate([0.0, 0.0, speed]);
        }
        if (backward) {
            this.node.translate([0.0, 0.0, -speed]);
        }
        if (left) {
            this.node.translate([-speed, 0.0, 0.0]);
        }
        if (right) {
            this.node.translate([speed, 0.0, 0.0]);
        }
    }
    
}

function QuatFromEuler(x, y, z) {
    let q = [0, 0, 0, 0];
    x *= (Math.PI / 360);
    y *= (Math.PI / 360);
    z *= (Math.PI / 360);
    const sinX = Math.sin(x);
    const cosX = Math.cos(x);
    const sinY = Math.sin(y);
    const cosY = Math.cos(y);
    const sinZ = Math.sin(z);
    const cosZ = Math.cos(z);
    q[0] = cosY * cosX * cosZ + sinY * sinX * sinZ;
    q[1] = cosY * sinX * cosZ + sinY * cosX * sinZ;
    q[2] = sinY * cosX * cosZ - cosY * sinX * sinZ;
    q[3] = cosY * cosX * sinZ - sinY * sinX * cosZ;
    return q;
}

export = CameraController;