// Configuration
const PIXICONFIG = {
    width: 800, height: 600, backgroundColor: 0x2066aa, antialias: true
    /* debug: , renderingToScreen : true */ 
};

const CONFIG = {
    ball: { 
        radius: 10, 
        color: 0xffffff, 
        spinDecayPerFrame: 0.05 / 60,   // 5% per frame
        spinFactor: 0.1,
        initialVel: 2, 
        defaultSpin: -0.1
    },
    paddle: { width: 10, height: 80, color: 0xff0000, speed: 5, surfaceSpeedFactor: 0.001, offsetX : 50 },
    walls: { width: PIXICONFIG.width / 2, height: 10, color: 0x00ff00, surfaceSpeedFactor: 0.001 },
    debug: { trajectoryColor: 0xffff00, trajectoryWidth: 1 }
};

const BRICKTYPES = {
    "1" : {
        graphic: './assets/brick02-132x256.png',
        width: 132,
        height: 256,
        scale : 0.25,
        health: 3,
        vertices: [
            { x: 50, y: 0 }, 
            { x: 85, y: 0 }, 
            { x: 132, y: 45 }, 
            { x: 132, y: 210 }, 
            { x: 85, y: 256 }, 
            { x: 50, y: 256 }, 
            { x: 0, y: 210 }, 
            { x: 0, y: 45 }
        ]
    }
}

export { CONFIG, PIXICONFIG, BRICKTYPES };
export default CONFIG;