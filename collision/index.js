import QuadTree from './QuadTree';
import Polygon from './sat/Polygon';

worker.onMessage( res =>{
    const { frame, time, width , height, shapes } = res;
    const quadtree = new QuadTree({
        x:0, y:0, width, height
    });
    const polygons = [];
    for(let i = 0; i < shapes.length; i++) {
        const { id, points } = shapes[i];
        const polygon = new Polygon(id);
        points.forEach( point => {
            polygon.addPoint(point.x, point.y);
        });
        polygons.push(polygon);

        const rect = polygon.getBounds();
        rect.id = id;
        rect.source = polygon;
        quadtree.insert(rect);
    }

    const counter = detectCollisionsByQuadTree(polygons, quadtree);
    const result = polygons.map( p => p.collisionList)
    worker.postMessage({
        frame,
        time,
        counter,
        result
    });

    quadtree.clear();
});

function detectCollisionsByQuadTree(shapes, quadtree){
    let counter = 0;
    for (let i = 0; i < shapes.length; i++) {
        const shape1 = shapes[i];
        // 清除碰撞历史
        shape1.collisionList.length = 0;
        const result = quadtree.retrieve(shape1.getBounds());
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
    quadtree.clear();
    return counter;
}