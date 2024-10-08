// Configuration
const PIXICONFIG = {
    width: 800, height: 600, backgroundColor: 0x2066aa, antialias: true
    /* debug: , renderingToScreen : true */ 
};

const CONFIG = {
    ball: { 
        radius: 10, 
        color: 0xffffff, 
        spinDecayPerFrame: 0.02 / 60,   // N % per frame (TODO: Make game run at fixed framerate)
        velocityDecayPerFrame: 0, //0.02 / 60,
        spinFactor: 0.1,
        initialVel: 4, 
        defaultSpin: -0.4
    },
    paddle: {
        width: 10,
        defaultHeight: 80,
        color: 0xff0000,
        speed: 10,
        surfaceSpeedFactor: 0.001, offsetX : 50
    },
    walls: { width: PIXICONFIG.width / 2, height: 10, color: 0x00ff00, surfaceSpeedFactor: 0.001 },
    debug: { trajectoryColor: 0xffff00, trajectoryWidth: 1 }
};

const DEFAULT_KEYBOARD = {
    pause : "KeyP",
    leftPlayer : {
        paddle :
        {
            up: 'KeyW',
            down: 'KeyS',
            incSurfaceSpeed: 'KeyD',
            decSurfaceSpeed: 'KeyE'
        },
        walls  : {
            top : {
                incSurfaceSpeed: 'KeyQ',
                decSurfaceSpeed: 'KeyR'
            },
            bottom :{
                incSurfaceSpeed: 'KeyQ',
                decSurfaceSpeed: 'KeyR'
            }
        }
    },
    rightPlayer : {
        paddle : {
			up: 'Numpad8',
			down: 'Numpad5',
			incSurfaceSpeed: 'Numpad6',
			decSurfaceSpeed: 'Numpad9'
		},
        walls  : {
            top : {
                incSurfaceSpeed: 'Numpad1',
                decSurfaceSpeed: 'Numpad3'
            },
            bottom : {
                incSurfaceSpeed: 'Numpad1',
                decSurfaceSpeed: 'Numpad3'
            }
        }
    }


}

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
    },
}

const POWERUPTYPES = {
    "faster-ball" : {
        text: "FASTER",
        graphic: './assets/powerup01-256x209.png',
        width: 256,
        height: 209,
        scale : 0.2,
        vertices: [
            { x : 10,  y : 10  },
            { x : 246, y : 10  },
            { x : 246, y : 199 },
            { x : 10,  y : 199 },
        ],
        effect: (lastPaddle, ball) => {
            return {
                newVelocity: {
                    x : ball.velocity.x * 2,
                    y : ball.velocity.y * 2,
                },
                newSpin : ball.spin * 2,
            }
        }
    },
    "slower-ball" : {
        text: "SLOWER",
        graphic: './assets/powerup01-256x209.png',
        width: 256,
        height: 209,
        scale : 0.2,
        vertices: [
            { x : 0,   y : 0   },
            { x : 256, y : 0   },
            { x : 256, y : 209 },
            { x : 0,   y : 209 },
        ],
        effect: (lastPaddle, ball) => {
            return {
                newVelocity: {
                    x : ball.velocity.x / 2,
                    y : ball.velocity.y / 2,
                },
                newSpin : ball.spin / 2,
            }
        }
    },
    "bigger-paddle" : {
        text: "BIGGER",
        graphic: './assets/powerup01-256x209.png',
        width: 256,
        height: 209,
        scale : 0.2,
        vertices: [
            { x : 0,   y : 0   },
            { x : 256, y : 0   },
            { x : 256, y : 209 },
            { x : 0,   y : 209 },
        ],
        effect: (lastPaddle, ball) => {
            if(lastPaddle) {
                lastPaddle.resizeMiddleSegment(2);
            } else {
                console.warn("bigger-paddle: no lastPaddle");
            }
            return null;
        }
    },
    "smaller-paddle" : {
        text: "SMALLER",
        graphic: './assets/powerup01-256x209.png',
        width: 256,
        height: 209,
        scale : 0.2,
        vertices: [
            { x : 0,   y : 0   },
            { x : 256, y : 0   },
            { x : 256, y : 209 },
            { x : 0,   y : 209 },
        ],
        effect: (lastPaddle, ball) => {
            if(lastPaddle) {
                lastPaddle.resizeMiddleSegment(0.8);
            } else {
                console.warn("smaller-paddle: no lastPaddle");
            }
            return null;
        }
    },
    "reset" : {
        text: "RESET",
        graphic: './assets/powerup01-256x209.png',
        width: 256,
        height: 209,
        scale : 0.2,
        vertices: [
            { x : 0,   y : 0   },
            { x : 256, y : 0   },
            { x : 256, y : 209 },
            { x : 0,   y : 209 },
        ],
        effect: (lastPaddle, ball) => {
            return {
                newVelocity: {
                    x : 2,
                    y : 2,
                },
                newSpin : 0,
            }
        }
    },


}

export { CONFIG, PIXICONFIG, BRICKTYPES, POWERUPTYPES, DEFAULT_KEYBOARD };
export default CONFIG;