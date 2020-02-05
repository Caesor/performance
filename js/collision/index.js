import QuadTree from './QuadTree';

export default class CollisionManager {
    constructor(width, height) {
        this.quadtree = new QuadTree({
            x:0, y:0, width, height
        });
    }

    detectCollisions(shapes) {
        let counter = 0;
        for (let i = 0; i < shapes.length; i++) {
            const shape1 = shapes[i];
            for(let j = i + 1; j < shapes.length; j++) {
                const shape2 = shapes[j];
                counter++;
                if (shape1.collidesWith(shape2)) {
                    // console.log(shape1.points.length, shape2.points.length, shape1.fillStyle, shape2.fillStyle)
                    // console.log('------------------------')
                }
            }
        }
        this.quadtree.clear();
        return counter;
    }

    detectCollisionsByQuadTree(shapes){
        let counter = 0;
        for (let i = 0; i < shapes.length; i++) {
            const shape1 = shapes[i];
            // 清除碰撞历史
            shape1.collisionList.length = 0;
            const result = this.quadtree.retrieve(shape1.getBounds());
            for(let j = 0; j < result.length; j++) {
                const shape2 = result[j];
                // 剔除已经进过遍历检测的shape
                if(shape2.id <= i) {
                    continue;
                }
                counter++;
                if (shape1.collidesWith(shape2.source)) {
                    // 记录碰撞对
                    shape1.collisionList.push(shape2.id);
                    shape1.changeColor();
                    shape2.source.changeColor();
                    // console.log(shape1.points.length, shape2.points.length, shape1.fillStyle, shape2.fillStyle)
                    // console.log('------------------------')
                }
            }
        }
        this.quadtree.clear();
        return counter;
    }
}


