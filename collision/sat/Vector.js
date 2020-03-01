export default class Vector {
    constructor(point) {
        if( point === undefined) {
            this.x = 0;
            this.y = 0;
        }else {
            this.x = point.x;
            this.y = point.y;
        }
        
    }
    // 获取向量大小（即向量的模），即两点间距离
    getMagnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
    }

    add(vector) {
        let v = new Vector()
        v.x = this.x + vector.x
        v.y = this.y + vector.y
        return v
    }

    // 向量相减 得到边
    subtract(vector) {
        return new Vector({
            x: this.x - vector.x,
            y: this.y - vector.y 
        });
    }

    // 点积的几何意义之一是：一个向量在平行于另一个向量方向上的投影的数值乘积。
    // 后续将会用其计算出投影的长度
    dotProduct(vector) {
        return this.x * vector.x + this.y * vector.y
    }
    
    // 由两点生成边
    edge(vector) {
        return this.subtract(vector)
    }

    // 获取当前向量的法向量（垂直）
    perpendicular() {
        return new Vector({
            x: this.y,
            y: 0 - this.x
        });
    }

    // 获取单位向量（即向量大小为1，用于表示向量方向），一个非零向量除以它的模即可得到单位向量
    normalize() {
        let v = new Vector(0, 0);
        const m = this.getMagnitude();

        if(m !== 0) {
            v.x = this.x / m
            v.y = this.y /m
        }
        return v
    }

    // 获取边缘法向量的单位向量，即投影轴
    normal() {
        return this.perpendicular().normalize();
    }
}