const tiles = require('./tiles.js');
const yaku = require('./yaku.js');

const s = tiles.bambooSuits;
const m = tiles.characterSuits;
const p = tiles.circleSuits;

const bambooSuits = tiles.bambooSuits;
const characterSuits = tiles.characterSuits;
const circleSuits = tiles.circleSuits;

const honorTiles = tiles.honorTiles;
const Hand = tiles.Hand;

const [east, south, west, north, haku, hatsu, chun] = honorTiles;


const testHands = [
    [s[1], s[1], s[1], s[3], s[3], s[3], m[5], m[5], m[5], p[3], p[4], p[5], p[9], p[9]],
    [m[2], m[2], m[5], m[5], m[5], s[6], s[7], s[8], p[2], p[3], p[4], p[7], p[7], p[7]],
    [m[3], m[3], m[4], m[4], m[5], m[5], p[2], p[2], p[3], p[3], p[4], s[9], s[9], p[4]],
    [m[1], m[1], m[4], m[5], m[6], m[6], m[7], m[8], east, east, east, hatsu, hatsu, hatsu],
    [m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], hatsu, hatsu, hatsu, north, north],
    [m[1], m[1], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[9], m[9], m[1]],
    [m[1], m[1], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[9], m[9], m[2]],
    [m[1], m[1], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[9], m[9], m[3]],
    [m[1], m[1], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[9], m[9], m[4]],
    [m[1], m[1], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[9], m[9], m[5]],
    [m[1], m[1], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[9], m[9], m[6]],
    [m[1], m[1], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[9], m[9], m[7]],
    [m[1], m[1], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[9], m[9], m[8]],
    [m[1], m[1], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[9], m[9], m[9]],
].map(item => new Hand(item));

testHands.forEach(testHand => {
    console.log(showYaku(testHand));
});

function showYaku(hand) {
    const yakus = yaku.getYaku(hand);
    const res = [];
    for (let i = 0, _i = yakus.length; i < _i; i++) {
        res.push([]);
        for (const [key, value] of yaku.translateToChineseCharacter) {
            if (yakus[i][key]) res[i].push(value);
        }
    }
    return res;
}