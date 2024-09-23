export default class CollisionShape
{
    // note: only convex supported
    constructor(app, x, y, width, height, scale, vertices)
    {
        this.app = app;

        this.vertices = this.scalePolygon(x, y, width, height, scale, vertices);
        
        // debug
        // this.debugLayer = new PIXI.Graphics();
        // this.drawOutline(this.vertices);
    }
    

    /**
     * Note: this must return a copy of vertices,due to them likely 
     *       coming from BRICKTYPES config), or we'll mess up future 
     *       instances of this shape.
     * @param {*} scale 
     * @param {*} verts 
     */
    scalePolygon(x, y, width, height, scale, verts)
    {
        const ret = [];
        for(let i = 0; i < verts.length; i++) {
            ret.push(
                {
                    x: (verts[i].x * scale) + (x - width/2),
                    y: (verts[i].y * scale) + (y - height/2)
                }
            );
        }

        return ret;
    }


    isPointInPolygon(point)
    {
        const { x, y } = point;
        let inside = false;
        for (let i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
            const xi = this.vertices[i].x, yi = this.vertices[i].y;
            const xj = this.vertices[j].x, yj = this.vertices[j].y;
            const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }
    
    checkCollision(pos, vel, radius)
    {
        if (this.isPointInPolygon(pos)) return { x: -vel.x, y: -vel.y };
        
        for (let i = 0; i < this.vertices.length; i++) {
            const start = this.vertices[i];
            const end = this.vertices[(i + 1) % this.vertices.length];
            const closestPoint = this.closestPointOnSegment(start, end, pos);
            
            if (this.distance(closestPoint, pos) < radius) {
                const normal = this.getNormal(start, end);
                const dotProduct = vel.x * normal.x + vel.y * normal.y;
                const newVelocity = {
                    x: vel.x - 2 * dotProduct * normal.x,
                    y: vel.y - 2 * dotProduct * normal.y
                };
                // this.drawDot(pos);
                return newVelocity;
            }
        }
        
        return null;
    }
    
    closestPointOnSegment(a, b, p)
    {
        const ab = { x: b.x - a.x, y: b.y - a.y };
        const ap = { x: p.x - a.x, y: p.y - a.y };
        const ab_ap = ap.x * ab.x + ap.y * ab.y;
        const ab_ab = ab.x * ab.x + ab.y * ab.y;
        const t = Math.max(0, Math.min(1, ab_ap / ab_ab));
        return { x: a.x + t * ab.x, y: a.y + t * ab.y };
    }
    
    getNormal(a, b)
    {
        const dx = b.y - a.y;
        const dy = a.x - b.x;
        const length = Math.sqrt(dx * dx + dy * dy);
        return { x: dx / length, y: dy / length };
    }
    
    distance(point1, point2)
    {
        return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
    }
    
    
    drawOutline(vertices)
    {
        this.app.stage.addChild(this.debugLayer);
        this.debugLayer.lineStyle(4, 0xffffff);
        
        this.debugLayer.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 0; i < vertices.length; i++) {
            this.debugLayer.lineTo(vertices[i].x, vertices[i].y);
        }
        this.debugLayer.lineTo(vertices[0].x, vertices[0].y);
    }
    
    drawDot(point)
    {
        const gr  = new PIXI.Graphics();
        gr.beginFill(0x000000);
        gr.drawCircle(point.x, point.y, 3);
        gr.endFill();
        this.debugLayer.addChild(gr);
    }
}
