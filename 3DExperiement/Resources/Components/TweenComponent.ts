import {update} from "TWEEN";

class TweenComponent extends Atomic.JSComponent {
    
    constructor() {
        super();
    }
    
    update(delta) {
        update();
    }
}

export = TweenComponent;