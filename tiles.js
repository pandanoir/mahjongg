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
        let res = this.string;
        const suitsPattern = /bamboo|character|circle/;
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
        return this.getAllTiles().filter(_ => _.kind === 'bamboo');
    }
    getCharacter() {
        return this.getAllTiles().filter(_ => _.kind === 'character');
    }
    getCircle() {
        return this.getAllTiles().filter(_ => _.kind === 'circle');
    }
    getWind() {
        return this.getAllTiles().filter(_ => _.kind === 'wind');
    }
    getDragon() {
        return this.getAllTiles().filter(_ => _.kind === 'dragon');
    }
    sort() {
        const is = a => {
            return _ => _.kind === a
        };
        const sortTiles = (a, b) => Number(a.string) - Number(b.string);

        const bamboos = this.hand.filter(is('bamboo'));
        const characters = this.hand.filter(is('character'));
        const circles = this.hand.filter(is('circle'));
        const winds = this.hand.filter(is('wind'));
        const dragons = this.hand.filter(is('dragon'));

        bamboos.sort(sortTiles);
        characters.sort(sortTiles);
        circles.sort(sortTiles);
        winds.sort((a, b) => '東南西北'.indexOf(a.string) - '東南西北'.indexOf(b.string));
        dragons.sort((a, b) => '白發中'.indexOf(a.string) - '白發中'.indexOf(b.string));

        const newHand = new Hand(bamboos.concat(characters).concat(circles).concat(winds).concat(dragons));
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
const bambooSuits = [
    null,
    new Tile('bamboo', '1'), new Tile('bamboo', '2'), new Tile('bamboo', '3'),
    new Tile('bamboo', '4'), new Tile('bamboo', '5'), new Tile('bamboo', '6'),
    new Tile('bamboo', '7'), new Tile('bamboo', '8'), new Tile('bamboo', '9')
];
// bambooSuits[1] === new Tile('bamboo', '1');
const characterSuits = [
    null,
    new Tile('character', '1'), new Tile('character', '2'), new Tile('character', '3'),
    new Tile('character', '4'), new Tile('character', '5'), new Tile('character', '6'),
    new Tile('character', '7'), new Tile('character', '8'), new Tile('character', '9')
];
const circleSuits = [
    null,
    new Tile('circle', '1'), new Tile('circle', '2'), new Tile('circle', '3'),
    new Tile('circle', '4'), new Tile('circle', '5'), new Tile('circle', '6'),
    new Tile('circle', '7'), new Tile('circle', '8'), new Tile('circle', '9')
];
const honorTiles = [
    new Tile('wind', '東'), new Tile('wind', '南'),
    new Tile('wind', '西'), new Tile('wind', '北'),
    new Tile('dragon', '白'), new Tile('dragon', '發'), new Tile('dragon', '中')
];
const emptyTile = new Tile(null, null);
if (module) {
    module.exports = {
        Hand: Hand,
        bambooSuits: bambooSuits,
        characterSuits: characterSuits,
        circleSuits: circleSuits,
        honorTiles: honorTiles,
        emptyTile: emptyTile
    };
}