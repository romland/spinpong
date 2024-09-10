// Configuration
const PIXICONFIG = { width: 800, height: 600, backgroundColor: 0x1099bb, antialias: true };
const CONFIG = {
    ball: { radius: 10, color: 0xffffff, initialVel: 5, spinFactor: 0.1, defaultSpin: 0 },
    paddle: { width: 10, height: 80, color: 0xff0000, speed: 5, surfaceSpeedFactor: 0.001, offsetX : 50 },
    walls: { width: PIXICONFIG.width / 2, height: 10, color: 0x00ff00, surfaceSpeedFactor: 0.001 },
    debug: { trajectoryColor: 0xffff00, trajectoryWidth: 1 }
};

export { CONFIG, PIXICONFIG };
export default CONFIG;