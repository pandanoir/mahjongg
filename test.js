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

const testHands = [
    [s[1], s[1], s[1], s[3], s[3], s[3], m[5], m[5], m[5], p[3], p[4], p[5], p[9], p[9]],
    [m[2], m[2], m[5], m[5], m[5], s[6], s[7], s[8], p[2], p[3], p[4], p[7], p[7], p[7]],
    [m[3], m[3], m[4], m[4], m[5], m[5], p[2], p[2], p[3], p[3], p[4], s[9], s[9], p[4]],
].map(item => new Hand(item));

testHands.forEach(testHand => {
    console.log(testHand.hand.map(tile => tileToString(tile)).join(' '));
    console.log(showYaku(testHand));
});

function showYaku(hand) {
    const yakus = yaku.getYaku(hand);
    const yakuList　= new Map([
        ['断么九', 'isAllSimples'],
        ['一盃口', 'isOneSetOfIdenticalSequences'],
        ['役牌', 'isHonorTiles'],
        ['三色同順', 'isThreeColourStraight'],
        ['混全帯么九', 'isTerminalOrHonorInEachSet'],
        ['一気通貫', 'isStraight'],
        ['三色同刻', 'isThreeColourTriplets'],
        ['三暗刻', 'isThreeClosedTriplets'],
        ['二盃口', 'isTwoSetOfIdenticalSequences'],
        ['七対子', 'isSevenPairs'],
        ['国士無双', 'isThirteenOrphans']
    ]);
    const res = [];
    for (let i = 0, _i = yakus.length; i < _i; i++) {
        res.push([]);
        for (const [key, value] of yakuList) {
            if (yakus[i][value]) res[i].push(key);
        }
    }
    return res;
}