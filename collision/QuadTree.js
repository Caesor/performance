export default class QuadTree {
    constructor(bounds, max_objects = 10, max_levels = 4, level = 0) {
        this.max_objects = max_objects;
        this.max_levels = max_levels;

        this.bounds = bounds; // 屏幕范围
        this.level = level;

        this.objects = [];  // 对象
        this.nodes = [];    // 树节点
    }

    split() {
        const nextLevel = this.level + 1;
        const width = Math.round(this.bounds.width / 2);
        const height = Math.round(this.bounds.height / 2);
        const x = Math.round(this.bounds.x);
        const y = Math.round(this.bounds.y);

        //top right node
        this.nodes[0] = new QuadTree({ x: x + width, y, width, height }, this.max_objects, this.max_levels, nextLevel);
        //top left node
        this.nodes[1] = new QuadTree({ x, y, width, height }, this.max_objects, this.max_levels, nextLevel);
        //bottom left node
        this.nodes[2] = new QuadTree({ x, y: y + height, width, height }, this.max_objects, this.max_levels, nextLevel);
        //bottom right node
        this.nodes[3] = new QuadTree({ x: x + width, y: y + height, width, height }, this.max_objects, this.max_levels, nextLevel);
    }


    getIndex(rect) {
        let index = -1;
        const verticalMidPoint = this.bounds.x + (this.bounds.width / 2);
        const horizontalMidPoint = this.bounds.y + (this.bounds.height / 2);
        //rect can completely fit within the top quadrants
        const topQuadrant = (rect.y < horizontalMidPoint && rect.y + rect.height < horizontalMidPoint);
        //rect can completely fit within the bottom quadrants
        const bottomQuadrant = (rect.y > horizontalMidPoint);

        //rect can completely fit within the left quadrants
        if (rect.x < verticalMidPoint && rect.x + rect.width < verticalMidPoint) {
            if (topQuadrant) {
                index = 1;
            } else if (bottomQuadrant) {
                index = 2;
            }

            //rect can completely fit within the right quadrants	
        } else if (rect.x > verticalMidPoint) {
            if (topQuadrant) {
                index = 0;
            } else if (bottomQuadrant) {
                index = 3;
            }
        }

        return index;
    }

    insert(rect) {
        // have subnodes
        if (this.nodes.length) {
            let index = this.getIndex(rect);
            if (index !== -1) {
                this.nodes[index].insert(rect);
                return;
            }
        }

        this.objects.push(rect);
        
        if (!this.nodes.length && this.objects.length > this.max_objects && this.level < this.max_levels) {
            this.split();
            for (let i = this.objects.length - 1; i >= 0; i--) {
                let index = this.getIndex(this.objects[i]);
                if (index !== -1) {
                    this.nodes[index].insert(this.objects.splice(i, 1)[0]);
                }
            }
        }
    }

    retrieve(rect) {
        let result = [];

        if (this.nodes.length) {
            let index = this.getIndex(rect);
            if (index !== -1) { // 已经是叶子节点
                result = result.concat(this.nodes[index].retrieve(rect));
            } else {
                // 如果不属于四个象限
                const arr = carveRect(this.bounds);
                for (let i = arr.length - 1; i >= 0; i--) {
                    // 判断是否相交
                    if (this.checkIntersect(arr[i], rect)) {
                        result = result.concat(this.nodes[i].retrieve(rect));
                    }
                }
            }
        }

        result = result.concat(this.objects);

        return result;
    }

    checkIntersect(bound, rect) {
        // 两个矩形是否相交
        if (bound.x < rect.x + rect.width &&
            bound.x + bound.width > rect.x &&
            bound.y < rect.y + rect.height &&
            bound.y + bound.height > rect.y) {
            return true
        } else {
            return false
        }
    }

    clear() {
        this.objects = [];
        this.nodes = [];
        this.level = 0;
    }

    refresh(root) {
        /*
          动态更新：
            从根节点深入四叉树，检查四叉树各个节点存储的物体是否依旧属于该节点（象限）的范围之内，如果不属于，则重新插入该物体。
        */
        var objs = this.objects,
            rect, index, i, len;

        root = root || this;

        for (i = objs.length - 1; i >= 0; i--) {
            rect = objs[i];
            index = this.getIndex(rect);

            // 如果矩形不属于该象限，则将该矩形重新插入
            if (!this.isInner(rect, this.bounds)) {
                if (this !== root) {
                    root.insert(objs.splice(i, 1)[0]);
                }

                // 如果矩形属于该象限 且 该象限具有子象限，则
                // 将该矩形安插到子象限中
            } else if (this.nodes.length) {
                this.nodes[index].insert(objs.splice(i, 1)[0]);
            }
        }

        // 递归刷新子象限
        for (i = 0, len = this.nodes.length; i < len; i++) {
            this.nodes[i].refresh(root);
        }
    }

    isInner(rect, bounds) {
        // 判断矩形是否在象限范围内
        return rect.x >= bounds.x &&
            rect.x + rect.width <= bounds.x + bounds.width &&
            rect.y >= bounds.y &&
            rect.y + rect.height <= bounds.y + bounds.height;
    }
}

// 切割矩形，一分为四
function carveRect(bounds) {
    var w = bounds.width / 2;
    var h = bounds.height / 2;

    return [{
        x: bounds.x + w/*bounds.centroid.x*/,
        y: bounds.y,
        width: w,
        height: h
    }, {
        x: bounds.x,
        y: bounds.y,
        width: w,
        height: h
    }, {
        x: bounds.x,
        y: bounds.y + h/*bounds.centroid.y*/,
        width: w,
        height: h
    }, {
        x: bounds.x + w, //bounds.centroid.x,
        y: bounds.y + h, //bounds.centroid.y,
        width: w,
        height: h
    }]
}
