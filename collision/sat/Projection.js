export default class Projection {
    constructor(min, max) {
        this.min = min
        this.max = max
    }
    // 投影重叠
    overlaps(p) {
        return this.max > p.min && p.max > this.min
    }
}
