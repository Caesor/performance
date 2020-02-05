export default class Shape {
    constructor() {
        this.x = undefined
        this.y = undefined
        this.strokeStyle = 'rgba(255, 253, 208, 0.9)'
        this.fillStyle = 'rgba(147, 147, 147, .8)'
    }

    collidesWith(shape) {
        const axes = this.getAxes().concat(shape.getAxes())
        return !this.separationOnAxes(axes, shape)
    }

    // 每条单位向量法线作为投影轴
    // 计算每个 shape 在投影轴上的投影是否重叠
    separationOnAxes(axes, shape) {
        const { length } = axes;
        for(let i = 0; i < length; i++) {
            const axis = axes[i];
            const projection1 = shape.project(axis);
            const projection2 = this.project(axis);

            // 有一条投影轴上不相交，那么两个多边形不相交
            if(!projection1.overlaps(projection2)) {
                return true
            }
        }
        return false
    }
    project(axis) {
        throw 'project(axis) not implemented'
    }
    getAxes() {
        throw 'getAxes() not implemented'
    }
    move(dx, dy) {
        throw 'move(dx, dy) not implemented'
    }

    createPath(context) {
        throw 'createPath(context) not implemented'
    }
    drawIndex(context, index, x, y) {
        context.save();
        context.fillStyle = 'black';
        context.font = '18px Arial';
        context.fillText(index, x-9, y+9);
        context.restore();
    }
    fill(context) {
        context.save()
        context.fillStyle = this.fillStyle
        this.createPath(context)
        context.fill()
        context.restore()
    }
    stroke(context) {
        context.save()
        context.strokeStyle = this.strokeStyle
        this.createPath(context)
        context.stroke()
        context.restore()
    }
    isPointInPath(context, x, y) {
        this.createPath(context)
        return context.isPointInPath(x, y)
    } 
}