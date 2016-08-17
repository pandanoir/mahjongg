'use strict';
class Tile {
    constructor(kind, string, isDora) {
        if (typeof isDora === 'undefined') isDora = false;
        this.kind = kind;
        this.string = string;
        this.isRotated = false;
        this.isDora = isDora;
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
        this.hand = hand; // this includes the tile which player has drew.
        this.pong = []; // array of the tiles which is made by calling pong
        this.chow = []; // array of the tiles which is made by calling chow
        this.meldedKong = []; // array of melded kong
        this.concealedKong = []; // array of concealed kong

        // format of pong, chow or kong
        // {
        //     type: 'pong or chow or kong',
        //     tiles: [tiles...]
        // }

    }
    draw(tile) {
        this.hand.push(tile);
    }
    discard(index) {
        this.hand.splice(index, 1);
    }
    getAllTiles() {
        return this.hand.concat(this.pong).concat(this.chow).concat(this.meldedKong).concat(this.concealedKong);
    }
    getBamboo() {
        return this.getAllTiles().filter(function(_) {return _.kind === 'bamboo'})
    }
    getCharacter() {
        return this.getAllTiles().filter(function(_) {return _.kind === 'character'})
    }
    getCircle() {
        return this.getAllTiles().filter(function(_) {return _.kind === 'circle'})
    }
    getWind() {
        return this.getAllTiles().filter(function(_) {return _.kind === 'wind'})
    }
    getDragon() {
        return this.getAllTiles().filter(function(_) {return _.kind === 'dragon'})
    }
    sort() {
        var bamboos = this.getBamboo();
        var circles = this.getCircle();
        var characters = this.getCharacter();
        var winds = this.getWind();
        var dragons = this.getDragon();

        bamboos.sort(sortTiles);
        characters.sort(sortTiles);
        circles.sort(sortTiles);
        winds.sort(function(a, b) {return '東南西北'.indexOf(a.string) - '東南西北'.indexOf(b.string)});
        dragons.sort(function(a, b) {return '白發中'.indexOf(a.string) - '白發中'.indexOf(b.string)});

        newHand.pong = this.pong.concat();
        newHand.chow = this.chow.concat();
        newHand.meldedKong = this.meldedKong.concat();
        newHand.concealedKong = this.concealedKong.concat();

        return newHand;
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
