"atomic component";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MOVE_SPEED = 10.0;
var MOUSE_SENSITIVITY = 0.1;
var CameraController = (function (_super) {
    __extends(CameraController, _super);
    function CameraController() {
        _super.apply(this, arguments);
    }
    CameraController.prototype.start = function () {
        this.yaw = 0;
        this.pitch = 0;
        Atomic.input.setMouseMode(Atomic.MM_RELATIVE);
    };
    CameraController.prototype.update = function (delta) {
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
        this.pitch += mouseY * MOUSE_SENSITIVITY;
        if (this.pitch < -90) {
            this.pitch = -90;
        }
        if (this.pitch > 90) {
            this.pitch = 90;
        }
        this.node.rotation = QuatFromEuler(this.pitch, this.yaw, 0.0);
        var speed = MOVE_SPEED * delta;
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
        if (Atomic.input.getKeyPress(Atomic.KEY_ESC) && Atomic.input.getMouseMode() == Atomic.MM_RELATIVE) {
            Atomic.input.setMouseMode(Atomic.MM_ABSOLUTE);
        }
    };
    return CameraController;
})(Atomic.JSComponent);
function QuatFromEuler(x, y, z) {
    var q = [0, 0, 0, 0];
    x *= (Math.PI / 360);
    y *= (Math.PI / 360);
    z *= (Math.PI / 360);
    var sinX = Math.sin(x);
    var cosX = Math.cos(x);
    var sinY = Math.sin(y);
    var cosY = Math.cos(y);
    var sinZ = Math.sin(z);
    var cosZ = Math.cos(z);
    q[0] = cosY * cosX * cosZ + sinY * sinX * sinZ;
    q[1] = cosY * sinX * cosZ + sinY * cosX * sinZ;
    q[2] = sinY * cosX * cosZ - cosY * sinX * sinZ;
    q[3] = cosY * cosX * sinZ - sinY * sinX * cosZ;
    return q;
}
module.exports = CameraController;
