"use strict";
function degrees(angle) {
    return angle * (180 / Math.PI);
}
function radians(angle) {
    return angle * (Math.PI / 180);
}
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
module.exports = { degrees: degrees, radians: radians, QuatFromEuler: QuatFromEuler };
