"atomic component"

const baseRange:number = 3;
const flicker:string = "mmmaaaammmaaaabcdefgabcdefg";

class LightFlicker extends Atomic.JSComponent {
    
    light: Atomic.Light;

    targetValue:number = baseRange;
    index:number = Math.random() * (flicker.length - 1);
    time:number = 100;

    start() {
        this.light = <Atomic.Light> this.node.getComponent("Light");
    }

    update(timestep) {
        this.time += timestep;
        if (this.time > .05) {
            this.index++;
            this.time = 0.0;

            if (this.index >= flicker.length)
                this.index = 0;

            this.targetValue = baseRange * (flicker.charCodeAt(this.index) / 255);
        }

        if (this.light.range < this.targetValue)
            this.light.range += timestep * 10;

        if (this.light.range > this.targetValue)
            this.light.range -= timestep * 10;
    }
}

export = LightFlicker;