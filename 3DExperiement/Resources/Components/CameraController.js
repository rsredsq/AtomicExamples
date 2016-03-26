"atomic component";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TWEEN_1 = require("TWEEN");
var utils = require("Scripts/Utils");
var ROTATION_SPEED = 500.0;
var WALKING_SPEED = 250.0;
var CameraController = (function (_super) {
    __extends(CameraController, _super);
    function CameraController() {
        _super.apply(this, arguments);
    }
    CameraController.prototype.start = function () {
        var _this = this;
        this.yaw = this.pitch = 0;
        this.x = this.node.position[0];
        this.y = this.node.position[2];
        this.rotating = this.walking = false;
        this.ticks = 0;
        this.headbob = 0;
        Atomic.input.setMouseMode(Atomic.MM_RELATIVE);
        this.forwardTween = new TWEEN_1.Tween(this).to({ x: this.x + Math.sin(utils.radians(this.yaw)), y: this.y + Math.cos(utils.radians(this.yaw)) }, WALKING_SPEED).onStart(function (object, valuesEnd) {
            if (!_this.isFree(valuesEnd.x, valuesEnd.y)) {
                _this.forwardTween.stop();
                return;
            }
            _this.walking = true;
        }).onUpdate(function (object) {
            _this.headbob = Math.abs(Math.sin(_this.ticks) * 0.2);
            _this.node.position = [_this.x, _this.headbob, _this.y];
        }).onComplete(function (object) {
            _this.walking = false;
            if (Atomic.input.getKeyDown(Atomic.KEY_W)) {
                _this.forwardTween.to({ x: _this.x + Math.sin(utils.radians(_this.yaw)), y: _this.y + Math.cos(utils.radians(_this.yaw)) }, WALKING_SPEED).start();
            }
        });
        this.backwardTween = new TWEEN_1.Tween(this).to({ x: this.x - Math.sin(utils.radians(this.yaw)), y: this.y - Math.cos(utils.radians(this.yaw)) }, WALKING_SPEED).onStart(function (object, valuesEnd) {
            if (!_this.isFree(valuesEnd.x, valuesEnd.y)) {
                _this.backwardTween.stop();
                return;
            }
            _this.walking = true;
        }).onUpdate(function (object) {
            _this.node.position = [_this.x, 0, _this.y];
        }).onComplete(function (object) {
            _this.walking = false;
            if (Atomic.input.getKeyDown(Atomic.KEY_S)) {
                _this.forwardTween.to({ x: _this.x - Math.sin(utils.radians(_this.yaw)), y: _this.y - Math.cos(utils.radians(_this.yaw)) }, WALKING_SPEED).start();
            }
        });
        this.leftTween = new TWEEN_1.Tween(this).to({ yaw: this.yaw - 90 }, ROTATION_SPEED).onStart(function (object) {
            _this.rotating = true;
        }).onUpdate(function (object) {
            _this.node.rotation = utils.QuatFromEuler(_this.pitch, _this.yaw, 0.0);
        }).onComplete(function (object) {
            _this.rotating = false;
            if (Atomic.input.getKeyDown(Atomic.KEY_A)) {
                _this.leftTween.to({ yaw: _this.yaw - 90 }, ROTATION_SPEED).start();
            }
        });
        this.rightTween = new TWEEN_1.Tween(this).to({ yaw: this.yaw + 90 }, ROTATION_SPEED).onStart(function (object) {
            _this.rotating = true;
        }).onUpdate(function (object) {
            _this.node.rotation = utils.QuatFromEuler(_this.pitch, _this.yaw, 0.0);
        }).onComplete(function (object) {
            _this.rotating = false;
            if (Atomic.input.getKeyDown(Atomic.KEY_D)) {
                _this.rightTween.to({ yaw: _this.yaw + 90 }, ROTATION_SPEED).start();
            }
        });
    };
    CameraController.prototype.update = function (delta) {
        this.ticks += delta;
        if (this.walking || this.rotating)
            return;
        if (Atomic.input.getKeyPress(Atomic.KEY_W)) {
            this.forwardTween.to({ x: this.x + Math.sin(utils.radians(this.yaw)), y: this.y + Math.cos(utils.radians(this.yaw)) }, WALKING_SPEED).start();
        }
        if (Atomic.input.getKeyPress(Atomic.KEY_S)) {
            this.backwardTween.to({ x: this.x - Math.sin(utils.radians(this.yaw)), y: this.y - Math.cos(utils.radians(this.yaw)) }, WALKING_SPEED).start();
        }
        if (Atomic.input.getKeyPress(Atomic.KEY_A)) {
            this.leftTween.to({ yaw: this.yaw - 90 }, ROTATION_SPEED).start();
        }
        if (Atomic.input.getKeyPress(Atomic.KEY_D)) {
            this.rightTween.to({ yaw: this.yaw + 90 }, ROTATION_SPEED).start();
        }
        if (Atomic.input.getKeyPress(Atomic.KEY_ESC) && Atomic.input.getMouseMode() == Atomic.MM_RELATIVE) {
            Atomic.input.setMouseMode(Atomic.MM_ABSOLUTE);
        }
    };
    CameraController.prototype.isFree = function (x, y) {
        var tmxFile = Atomic.cache.getResource("TmxFile2D", "Level/TestLevel.tmx");
        var wallsLayer;
        for (var i = 0; i < tmxFile.getNumLayers(); i++) {
            var layer = tmxFile.getLayer(i);
            if (layer.name == "walls") {
                wallsLayer = layer;
                break;
            }
        }
        return wallsLayer.getTile(x, y) == null;
    };
    return CameraController;
}(Atomic.JSComponent));
module.exports = CameraController;
