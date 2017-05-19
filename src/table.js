// EAST => NORTH => WEST => SOUTH
export const [EAST, SOUTH, WEST, NORTH] = ['east', 'south', 'west', 'north'];
const nextDirection = new Map([[EAST, NORTH], [NORTH, WEST], [WEST, SOUTH], [SOUTH, EAST]]);
const prevDirection = new Map([[EAST, NORTH], [NORTH, WEST], [WEST, SOUTH], [SOUTH, EAST]].map(_ => [_[1], _[0]]));

let dir = EAST;
const wallNumber = {[EAST]: 0};
wallNumber[dir = nextDirection.get(dir)] = 1;
wallNumber[dir = nextDirection.get(dir)] = 2;
wallNumber[dir = nextDirection.get(dir)] = 3;

const shuffle = _arr => {
    const arr = _arr.concat();
    for (let i = arr.length - 1; i >= 0; i--) {
        const index = 0 | Math.random() * i;
        [arr[index], arr[i]] = [arr[i], arr[index]];
    }
    return arr;
}
export default class Table {
    constructor(tiles) {
        this.tiles = tiles;
        this.size = this.tiles.length;
        this.wallSize = this.tiles.length / 4;
        this.wall = tiles;
        this.wind = EAST;
        this.leader = 0; // the index of player. anticlockwise.
    }
    start(dice) {
        // dice is the sum of two dices
        this.kongCount = 0;
        this.startPosition = [1, 0, 3, 2][(dice + this.leader) % 4] * this.wallSize + dice * 2;
        this.deadWallPosition = this.startPosition - 14;
        this.lastDrawPosition = this.startPosition - 1;

        this.startPosition %= this.size;
        this.deadWallPosition %= this.size;
        this.lastDrawPosition %= this.size;
    }
    kong() {
        this.kongCount++;
        this.deadWallPosition--;
        this.deadWallPosition %= this.size;
    }
    shuffle() {
        const shuffled = shuffle(this.tiles);
        const wallSize = this.wallSize;
        this.wall = shuffled;
        // the even index tile is on the odd index tile.
        // 0th tile is on the 1st tile.
        // if tile has bigger index, it is put on left.
        // ===========
        // | 8 6 4 2 0
        // | 9 7 5 3 1
        // ===========
    }
    draw() {
        this.lastDrawPosition++;
        this.lastDrawPosition += this.size;
        this.lastDrawPosition %= this.size;
        return this.wall[this.lastDrawPosition];
    }
    getDora() {
        const offsets = this.getDoraOffsets();
        const doras = [];
        for (let i = 0, _i = offsets.length; i < _i; i++) {
            doras.push(this.wall[offsets[i]]);
        }
        return doras;
    }
    getDoraOffsets() {
        const offset = [];
        const doraOffset = this.startPosition - 6;
        for (let i = 0; i < this.kongCount + 1; i++) {
            offset.push((doraOffset - i * 2) % this.size);
        }
        return offset;
    }
    getWall(direction) {
        const wallOffset = wallNumber[direction] * this.wallSize;
        return this.wall.slice(wallOffset, wallOffset + this.wallSize);
    }
    getDeadWall() {
        if (this.deadWallPosition + 14 > this.size) {
            return this.wall.slice(this.deadWallPosition).concat(this.wall.slice(0, (this.deadWallPosition + 14) % this.size));
        }
        return this.wall.slice(this.deadWallPosition, this.deadWallPosition + 14);
    }
    isEnd() {
        return this.deadWallPosition === this.lastDrawPosition;
    }
}