'use strict';
class Tile {
    constructor(kind, string) {
        this.kind = kind;
        this.string = string;
    }
    equals(tile) {
        return this.kind === tile.kind && this.string === tile.string;
    }
    toString() {
        var res = this.string;
        var suitsPattern = /bamboo|character|circle/;
        if (suitsPattern.test(this.kind)) {
            res = ['', 'イー', 'リャン', 'サン', 'スー', 'ウー', 'ロー', 'チー', 'パー', 'キュー'][this.string];
            res += {bamboo: 'ソー', character: 'マン', circle: 'ピン'}[this.kind];
        }
        return res;
    }
};
class Hand {
    constructor(hand) {
        var emptyTile = new Tile(null, null);
        this.hand = hand;
        this.takenTile = emptyTile;
        // if this.takenTile === undefined, getAllTiles() returns the array that has undefined on the end.
        // getBamboo() expect all items to inherit Tile. So it will fail if this.takenTile === undefined.
    }
    draw(tile) {
        this.hand.push(tile);
    }
    discard(index) {
        this.hand.splice(index, 1);
    }
    getAllTiles() {
        return this.hand.concat(this.takenTile);
    }
    getBamboo() {
        return this.getAllTiles().filter(function(_) {return _.kind === 'bamboo'})
    }
    getCircle() {
        return this.getAllTiles().filter(function(_) {return _.kind === 'circle'})
    }
    getCharacter() {
        return this.getAllTiles().filter(function(_) {return _.kind === 'character'})
    }
    getWind() {
        return this.getAllTiles().filter(function(_) {return _.kind === 'wind'})
    }
    getDragon() {
        return this.getAllTiles().filter(function(_) {return _.kind === 'dragon'})
    }
    getPairs() {
        var res = [];
        var before = new Tile(null, null);
        for (var tiles = this.sort().getAllTiles(), i = 0, _i = tiles.length; i < _i; i++) {
            if (tiles[i].equals(before)) {
                res.push([[tiles[i], tiles[i]], tiles.slice(0, i - 1).concat(tiles.slice(i + 1))]);
                while (tiles[i].equals(before)) {
                    i++;
                }
            }
            before = tiles[i];
        }
        return res;
    }
    sort() {
        var bamboos = this.getBamboo();
        var circles = this.getCircle();
        var characters = this.getCharacter();
        var winds = this.getWind();
        var dragons = this.getDragon();

        bamboos.sort(sortTiles);
        circles.sort(sortTiles);
        characters.sort(sortTiles);
        winds.sort(function(a, b) {return '東南西北'.indexOf(a.string) - '東南西北'.indexOf(b.string)});
        dragons.sort(function(a, b) {return '白發中'.indexOf(a.string) - '白發中'.indexOf(b.string)});

        return new Hand(bamboos.concat(circles).concat(characters).concat(winds).concat(dragons));
        function sortTiles(a, b) {
            return Number(a.string) - Number(b.string);
        };
    }
    [Symbol.iterator]() {
        for (let hand = this.getAllTiles(), i = 0, _i = hand.length; i < _i; i++) {
            return hand[i];
        }
    }
};
var bambooSuits = [
    null,
    new Tile('bamboo', '1'), new Tile('bamboo', '2'), new Tile('bamboo', '3'),
    new Tile('bamboo', '4'), new Tile('bamboo', '5'), new Tile('bamboo', '6'),
    new Tile('bamboo', '7'), new Tile('bamboo', '8'), new Tile('bamboo', '9')
];
// bambooSuits[1] === new Tile('bamboo', '1');
var circleSuits = [
    null,
    new Tile('circle', '1'), new Tile('circle', '2'), new Tile('circle', '3'),
    new Tile('circle', '4'), new Tile('circle', '5'), new Tile('circle', '6'),
    new Tile('circle', '7'), new Tile('circle', '8'), new Tile('circle', '9')
];
var characterSuits = [
    null,
    new Tile('character', '1'), new Tile('character', '2'), new Tile('character', '3'),
    new Tile('character', '4'), new Tile('character', '5'), new Tile('character', '6'),
    new Tile('character', '7'), new Tile('character', '8'), new Tile('character', '9')
];
var honorTiles = [
    new Tile('wind', '東'), new Tile('wind', '南'),
    new Tile('wind', '西'), new Tile('wind', '北'),
    new Tile('dragon', '白'), new Tile('dragon', '發'), new Tile('dragon', '中')
];
module.exports = {
    Hand: Hand,
    bambooSuits: bambooSuits,
    circleSuits: circleSuits,
    characterSuits: characterSuits,
    honorTiles: honorTiles
};
