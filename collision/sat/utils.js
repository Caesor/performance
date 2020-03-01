
import Vector from './Vector';
import Point from './Point';

function getPolygonPointClosestToCircle(polygon, circle) {
    let min = 10000;
    let closestPoint;

    const { length: len } =  polygon.points;
    for(let i = 0; i < len; i++) {
        const point = polygon.points[i]
        const dis = Math.sqrt(Math.pow(point.x - circle.x, 2), Math.pow(point.y - circle.y, 2))

        if(dis < min) {
            min = dis;
            closestPoint = point;
        }
    }
    return closestPoint;
}

export function polygonCollidesWithCircle(polygon, circle) {
    let axes = polygon.getAxes()
    const closestPoint = getPolygonPointClosestToCircle(polygon, circle)
    const v1 = new Vector(new Point(circle.x, circle.y))
    const v2 = new Vector(new Point(closestPoint.x, closestPoint.y))
    axes.push(v1.subtract(v2).normalize())
    return !polygon.separationOnAxes(axes, circle)
}