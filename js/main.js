import Polygon from './collision/sat/Polygon'
import Point from './collision/sat/Point'
import CollisionManager from './collision/index.js';

const POLYGONS = [
    [new Point(0, 0), new Point(0, 50), new Point(50, 50)],
    // [new Point(0, 0), new Point(0, 50), new Point(50, 50), new Point(50, 0)],
    [new Point(20, 0), new Point(0, 50), new Point(50, 50), new Point(70, 0)],
    [new Point(20, 0), new Point(40, 0), new Point(60, 20), new Point(60, 40), new Point(40, 60), new Point(20, 60), new Point(0, 40), new Point(0, 20)],
    [new Point(20, 0), new Point(40, 0), new Point(60, 25), new Point(40, 50), new Point(20, 50), new Point(0, 25)]
];
const COLORS = ['blue', 'yellow', 'red', 'green', 'pink'];

export default class Test {
    constructor({num, canvas, width, height, visible = true}) {
        this.canvas = canvas || document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');

        this.shapes = [];
        this.num = num || 100;

        this.width = width;
        this.height = height;

        this.visible = visible;

        this.collisionManager = new CollisionManager(width, height);
        
        this.timer = null;
        this.elapsed = [];

        this.init();
        this.loop = this.loop.bind(this);
    }

    init() {
        for(let i = 0; i < this.num; i++) {
            // random select from 3\4\6\8 polygon
            const index = Math.round(Math.random() * 3);
            const polygon = new Polygon(i, COLORS[index]);
            // console.log(index)
            const points = POLYGONS[index];
        
            points.forEach( point => {
                polygon.addPoint(point.x, point.y);
            });
        
            // move to random position
            const random_x = Math.random() * this.width;
            const random_y = Math.random() * this.height;
            polygon.move(random_x, random_y, this.width, this.height);
        
            // give the shape a speed
            polygon.vx = (Math.random() > 0.5 ? 1 : -1 )* Math.ceil(Math.random() * 5);
            polygon.vy = (Math.random() > 0.5 ? 1 : -1 )* Math.ceil(Math.random() * 5);
            this.shapes.push(polygon);
        }
        // this.drawShapes();
        // console.log('all: ', this.shapes)
    }

    start() {
        this.timer = requestAnimationFrame(this.loop);
    }

    stop() {
        cancelAnimationFrame(this.timer);
        // console.log(this.elapsed);
        const abandon = this.elapsed.filter( t => t > 16).length;

        const average = this.elapsed.reduce( (a, b) => a + b) / this.elapsed.length;
        // console.log(this.elapsed.length, abandon);
        const a = (abandon / this.elapsed.length * 100).toFixed(2) + '%'
        console.log(a, this.counter, average);
        // this.shapes.map(s => {
        //     console.log(s.id, s.collisionList);
        // })

        if(this.visible) {
            this.context.fillStyle = '#ffffff';
            this.context.fillRect(0,0,100, 100);
            this.context.fillStyle = 'black';
            this.context.font = '18px Arial';
            this.context.fillText(`${a}`, 10, 25);
            this.context.fillText(`${this.counter}`, 10, 45);
            this.context.fillText(`${average.toFixed(2)}`, 10, 65);
        }
    }

    loop() {
        // move shapes
        this.shapes.forEach(shape => {
            const { vx, vy } = shape;
            shape.move(vx, vy, this.width, this.height);
            const rect = shape.getBounds();
            rect.id = shape.id;
            rect.source = shape;
            this.collisionManager.quadtree.insert(rect);
        });

        if(this.visible) {
            this.context.clearRect(0, 0, canvas.width, canvas.height);
            this.context.fillStyle = '#ffffff';
            this.context.fillRect(0,0,this.width, this.height);
            this.drawShapes();
        }
        
        let start = Date.now();
        // this.counter = this.collisionManager.detectCollisions();
        this.counter = this.collisionManager.detectCollisionsByQuadTree(this.shapes);
        let diff = Date.now() - start;
        // console.log(diff);
        this.elapsed.push(diff);

        this.timer = requestAnimationFrame(this.loop);
    }

    drawShapes() {
        this.shapes.forEach( (shape, index) => {
            shape.stroke(this.context);
            shape.fill(this.context);
            const {x,y,width,height} = shape.getBounds();
            shape.drawIndex(this.context, index, x + width/2, y + height/2);
        });
    }
}

