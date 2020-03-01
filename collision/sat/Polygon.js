import Shape from './Shape';
import Vector from './Vector';
import Point from './Point';
import Projection from './Projection';
import { polygonCollidesWithCircle } from './utils'
import AABB from '../AABB.js';

export default class Polygon extends Shape{
    constructor(id, color='white') {
        super();
        this.id = id;
        this.points = [];
        this.strokeStyle = 'black';
        this.fillStyle = color;
        this.vx = 0;
        this.vy = 0;

        this.collisionList = [];
    }

    getAxes() {
        let v1 = new Vector(),
            v2 = new Vector(),
            axes = []
    
        for(let i = 0, len = this.points.length - 1; i < len; i++) {
            v1.x = this.points[i].x
            v1.y = this.points[i].y
    
            v2.x = this.points[i + 1].x
            v2.y = this.points[i + 1].y
    
            axes.push(v1.edge(v2).normal())
        }
    
        v1.x = this.points[this.points.length - 1].x
        v1.y = this.points[this.points.length - 1].y
    
        v2.x = this.points[0].x
        v2.y = this.points[0].y
    
        axes.push(v1.edge(v2).normal())
    
        return axes
    }
    
    project(axis) {
        let scalars = [];
    
        this.points.forEach(point => {
            let v = new Vector(point);
            scalars.push(v.dotProduct(axis))
        })
    
        return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars))
    }
    
    addPoint(x, y) {
        this.points.push(new Point(x, y))
    }
    
    createPath(context) {
        if(this.points.length === 0) {
            return
        }
    
        context.beginPath()
        context.moveTo(this.points[0].x,this.points[0].y)
    
        for(let i = 0, len = this.points.length; i < len; i++) {
            context.lineTo(this.points[i].x, this.points[i].y)
        }
    
        context.closePath()
    }
    
    move(dx, dy, max_w, max_h) {
        for(let i = 0, point, len = this.points.length; i < len; i++) {
            point = this.points[i]
            point.x += dx
            point.y += dy
            if(point.x >= max_w) {
                this.vx = -Math.abs(this.vx);
            }
            if(point.x <= 0) {
                this.vx = Math.abs(this.vx);
            }
            if(point.y >= max_h) {
                this.vy = -Math.abs(this.vy);
            }
            if(point.y <= 0) {
                this.vy = Math.abs(this.vy);
            }
        }
    }

    getBounds() {
        let max_x, max_y, min_x, min_y;
        max_x = min_x = this.points[0].x;
        max_y = min_y = this.points[0].y;
        for(let i = 1; i < this.points.length; i++) {
            const {x, y} = this.points[i];
            if(x > max_x) {
                max_x = x;
            }
            if(x < min_x) {
                min_x = x;
            }
            if(y > max_y) {
                max_y = y;
            }
            if(y < min_y) {
                min_y = y;
            }
        }
        return {
            x: min_x,
            y: min_y,
            width: max_x - min_x,
            height: max_y - min_y,
            left: min_x,
            top: min_y
        }
    }
    
    collidesWith(shape) {
        // AABB rough check
        const rect1 = this.getBounds();
        const rect2 = shape.getBounds();
        if(!AABB(rect1, rect2)){
            return false;
        }
        // return AABB(rect1, rect2);

        // normal
        let axes = shape.getAxes()
        if(axes === undefined) {
            return polygonCollidesWithCircle(this, shape)
        } else {
            axes = axes.concat(this.getAxes())
            return !this.separationOnAxes(axes, shape)
        }
    }

    changeColor() {
        const COLORS = ['AliceBlue', 'Aqua', 'Beige', 'Chartreuse', 'CornflowerBlue', 'DarkTurquoise'];
        this.fillStyle = COLORS[Math.floor(Math.random()*COLORS.length)];
    }
}