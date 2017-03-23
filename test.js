const Mahjongg = require('./dist/mahjongg.js');

const [s1, s2, s3, s4, s5, s6, s7, s8, s9] = Mahjongg.bambooSuits;
const [m1, m2, m3, m4, m5, m6, m7, m8, m9] = Mahjongg.characterSuits;
const [p1, p2, p3, p4, p5, p6, p7, p8, p9] = Mahjongg.circleSuits;
const [east, south, west, north, haku, hatsu, chun] = Mahjongg.honorTiles;

const Hand = Mahjongg.Hand;

const testHands = [
    [s1, s1, s1, s3, s3, s3, m5, m5, m5, p3, p4, p5, p9, p9],
    [m2, m2, m5, m5, m5, s6, s7, s8, p2, p3, p4, p7, p7, p7],
    [m3, m3, m4, m4, m5, m5, p2, p2, p3, p3, p4, s9, s9, p4],
    [m1, m1, m4, m5, m6, m6, m7, m8, east, east, east, hatsu, hatsu, hatsu],
    [m1, m2, m3, m4, m5, m6, m7, m8, m9, hatsu, hatsu, hatsu, north, north],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m1],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m2],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m3],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m4],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m5],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m6],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m7],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m8],
    [m1, m1, m1, m2, m3, m4, m5, m6, m7, m8, m9, m9, m9, m9],
    [s3, s3, s3, s1, s1, s1, m5, m5, m5, p7, p7, p7, p9, p9],
    [m1, m1, m1, m2, m2, m2, m3, m3, m3, s7, s8, s9, p9, p9],
    [m6, m7, m8, s6, s7, s8, p6, p7, p8, p6, p7, p8, south, south],
].map(item => new Hand(item));

testHands.push(Mahjongg.createHandFromString('5m 5m 8m 8m 8m 西 西 [pong: 2s +2s 2s] [pong: 1m +1m 1m] 5m'));

testHands.forEach(testHand => {
    console.log(showYaku(testHand));
});

function showYaku(hand) {
    const yakus = Mahjongg.getYaku(hand);
    const res = [];
    for (let i = 0, _i = yakus.length; i < _i; i++) {
        res.push([]);
        for (const [key, value] of Mahjongg.translateToChineseCharacter) {
            if (yakus[i][key]) res[i].push(value);
        }
    }
    return res;
}