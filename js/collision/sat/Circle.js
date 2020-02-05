import Shape from './Shape';
import Point from './Point';
import Vector from './Vector';
import Projection from './Projection';
import { polygonCollidesWithCircle } from './utils';

export default class Circle extends Shape{
    constructor(x, y, radius) {
        super();
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.strokeStyle = 'rgba(255, 253, 208, .9)'
        this.fillStyle = 'rgba(147, 197, 114, .8)'
    }

    collidesWith(shape) {
        let axes = shape.getAxes();
    
        if(axes === undefined) {
            let distance = Math.sqrt(Math.pow(shape.x - this.x, 2) + Math.pow(shape.y - this.y, 2));
            return distance < Math.abs(this.radius + shape.radius)
        } else {
            return polygonCollidesWithCircle(shape, this)
        }
    }
    
    getAxes() {
        return undefined
    }
    
    project(axis) {
        let scalars = [];
        const point = new Point(this.x, this.y);
        const dotProduct = new Vector(point).dotProduct(axis)
    
        scalars.push(dotProduct)
        scalars.push(dotProduct + this.radius)
        scalars.push(dotProduct - this.radius)
    
        return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars))
    }
    
    move(dx, dy) {
        this.x += dx
        this.y += dy
    }
    
    createPath(context) {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    }
}



